export interface AzureConfig {
    openai: {
      apiKey: string;
      endpoint: string;
    };
    speech: {
      key: string;
      region: string;
    };
  }
  
  export interface GPTResponse {
    explanation: string;
    confidence: number;
    sources: string[];
  }