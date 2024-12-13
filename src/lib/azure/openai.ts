export class AzureOpenAIService {
  private client: OpenAIClient | null = null;

  constructor() {
    if (!azureConfig.openai.endpoint || !azureConfig.openai.apiKey) {
      console.warn("Azure OpenAI credentials not configured");
      return;
    }

    try {
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
      throw new Error(
        "Azure OpenAI client is not initialized. Check your credentials."
      );
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

      const deploymentName = azureConfig.openai.deploymentName;
      console.log("Using deployment:", deploymentName);

      const response = await this.client.getChatCompletions(
        deploymentName,
        messages,
        {
          temperature: 0.7,
          maxTokens: 800,
          topP: 0.95,
        }
      );

      if (!response.choices || response.choices.length === 0) {
        throw new Error("No response generated from Azure OpenAI");
      }

      return {
        explanation:
          response.choices[0].message?.content ||
          "I apologize, but I couldn't generate a response.",
        confidence: 0.95,
        sources: [],
      };
    } catch (error) {
      console.error("Azure OpenAI Error:", error);
      throw error;
    }
  }
}
