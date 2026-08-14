import path from "path";
import { env } from "@huggingface/transformers";

// env.cacheDir is a global setting shared by every pipeline in this process.
// This is the single place it gets configured, imported (for its side effect)
// by every loader that touches @huggingface/transformers, so build-time model
// warming and runtime loading always agree on where files live.
export const MODELS_DIR = path.join(process.cwd(), "models");

env.cacheDir = MODELS_DIR;
