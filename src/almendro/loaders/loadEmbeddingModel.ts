import "@/rag/loaders/transformersEnv";
import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

// Deliberately NOT the main site's model (src/rag/loaders/loadEmbeddingModel.ts,
// Xenova/all-MiniLM-L6-v2) - that one is English-trained with weak-to-no
// cross-lingual alignment, which is fine for the main site's English corpus
// but breaks down against this entirely-German corpus whenever a visitor
// asks in English, or even in German phrasing that doesn't happen to reuse
// the manuals' exact vocabulary (measured directly: "Kundenauftrag" barely
// appears in the corpus at all, so a query using that perfectly normal
// German word retrieved near-random results with the English-only model).
// This multilingual model was verified to correctly discriminate a relevant
// German passage from an irrelevant one for the same query in English,
// "Kundenauftrag" phrasing, and the manual's actual "Auftragsposition"
// phrasing alike - the English-only model could not.
export const EMBEDDING_MODEL_ID = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", EMBEDDING_MODEL_ID);
  }
  return extractorPromise;
}

export async function embedQuery(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const result = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(result.data as Float32Array);
}
