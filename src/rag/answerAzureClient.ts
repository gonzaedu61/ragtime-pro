import { AzureOpenAI } from "openai/azure";

// Dedicated client for generateAnswer()'s final answer call only (src/rag/
// answer.ts) - the other o4-mini callers on this resource (emailLinkDetector.ts's
// classifiers, summarize.ts's summarizer) stay on the shared src/rag/azureClient.ts
// client, since only this call site has been validated against gpt-4.1-mini. The
// Azure SDK locks the deployment in at client construction and ignores any
// per-call `model:` string once one is set, so a separate client instance is
// required to use a different deployment - same resource/credentials as
// src/rag/azureClient.ts, just a different deployment, so no new secrets.
//
// gpt-4.1-mini replaces o4-mini here for the same reason it replaced o4-mini
// in the ALMENDRO pipeline (see src/almendro/azureClient.ts): o4-mini's
// reasoning-token count varies enormously per call, driving unpredictable
// latency for a grounded-answer task that doesn't need multi-step reasoning.
// Validated directly against this site's own system prompt (src/rag/prompts/
// answerPrompt.ts) before switching - 5/5 correct on its most failure-prone
// rules (the page-description reframing rule, CTA-invitation discipline both
// suppressed and forced, scheduling-mechanics honesty, first-person-plural
// brand voice), with consistent 4-6s latency.
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_AI_PROJECT_API_KEY,
  apiVersion: "2024-12-01-preview",
  deployment: "gpt-4.1-mini",
  timeout: 45000,
});

export default client;
