import { embedQuery } from "@/rag/loaders/loadEmbeddingModel";
import { scorePassages } from "@/rag/loaders/loadCrossEncoder";

// Warms the local model cache (models/) by exercising the exact same
// functions the runtime retrieval pipeline calls. The library's own file
// cache makes repeat calls cheap once warm, so this is safe to run on every
// build - no separate "already downloaded" bookkeeping needed.
async function main() {
  console.log("Warming embedding model cache...");
  await embedQuery("warm up");

  console.log("Warming cross-encoder model cache...");
  await scorePassages("warm up query", ["warm up passage"]);

  console.log("Models ready.");
}

main().catch((error) => {
  console.error("downloadModels failed:", error);
  process.exit(1);
});
