import { AzureKeyCredential, OpenAIClient } from '@azure/openai';
import { azureConfig } from './config';

export interface GPTResponse {
  explanation: string;
  confidence: number;
  sources?: string[];
}

export class AzureOpenAIService {
  private client: OpenAIClient;

  constructor() {
    this.client = new OpenAIClient(
      azureConfig.openai.endpoint!,
      new AzureKeyCredential(azureConfig.openai.apiKey!)
    );
  }

  async generateResponse(prompt: string): Promise<GPTResponse> {
    try {
      const messages = [
        { role: "system", content: "You are a highly knowledgeable STEM tutor. Provide clear, accurate, and educational responses. Break down complex concepts into understandable explanations." },
        { role: "user", content: prompt }
      ];

      const response = await this.client.getChatCompletions(
        'gpt-4', // Make sure this matches your Azure deployment name
        messages,
        {
          temperature: 0.7,
          maxTokens: 800,
          topP: 0.95,
        }
      );

      return {
        explanation: response.choices[0].message?.content || "I apologize, but I couldn't generate a response.",
        confidence: 0.95,
        sources: []
      };
    } catch (error) {
      console.error('Azure OpenAI Error:', error);
      throw error;
    }
  }
}