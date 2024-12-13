import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { SearchClient, AzureSearchDocument } from "@azure/search-documents";
import { azureConfig } from "../config/azure-config";

export class RTMiddleTier {
  private openAIClient: OpenAIClient;
  private searchClient: SearchClient<AzureSearchDocument>;

  constructor() {
    // Initialize Azure OpenAI client
    this.openAIClient = new OpenAIClient(
      azureConfig.openai.endpoint,
      new AzureKeyCredential(azureConfig.openai.apiKey)
    );

    // Initialize Azure Search client
    this.searchClient = new SearchClient(
      azureConfig.search.endpoint,
      azureConfig.search.indexName,
      new AzureKeyCredential(azureConfig.search.apiKey)
    );
  }

  async processQuery(query: string): Promise<any> {
    try {
      // Search for relevant documents
      const searchResults = await this.searchDocuments(query);

      // Generate context from search results
      const context = this.generateContext(searchResults);

      // Generate response using OpenAI with context
      const response = await this.generateResponse(query, context);

      return {
        answer: response,
        citations: this.extractCitations(searchResults),
      };
    } catch (error) {
      console.error("Error processing query:", error);
      throw error;
    }
  }

  private async searchDocuments(query: string) {
    try {
      const searchResults = await this.searchClient.search(query, {
        select: ["id", "content", "title"],
        queryType: "semantic",
        top: 3,
      });

      return searchResults;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  }

  private generateContext(searchResults: any): string {
    // Combine relevant search results into context
    return searchResults.results
      .map((result: any) => result.document.content)
      .join("\n\n");
  }

  private async generateResponse(query: string, context: string) {
    const prompt = `
      Given the following context:
      ${context}
      
      Answer the following question:
      ${query}
      
      Provide a clear and educational response based on the context provided.
    `;

    const response = await this.openAIClient.getChatCompletions(
      azureConfig.openai.deploymentName,
      [
        {
          role: "system",
          content:
            "You are a knowledgeable STEM tutor. Provide clear, accurate explanations with relevant examples.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]
    );

    return response.choices[0].message?.content;
  }

  private extractCitations(searchResults: any) {
    return searchResults.results.map((result: any) => ({
      title: result.document.title,
      id: result.document.id,
    }));
  }
}
