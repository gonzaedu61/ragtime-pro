import { AzureOpenAI } from "openai/azure";

// Separate client (not src/rag/azureClient.ts) pointed at its own deployment
// - the Azure SDK locks the deployment in at construction time and ignores
// any per-call `model:` string once one is set, so reusing the shared o4-mini
// client would have no effect. Same resource/credentials as the main site's
// client (see AZURE_OPENAI_ENDPOINT's hostname), just a different deployment,
// so no new secrets are needed. Deliberately scoped to ALMENDRO only - the
// main site's RAG chat stays on o4-mini for now.
//
// Model history for this call site: o4-mini (reasoning, unpredictable
// latency - reasoning-token count varied 704-2240 on identical prompts) ->
// tried gpt-4o-mini (non-reasoning, fast, but unreliable on this project's
// many-rule system prompt - a repro test got the wrong language on 1 of 2
// attempts for the same query) -> gpt-4.1-mini, which tested as both fast
// AND reliable: 5/5 correct language-matching across English/German/social
// turns in a repro suite (including the exact query that failed under
// gpt-4o-mini), correct usesManualContent/followUpTopics behavior on every
// call, and consistent 6-8s latency (vs. o4-mini's 10-78s+ variance).
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_AI_PROJECT_API_KEY,
  apiVersion: "2024-12-01-preview",
  deployment: "gpt-4.1-mini",
  timeout: 45000,
});

export default client;
