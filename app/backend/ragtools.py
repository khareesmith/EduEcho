import re
import logging
from typing import Any

from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential
from azure.search.documents.aio import SearchClient
from azure.search.documents.models import VectorizableTextQuery

from rtmt import RTMiddleTier, Tool, ToolResult, ToolResultDirection

import aiohttp
import os

logger = logging.getLogger(__name__)

_search_tool_schema = {
    "type": "function",
    "name": "search",
    "description": "Search the knowledge base. The knowledge base is in English, translate to and from English if " + \
                   "needed. Results are formatted as a source name first in square brackets, followed by the text " + \
                   "content, and a line with '-----' at the end of each result.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query"
            }
        },
        "required": ["query"],
        "additionalProperties": False
    }
}

_grounding_tool_schema = {
    "type": "function",
    "name": "report_grounding",
    "description": "Report use of a source from the knowledge base as part of an answer (effectively, cite the source). Sources " + \
                   "appear in square brackets before each knowledge base passage. Always use this tool to cite sources when responding " + \
                   "with information from the knowledge base.",
    "parameters": {
        "type": "object",
        "properties": {
            "sources": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "description": "List of source names from last statement actually used, do not include the ones not used to formulate a response"
            }
        },
        "required": ["sources"],
        "additionalProperties": False
    }
}

async def _search_tool(
    search_client: SearchClient, 
    semantic_configuration: str,
    identifier_field: str,
    content_field: str,
    embedding_field: str,
    use_vector_query: bool,
    args: Any) -> ToolResult:
    logger.info(f"Searching for '{args['query']}' in the knowledge base.")
    vector_queries = []
    if use_vector_query:
        vector_queries.append(VectorizableTextQuery(text=args['query'], k_nearest_neighbors=50, fields=embedding_field))
    
    try:
        search_results = await search_client.search(
            search_text=args['query'], 
            top=3,
            vector_queries=vector_queries,
            select=f"{identifier_field}, {content_field}"
        )
        
        result = ""
        async for r in search_results:
            content = r[content_field]
            if len(content) > 200:
                content = content[:200] + "..."
                
            result += f"[{r[identifier_field]}]: {content}\n-----\n"
            logger.info(f"Found result: [{r[identifier_field]}]")
        return ToolResult(result, ToolResultDirection.TO_SERVER)
    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
        raise

KEY_PATTERN = re.compile(r'^[a-zA-Z0-9_=\-]+$')

async def _report_grounding_tool(
    search_client: SearchClient, 
    identifier_field: str, 
    title_field: str, 
    content_field: str, 
    args: Any) -> ToolResult:
    sources = [s for s in args["sources"] if KEY_PATTERN.match(s)]
    if not sources:
        logger.info("No valid sources to ground")
        return ToolResult({"sources": []}, ToolResultDirection.TO_CLIENT)
        
    logger.info(f"Grounding sources: {', '.join(sources)}")
    
    # Use OR to combine multiple source searches
    search_text = " OR ".join(sources)
    search_results = await search_client.search(
        search_text=search_text,
        search_fields=[identifier_field],
        select=[identifier_field, title_field, content_field],
        top=len(sources)
    )
    
    docs = []
    async for r in search_results:
        logger.info(f"Found grounding document: {r[title_field]}")
        docs.append({
            "chunk_id": r[identifier_field],
            "title": r.get(title_field, "Unknown"),
            "chunk": r[content_field]
        })
    
    return ToolResult({"sources": docs}, ToolResultDirection.TO_CLIENT)

def attach_rag_tools(rtmt: RTMiddleTier,
    credentials: AzureKeyCredential | DefaultAzureCredential,
    search_endpoint: str, search_index: str,
    semantic_configuration: str,
    identifier_field: str,
    content_field: str,
    embedding_field: str,
    title_field: str,
    use_vector_query: bool
    ) -> None:
    if not isinstance(credentials, AzureKeyCredential):
        credentials.get_token("https://search.azure.com/.default")
    search_client = SearchClient(search_endpoint, search_index, credentials, user_agent="RTMiddleTier")

    rtmt.tools["search"] = Tool(schema=_search_tool_schema, target=lambda args: _search_tool(search_client, semantic_configuration, identifier_field, content_field, embedding_field, use_vector_query, args))
    rtmt.tools["report_grounding"] = Tool(schema=_grounding_tool_schema, target=lambda args: _report_grounding_tool(search_client, identifier_field, title_field, content_field, args))
