export const azureConfig = {
    openai: {
      apiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY,
      endpoint: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT,
    },
    speech: {
      key: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
      region: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
    }
  };