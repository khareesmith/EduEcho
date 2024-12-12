import { AzureKeyCredential, OpenAIClient } from '@azure/openai';
import { azureConfig } from './config';
import { GPTResponse } from '@/types/azure';

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
      const response = await this.client.getCompletions('gpt-4', [prompt], {
        maxTokens: 800,
        temperature: 0.7,
      });

      return {
        explanation: response.choices[0].text,
        confidence: response.choices[0].logprobs?.token_logprobs?.[0] ?? 0.9,
        sources: []
      };
    } catch (error) {
      console.error('Azure OpenAI Error:', error);
      throw error;
    }
  }
}