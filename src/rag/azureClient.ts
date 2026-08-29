import { AzureOpenAI } from "openai/azure";

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_AI_PROJECT_API_KEY,
  apiVersion: "2024-12-01-preview",
  deployment: "o4-mini",
  // o4-mini's reasoning-token count varies a lot per call (measured directly:
  // 704-2240 reasoning tokens across identical calls), pushing actual
  // inference time anywhere from ~10s to ~24s for the ALMENDRO pipeline's
  // prompts. The previous 25s timeout was tight enough that a slower-than-
  // usual call would occasionally hit it and get silently aborted - the
  // openai SDK treats a client timeout as retryable and auto-retries (its
  // default maxRetries: 2), so a call that only needed a few more seconds
  // instead restarted from scratch, multiple times, and 40-70s total
  // latencies for a single answer (confirmed via Azure's own reported
  // per-call duration vs. observed wall-clock time) turned out to just be
  // stacked ~25s timeout-and-retry cycles, not the model actually being
  // that slow. Raised well above the observed variance ceiling.
  timeout: 45000,
});

export default client;
