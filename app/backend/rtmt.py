import asyncio
import json
import logging
from enum import Enum
from typing import Any, Callable, Optional

import aiohttp
from aiohttp import web
from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from progress_tracker import ProgressTracker
import re

logger = logging.getLogger("voicerag")

class ToolResultDirection(Enum):
    TO_SERVER = 1
    TO_CLIENT = 2

class ToolResult:
    text: str
    destination: ToolResultDirection

    def __init__(self, text: str, destination: ToolResultDirection):
        self.text = text
        self.destination = destination

    def to_text(self) -> str:
        if self.text is None:
            return ""
        return self.text if type(self.text) == str else json.dumps(self.text)

class Tool:
    target: Callable[..., ToolResult]
    schema: Any

    def __init__(self, target: Any, schema: Any):
        self.target = target
        self.schema = schema

class RTToolCall:
    tool_call_id: str
    previous_id: str

    def __init__(self, tool_call_id: str, previous_id: str):
        self.tool_call_id = tool_call_id
        self.previous_id = previous_id

class RTMiddleTier:
    endpoint: str
    deployment: str
    key: Optional[str] = None
    
    # Tools are server-side only for now, though the case could be made for client-side tools
    # in addition to server-side tools that are invisible to the client
    tools: dict[str, Tool] = {}

    # Server-enforced configuration, if set, these will override the client's configuration
    # Typically at least the model name and system message will be set by the server
    model: Optional[str] = None
    system_message: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    disable_audio: Optional[bool] = None
    voice_choice: Optional[str] = None
    api_version: str = "2024-10-01-preview"
    _tools_pending = {}
    _token_provider = None
    progress_tracker: ProgressTracker = None

    def __init__(self, endpoint: str, deployment: str, credentials: AzureKeyCredential | DefaultAzureCredential, voice_choice: Optional[str] = None):
        self.endpoint = endpoint
        self.deployment = deployment
        self.voice_choice = voice_choice
        if voice_choice is not None:
            logger.info("Realtime voice choice set to %s", voice_choice)
        if isinstance(credentials, AzureKeyCredential):
            self.key = credentials.key
        else:
            self._token_provider = get_bearer_token_provider(credentials, "https://cognitiveservices.azure.com/.default")
            self._token_provider() # Warm up during startup so we have a token cached when the first request arrives
        self.progress_tracker = ProgressTracker()

    async def _process_message_to_client(self, msg: str, client_ws: web.WebSocketResponse, server_ws: web.WebSocketResponse) -> Optional[str]:
        message = json.loads(msg.data)
        updated_message = msg.data
        
        if message is not None:
            match message["type"]:
                case "session.created":
                    session = message["session"]
                    # Hide the instructions, tools and max tokens from clients, if we ever allow client-side 
                    # tools, this will need updating
                    session["instructions"] = ""
                    session["tools"] = []
                    session["voice"] = self.voice_choice
                    session["tool_choice"] = "none"
                    session["max_response_output_tokens"] = None
                    updated_message = json.dumps(message)

                case "response.output_item.added":
                    if "item" in message and message["item"]["type"] == "text":
                        text = message["item"]["text"]
                        question_match = re.search(r'QUESTION: (.*?)\s*ANSWER: (.*?)\s*DIFFICULTY: (.*?)(?:\s|$)', text)
                        if question_match:
                            question = question_match.group(1)
                            answer = question_match.group(2)
                            difficulty = question_match.group(3).lower()
                            
                            session_id = message.get("session_id")
                            if session_id:
                                self._current_questions[session_id] = {
                                    "question": question,
                                    "answer": answer,
                                    "difficulty": difficulty
                                }
                                
                            text = text.replace(question_match.group(0), question)
                            message["item"]["text"] = text
                            updated_message = json.dumps(message)

                case "conversation.item.created":
                    if "item" in message and message["item"]["type"] == "function_call":
                        item = message["item"]
                        if item["call_id"] not in self._tools_pending:
                            self._tools_pending[item["call_id"]] = RTToolCall(item["call_id"], message["previous_item_id"])
                        updated_message = None
                    elif "item" in message and message["item"]["type"] == "function_call_output":
                        updated_message = None

                case "response.function_call_arguments.delta":
                    updated_message = None
                
                case "response.function_call_arguments.done":
                    updated_message = None

                case "response.output_item.done":
                    if "item" in message and message["item"]["type"] == "function_call":
                        item = message["item"]
                        logger.info(f"Processing tool call: {item['name']}")
                        tool_call = self._tools_pending[message["item"]["call_id"]]
                        tool = self.tools[item["name"]]
                        args = item["arguments"]
                        result = await tool.target(json.loads(args))
                        logger.info(f"Tool result direction: {result.destination}")
                        await server_ws.send_json({
                            "type": "conversation.item.create",
                            "item": {
                                "type": "function_call_output",
                                "call_id": item["call_id"],
                                "output": result.to_text() if result.destination == ToolResultDirection.TO_SERVER else ""
                            }
                        })
                        if result.destination == ToolResultDirection.TO_CLIENT:
                            logger.info("Sending tool result to client")
                            await client_ws.send_json({
                                "type": "extension.middle_tier_tool_response",
                                "previous_item_id": tool_call.previous_id,
                                "tool_name": item["name"],
                                "tool_result": result.to_text()
                            })
                        updated_message = None

                case "response.done":
                    if len(self._tools_pending) > 0:
                        self._tools_pending.clear()
                        await server_ws.send_json({
                            "type": "response.create"
                        })
                    if "response" in message:
                        replace = False
                        for output in message["response"]["output"]:
                            if output["type"] == "function_call":
                                replace = True
                        
                        # Add a newline after each complete response
                        await client_ws.send_json({
                            "type": "response.text.delta",
                            "delta": "\n\n"
                        })
                        
                        if replace:
                            message["response"]["output"] = [
                                output for output in message["response"]["output"]
                                if output["type"] != "function_call"
                            ]
                            updated_message = json.dumps(message)

                case "input_audio_buffer.transcript":
                    # Forward transcript messages to the client
                    await client_ws.send_json({
                        "type": "input_audio_buffer.transcript",
                        "transcript": message.get("transcript", "")
                    })
                    updated_message = None

                case "response.text":
                    # Forward text messages to the client
                    await client_ws.send_json({
                        "type": "response.text.delta",
                        "delta": message.get("text", "")
                    })
                    updated_message = None

                case "response.text.delta":
                    # Forward text delta messages to the client
                    await client_ws.send_json({
                        "type": "response.text.delta",
                        "delta": message.get("text", "")
                    })
                    updated_message = None

                case "response.text.end":
                    # Forward text end messages to the client
                    await client_ws.send_json({
                        "type": "response.text.delta",
                        "delta": "\n"  # Add a newline at the end of the response
                    })
                    updated_message = None

                case "input_audio_buffer.speech_ended":
                    # Forward speech ended messages to the client
                    await client_ws.send_json({
                        "type": "input_audio_buffer.speech_ended"
                    })
                    updated_message = None

                case "response.audio_transcript.delta":
                    if "text" in message:
                        text = message["text"]
                        if text:
                            await client_ws.send_json({
                                "type": "response.text.delta",
                                "delta": text
                            })
                    elif "delta" in message:
                        text = message["delta"]
                        if text:
                            await client_ws.send_json({
                                "type": "response.text.delta",
                                "delta": text
                            })
                    updated_message = None

                case "response.content_part.added":
                    if "content" in message and isinstance(message["content"], list):
                        for content in message["content"]:
                            if content.get("type") == "text":
                                await client_ws.send_json({
                                    "type": "response.text.delta",
                                    "delta": content.get("text", "")
                                })
                    updated_message = None

        return updated_message

    async def _process_message_to_server(self, msg: str, ws: web.WebSocketResponse) -> Optional[str]:
        message = json.loads(msg.data)
        updated_message = msg.data
        if message is not None:
            match message["type"]:
                case "session.update":
                    session = message["session"]
                    if self.system_message is not None:
                        session["instructions"] = self.system_message
                    if self.temperature is not None:
                        session["temperature"] = self.temperature
                    if self.max_tokens is not None:
                        session["max_response_output_tokens"] = self.max_tokens
                    if self.disable_audio is not None:
                        session["disable_audio"] = self.disable_audio
                    if self.voice_choice is not None:
                        session["voice"] = self.voice_choice
                    session["tool_choice"] = "auto" if len(self.tools) > 0 else "none"
                    session["tools"] = [tool.schema for tool in self.tools.values()]
                    updated_message = json.dumps(message)

        return updated_message

    async def _forward_messages(self, ws: web.WebSocketResponse):
        # Remove any trailing slashes and path components from the endpoint
        base_url = self.endpoint.rstrip('/').split('/')[0] + '//' + self.endpoint.rstrip('/').split('/')[2]
        
        async with aiohttp.ClientSession(base_url=base_url) as session:
            params = { "api-version": self.api_version, "deployment": self.deployment}
            headers = {}
            if "x-ms-client-request-id" in ws.headers:
                headers["x-ms-client-request-id"] = ws.headers["x-ms-client-request-id"]
            if self.key is not None:
                headers = { "api-key": self.key }
            else:
                headers = { "Authorization": f"Bearer {self._token_provider()}" }
            
            # Use the full path for the WebSocket connection
            ws_path = "/openai/realtime"
            async with session.ws_connect(ws_path, headers=headers, params=params) as target_ws:
                async def from_client_to_server():
                    async for msg in ws:
                        if msg.type == aiohttp.WSMsgType.TEXT:
                            new_msg = await self._process_message_to_server(msg, ws)
                            if new_msg is not None:
                                await target_ws.send_str(new_msg)
                        else:
                            print("Error: unexpected message type:", msg.type)
                    
                    # Means it is gracefully closed by the client then time to close the target_ws
                    if target_ws:
                        print("Closing OpenAI's realtime socket connection.")
                        await target_ws.close()
                        
                async def from_server_to_client():
                    async for msg in target_ws:
                        if msg.type == aiohttp.WSMsgType.TEXT:
                            new_msg = await self._process_message_to_client(msg, ws, target_ws)
                            if new_msg is not None:
                                await ws.send_str(new_msg)
                        else:
                            print("Error: unexpected message type:", msg.type)

                try:
                    await asyncio.gather(from_client_to_server(), from_server_to_client())
                except ConnectionResetError:
                    # Ignore the errors resulting from the client disconnecting the socket
                    pass

    async def _websocket_handler(self, request: web.Request):
        ws = web.WebSocketResponse()
        await ws.prepare(request)
        await self._forward_messages(ws)
        return ws
    
    def attach_to_app(self, app, path):
        app.router.add_get(path, self._websocket_handler)