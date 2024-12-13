import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { azureConfig } from "./config"; // Make sure this path is correct

export interface GPTResponse {
  explanation: string;
  confidence: number;
  sources?: string[];
}

export class AzureOpenAIService {
  private client: OpenAIClient | null = null;

  constructor() {
    try {
      if (!azureConfig?.openai?.endpoint || !azureConfig?.openai?.apiKey) {
        console.warn("Azure OpenAI credentials not configured");
        return;
      }

      this.client = new OpenAIClient(
        azureConfig.openai.endpoint,
        new AzureKeyCredential(azureConfig.openai.apiKey)
      );
    } catch (error) {
      console.error("Failed to initialize Azure OpenAI client:", error);
    }
  }

  async generateResponse(prompt: string): Promise<GPTResponse> {
    if (!this.client) {
      return {
        explanation:
          "Azure OpenAI service is not configured properly. Please check your credentials.",
        confidence: 0,
        sources: [],
      };
    }

    try {
      const messages = [
        {
          role: "system",
          content:
            "You are a highly knowledgeable STEM tutor. Provide clear, accurate, and educational responses. Break down complex concepts into understandable explanations.",
        },
        { role: "user", content: prompt },
      ];

      const deploymentName = azureConfig?.openai?.deploymentName || "gpt-4";

      const response = await this.client.getChatCompletions(
        deploymentName,
        messages,
        {
          temperature: 0.7,
          maxTokens: 800,
          topP: 0.95,
        }
      );

      return {
        explanation:
          response.choices[0].message?.content ||
          "I apologize, but I couldn't generate a response.",
        confidence: 0.95,
        sources: [],
      };
    } catch (error) {
      console.error("Azure OpenAI Error:", error);
      return {
        explanation: "An error occurred while processing your request.",
        confidence: 0,
        sources: [],
      };
    }
  }
}
