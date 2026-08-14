import "./transformersEnv";
import { AutoTokenizer, AutoModelForSequenceClassification } from "@huggingface/transformers";

export const CROSS_ENCODER_MODEL_ID = "Xenova/ms-marco-MiniLM-L-6-v2";

type Tokenizer = Awaited<ReturnType<typeof AutoTokenizer.from_pretrained>>;
type Model = Awaited<ReturnType<typeof AutoModelForSequenceClassification.from_pretrained>>;

let modelPromise: Promise<{ tokenizer: Tokenizer; model: Model }> | null = null;

function getCrossEncoder() {
  if (!modelPromise) {
    modelPromise = Promise.all([
      AutoTokenizer.from_pretrained(CROSS_ENCODER_MODEL_ID),
      AutoModelForSequenceClassification.from_pretrained(CROSS_ENCODER_MODEL_ID),
    ]).then(([tokenizer, model]) => ({ tokenizer, model }));
  }
  return modelPromise;
}

// This model has a single-label regression head (id2label: {"0": "LABEL_0"}), not a real
// classifier - the raw logit IS the relevance score. The high-level text-classification
// pipeline would apply softmax over that single value (always producing 1.0), so we go
// through the tokenizer/model directly instead.
export async function scorePassages(query: string, passages: string[]): Promise<number[]> {
  if (passages.length === 0) return [];

  const { tokenizer, model } = await getCrossEncoder();

  const inputs = tokenizer(
    passages.map(() => query),
    { text_pair: passages, padding: true, truncation: true }
  );

  const { logits } = await model(inputs);
  return Array.from(logits.data as Float32Array);
}
