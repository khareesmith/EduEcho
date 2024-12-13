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