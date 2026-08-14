import { AzureOpenAI } from "openai/azure";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_AI_PROJECT_API_KEY,
  apiVersion: "2024-12-01-preview",
  deployment: "o4-mini",
  timeout: 25000,
});

export default client;
