export const azureConfig = {
  openai: {
    apiKey: process.env.AZURE_OPENAI_KEY || "",
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4",
  },
  search: {
    endpoint: process.env.AZURE_SEARCH_ENDPOINT || "",
    apiKey: process.env.AZURE_SEARCH_ADMIN_KEY || "",
    indexName: process.env.AZURE_SEARCH_INDEX_NAME || "stem-content",
  },
  speech: {
    key: process.env.AZURE_SPEECH_KEY || "",
    region: process.env.AZURE_SPEECH_REGION || "",
  },
};
