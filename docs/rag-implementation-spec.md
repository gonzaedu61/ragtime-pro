# Ragtime-Pro RAG Implementation Spec

Living implementation spec for the site's RAG (Retrieval-Augmented Generation) feature. Merged from three source PDFs and reorganized by topic. This document will continue to be refined as the solution is implemented — treat it the same way as `website-specification.md`: update it deliberately, not automatically.

**Source documents** (in project root):
1. `1. Ragtime-Pro WebSite General RAG Specs.pdf` — overall architecture, chunking, retrieval pipeline, performance, repo structure
2. `2. RAG Session Management Spec.pdf` — session identity, cookies, fingerprinting, R2 session API
3. `3. RAG History Summarization Spec.pdf` — conversation summarization triggers, prompts, workflow

---

## 1. Overview

A fully serverless Retrieval-Augmented Generation pipeline for the Ragtime-Pro website, running entirely inside Vercel serverless functions:

- **Static local RAG artifacts** — embeddings, BM25 index, cross-encoder model, all generated offline and committed to the repo
- **Hybrid retrieval** — dense (embeddings) + sparse (BM25)
- **Cross-encoder re-ranking** — local ONNX model
- **Conversation memory** — stored per-session in Cloudflare R2
- **Azure OpenAI** — used for final answer generation and conversation summarization, reusing the same credentials already configured for the contact-form AI auto-reply (see §7.3)

No vector database, no Python runtime, and no persistent server processes are required, at inference or at build time. The original spec's offline build step (§3) was written around Python scripts (`rank_bm25`, `sentence-transformers`, manual ONNX export); this project implements the entire offline build in Node/TypeScript instead — `@huggingface/transformers` (formerly `@xenova/transformers`) for embeddings and a pre-converted ONNX cross-encoder, and a hand-rolled BM25 implementation — to stay consistent with this repo's npm-only convention (see CLAUDE.md §2.1) and avoid a second toolchain.

---

## 2. Corpus Chunking

**Chunk size:** target 200–300 tokens, maximum 350 tokens
**Overlap:** 50–100 tokens between consecutive chunks

**Chunk boundaries** — split on semantic boundaries:
- Headings
- Paragraphs
- Bullet lists
- Code blocks

**Normalization:**
- Remove excessive whitespace
- Preserve headings and section markers

**Output format** (`rag_data/chunks.json`):
```json
[
  {
    "id": "chunk_0001",
    "doc_id": "roadmap_v1",
    "section": "Meta-agent architecture overview",
    "text": "Ragtime's meta-agent architecture consists of...",
    "tokens": 245
  }
]
```

### 2.6 Implementation Notes

**Corpus source:** every file in `docs/RAG_Source_Docs/` (currently one Markdown file and two PDFs). Each source file is extracted and chunked independently — Markdown via its own `#`/`##` headings, PDFs via plain-text extraction with a lightweight heading heuristic (a short line, ≤80 characters, with no terminal punctuation, immediately followed by a paragraph, is treated as a section label; otherwise the section falls back to the document title). PDF section labels are therefore best-effort, not true structural headings — revisit if retrieval quality suffers.

**Single merged index:** chunks from all source files are merged into one flat `rag_data/chunks.json` with sequential IDs (`chunk_0001`, `chunk_0002`, …) rather than one file per source. This is required for correctness, not just convenience — BM25 (§3.2) needs corpus-wide IDF/avgdl statistics, and dense retrieval scores a query against the whole corpus at once. Each chunk keeps a `doc_id` (slugified source filename) so results remain traceable to their source document.

**Token counting:** chunk sizing uses `gpt-tokenizer` (`o200k_base` encoding) for accurate token counts rather than a word-count approximation, since the `tokens` field is part of the committed output format.

**Toolchain:** `build/chunk/chunkCorpus.ts` (run via `npm run rag:chunk`, using `tsx`), with `pdf-parse` for PDF text extraction.

---

## 3. Offline Build Step

Performed once during build; everything under `/rag_data` and `/models` is generated offline and committed to the repo.

### 3.1 Dense Embeddings (`rag_data/embeddings.json`)

- Model: **all-MiniLM-L6-v2** (384-dim), run via `@huggingface/transformers` in Node — no Python
- For each chunk: compute embedding, store as a float array

```json
[
  {
    "id": "chunk_0001",
    "embedding": [0.0123, -0.4421, 0.9982]
  }
]
```

### 3.2 Sparse BM25 Index (`rag_data/bm25.json`)

- Built with a hand-rolled TypeScript BM25 implementation (no Python `rank_bm25`)
- Tokenize chunks (lowercase, whitespace split)
- Compute tokenized docs, IDF values, average document length

```json
{
  "doc_ids": ["chunk_0001", "chunk_0002"],
  "tokenized_docs": [
    ["ragtime", "meta-agent", "architecture"],
    ["resolver", "legacy", "erp"]
  ],
  "idf": { "ragtime": 3.2, "meta-agent": 4.1 },
  "avgdl": 220.5
}
```

### 3.3 Cross-Encoder Model

- Model: **`Xenova/ms-marco-MiniLM-L-6-v2`** — an already ONNX-converted version of `cross-encoder/ms-marco-MiniLM-L-6-v2` published for `@huggingface/transformers`, downloaded and cached locally rather than manually exported from PyTorch
- Stored under `models/` (see §3.4 — not `models/cross_encoder/` as originally sketched; the on-disk layout is dictated by the library's own cache, not a name we choose)
- **Not a real classifier:** its `config.json` has `id2label: {"0": "LABEL_0"}` — a single-label regression head. The raw logit *is* the relevance score. The high-level `text-classification` pipeline applies softmax over the logits, which for one value always returns `1.0` — useless for ranking. The runtime loader (§4.5) goes through `AutoTokenizer` + `AutoModelForSequenceClassification` directly and reads the raw logit instead.

### 3.4 Model Storage: Build-Time, Not Committed

Both the embedding model and the cross-encoder are fetched into `models/` — not `.cache/`, not committed to git:

- **Why not commit them:** ~175MB combined (unquantized fp32 ONNX weights for both models) — too large to put in version control.
- **Why they can't be downloaded at request time:** the cross-encoder must be available synchronously inside the Vercel function; a cold-start network fetch to Hugging Face on every cold start would be slow and adds an external dependency to the request path, contradicting the "static local artifacts" framing in §1.
- **The resolution:** `npm run build` runs `npm run rag:models` first (see `package.json`), which warms the cache by calling the exact same `embedQuery()` / `scorePassages()` functions the runtime uses (no separate download code path to drift out of sync). Next.js's `outputFileTracingIncludes` (in `next.config.js`) then bundles whatever's in `models/` into the deployed function — verified by inspecting `.next/server/app/api/rag/retrieve/route.js.nft.json`, which lists all 8 model files after a build.
- **Local dev:** `models/` is gitignored. `npm run dev` without ever running `rag:models` still works — the loaders fall through to a live download on first use (library default `allowRemoteModels: true`), just slower on the very first request.
- **Global cache gotcha:** `@huggingface/transformers`' `env.cacheDir` is a *global* setting shared by every pipeline in the process. Setting it independently in two different loader modules would race (whichever loads last silently wins). `src/rag/loaders/transformersEnv.ts` is the single place it's configured; every other loader imports it for its side effect. Both models live inside the same `models/` root — the library namespaces them automatically by Hub ID (`models/Xenova/all-MiniLM-L6-v2/...`, `models/Xenova/ms-marco-MiniLM-L-6-v2/...`), so no manual directory separation is needed.

---

## 4. Runtime Retrieval Pipeline (Vercel Serverless)

**Inputs:** user query, session ID (cookie), conversation history (from R2)

### 4.1 Dense Retrieval
- Load `embeddings.json` at module scope, convert to `Float32Array`
- Compute query embedding via `@xenova/transformers`
- Compute cosine similarity across all chunks

### 4.2 Sparse Retrieval (BM25)
- Load `bm25.json` at module scope
- Tokenize query, compute BM25 score per chunk

### 4.3 Hybrid Scoring
```
hybrid_score = α * dense_score + (1 - α) * sparse_score
```
- Default `α = 0.5`
- Select top-N = **20** candidates

### 4.4 Cross-Encoder Re-Ranking
- For each of the top-N candidates, score `(query, chunk.text)` pairs for relevance
- Sort by cross-encoder score
- Select top-k = **10** final chunks

### 4.5 Implementation Notes

**Hybrid score normalization (not in the original formula, but necessary):** dense scores (cosine similarity, roughly 0–1) and sparse scores (BM25, unbounded — easily 5–15+ in this corpus) live on completely different scales. Combining them with a raw weighted sum as written in §4.3 would leave the result dominated by BM25's larger magnitude regardless of `α`. `src/rag/retrieval/hybrid.ts` min-max normalizes each score list to [0, 1] *per query* before combining. `α = 0.5` and top-N = 20 remain as specified.

**Text-pair encoding for the cross-encoder:** the tokenizer is called with its native `text_pair` option (`tokenizer(queries, { text_pair: passages })`), not string concatenation with a literal `"[SEP]"` — a literal separator string would be tokenized as ordinary text, not the model's actual special token, silently corrupting every score.

**Module layout:**
- `src/rag/loaders/` — `transformersEnv.ts` (shared cache config), `loadEmbeddingModel.ts` (`embedQuery`), `loadCrossEncoder.ts` (`scorePassages`), `loadChunks.ts`, `loadEmbeddings.ts`, `loadBM25.ts` (the last three are static `@rag_data/*.json` imports — a new `tsconfig.json` path alias — not `fs.readFile`, so Next.js's bundler traces and inlines them automatically)
- `src/rag/retrieval/` — `dense.ts`, `sparse.ts`, `hybrid.ts`, `rerank.ts`, matching the spec's intended structure
- `src/app/api/rag/retrieve/route.ts` — `POST { query }`, runs hybrid search → rerank, returns top-k chunks with both scores. Verified end-to-end against the live corpus (queries about EU AI Act risk classification and Boost Points both returned correctly relevant, correctly-ordered results across all three source documents).

---

## 5. Session Management (Cloudflare R2)

### 5.1 Purpose

Provides:
- A unique session identifier per conversation
- Persistence of conversation history in Cloudflare R2
- A fingerprint-based continuity heuristic for returning users without accounts
- A safe user-confirmation flow before restoring a previous session
- A deterministic read/write interface from Vercel serverless functions

Enables multi-turn interaction while keeping runtime fully stateless.

### 5.2 Session Identifier

Canonical ID — UUID v4, random, collision-proof, opaque, not derived from user data:
```js
sessionId = crypto.randomUUID()
```

**Client cookie:**
```
Name:     rag_session
Value:    <sessionId>
HttpOnly: true
SameSite: Lax
Path:     /api
Max-Age:  30 days
```

### 5.3 Fingerprint Heuristic

Used **only** when the user has no session cookie and continuity needs to be checked.

```js
fingerprint = sha256(ip + userAgent)
```

**Privacy requirements:**
- Never store raw IPs — only the hashed fingerprint
- Use the fingerprint only for possible matches, never as identity

### 5.4 Session File Format

Bucket: `ragtime-site-conversations`
Key format: `conversations/{sessionId}.json`

```json
{
  "sessionId": "uuid",
  "fingerprint": "hashed-ip-ua",
  "history": [
    { "role": "user", "content": "Explain Ragtime architecture." },
    { "role": "assistant", "content": "Ragtime is a meta-agent framework..." }
  ],
  "summary": "User is exploring Ragtime meta-agent and resolver design.",
  "lastSeen": "2026-08-13T15:18:00Z"
}
```

| Field | Description |
|---|---|
| `sessionId` | Canonical session identifier |
| `fingerprint` | Hashed IP + UA, for continuity detection |
| `history` | Full list of messages (trimmed as needed) |
| `summary` | Optional compressed history for long conversations |
| `lastSeen` | ISO timestamp of last interaction |

### 5.5 Session Lifecycle

**New request flow:**
1. Check for cookie `rag_session`
   - Present → load session from R2
   - Missing → proceed to fingerprint matching
2. Compute fingerprint: `sha256(ip + userAgent)`
3. Search R2 for a matching fingerprint
   - None found → create new session
   - Found → proceed to confirmation
4. Ask the user for confirmation:
   > "It looks like you may have a previous conversation. Would you like to continue where you left off?"
5. User response: **yes** → load previous session; **no** → create new session

**Creating a new session:**
1. `sessionId = crypto.randomUUID()`
2. Create initial session file with empty `history`, empty `summary`, current `lastSeen`
3. Save to R2 under `conversations/<sessionId>.json`
4. Set cookie `rag_session=<sessionId>`

**Updating a session (each turn):**
1. Load session file from R2
2. Append the new user message to `history`
3. Append the assistant message after response generation
4. If `history.length` exceeds the threshold (default 20 messages) → generate/update summary via Azure OpenAI, truncate older messages (see §6)
5. Update `lastSeen`
6. Write the updated file back to R2

### 5.6 Session API (to implement)

| Function | Behavior |
|---|---|
| `readSession(sessionId)` | Fetches `conversations/{sessionId}.json`, returns parsed JSON, or `null` if missing |
| `writeSession(sessionData)` | Writes JSON to R2, overwriting any existing file |
| `findByFingerprint(fingerprint)` | Lists objects under `conversations/`, returns the most recent session with a matching fingerprint, or `null` |
| `createSession(ip, userAgent)` | Generates a new `sessionId`, computes fingerprint, creates the session file, returns `{ sessionId, session }` |
| `updateSession(sessionId, updates)` | Merges `updates` into the existing session, writes back to R2 |

### 5.7 Error Handling

- **Missing session file** (`readSession` returns `null`) → create a new session, set cookie, continue normally
- **Corrupted JSON** → log error, create a new session, do not attempt recovery
- **Fingerprint collision** (multiple matches) → select the most recent by `lastSeen`, ask the user for confirmation

### 5.8 Security Requirements

- All R2 operations use private API tokens stored in Vercel environment variables
- Session cookies: `HttpOnly`, `SameSite=Lax`, not accessible to client JS
- Fingerprints must be SHA-256 hashed
- No raw IPs stored anywhere

### 5.9 Integration Points

**Used by:** retrieval pipeline (injects conversation history), answer generation (includes summary + recent turns), frontend chat UI (maintains continuity)

**Provides:** deterministic session identity, persistent multi-turn memory, safe continuity detection, clean R2 storage structure

---

## 6. Conversation Summarization

### 6.1 Purpose

Keeps multi-turn interactions contextually coherent, token-efficient, scalable, and serverless-friendly by compressing older turns into a concise summary stored in R2 — long-term memory without exceeding token limits or degrading retrieval quality.

### 6.2 Trigger Conditions (any one triggers summarization)

- **History length:** `history.length > MAX_HISTORY_LENGTH` (default **20 messages**)
- **Token count:** combined history exceeds **1500–2000 tokens**
- **Explicit user request:** "Summarize our conversation", "Give me a recap", "What have we discussed so far"
- **Session restoration:** when a returning user's session is restored (via cookie or fingerprint match), the system may summarize the previous session before continuing

### 6.3 Summary Goals

The summary must:
- Capture intent, goals, and context
- Preserve facts the user has provided
- Preserve assistant commitments
- Exclude irrelevant chit-chat
- Be stable across turns (not drift)
- Stay short — target **150–250 tokens**, hard cap **250 tokens**

Stored in the session file as a single string (see §5.4).

### 6.4 Summarization Prompt

**System prompt:**
> You are a conversation summarization model. Your task is to compress the conversation into a concise, factual summary that preserves the user's goals, context, and constraints. Do not include irrelevant small talk. Do not invent details. Capture only what is necessary for future turns.

**User prompt template:**
```
Summarize the following conversation so it can be used as context in future turns.

Conversation:
{{history}}

Requirements:
- Preserve user goals and constraints.
- Preserve assistant commitments.
- Preserve important facts.
- Remove irrelevant details.
- Keep the summary under 250 tokens.
- Output only the summary text.
```

### 6.5 Summarization Workflow

1. **Load session:** `session = readSession(sessionId)`
2. **Check thresholds:** if `history.length > 20` or token count `> 1500` → trigger summarization
3. **Build prompt:** insert `session.summary` (if it exists) and the full `session.history`
4. **Call Azure OpenAI** to generate the new summary
5. **Update session file:**
   ```js
   session.summary = <newSummary>
   session.history = last N messages (e.g., last 4)
   session.lastSeen = now
   writeSession(session)
   ```

### 6.6 Using the Summary in Retrieval / Answer Generation

- Prepend to the final answer prompt: `Conversation summary:\n{{session.summary}}`
- Include the last few messages from `session.history`
- **Do not** feed the summary into dense/sparse retrieval — it's for LLM reasoning only, not for RAG chunk retrieval

### 6.7 Stability Requirements

- **No drift** — summary must not change meaning across turns
- **No overwriting of user intent** — if the user changes goals, the summary must reflect the new goals
- **No loss of critical information** — critical facts stay in the summary until the user explicitly invalidates them
- **No redundant growth** — summary stays ≤250 tokens

### 6.8 Error Handling

- **Summarization call fails** → keep the existing summary, truncate history to last N messages, log the error
- **Corrupted summary** (empty or malformed) → regenerate from full history
- **Missing summary** (`summary == ""`) → generate immediately

---

## 7. Final Answer Generation (Azure OpenAI)

### 7.1 Prompt Composition

In order:
1. System instructions
2. Conversation summary
3. Recent conversation turns
4. Top-k retrieved chunks
5. User query

### 7.2 Flow

1. Retrieve → hybrid score → cross-encoder re-rank → top-k chunks
2. Load conversation history from R2
3. Build final prompt
4. Call Azure OpenAI
5. Return answer
6. Append assistant message to the R2 session file

### 7.3 Azure OpenAI Credentials

Reuse the same Azure OpenAI resource already configured for the contact-form AI auto-reply (`src/lib/aiReply.ts`), rather than provisioning a separate one:

- SDK: `AzureOpenAI` from `openai/azure`
- `endpoint: process.env.AZURE_OPENAI_ENDPOINT`
- `apiKey: process.env.AZURE_AI_PROJECT_API_KEY`
- `apiVersion: "2024-12-01-preview"`
- `deployment: "o4-mini"`

Both env vars are already present in `.env.local`. The RAG answer-generation and summarization calls (§6.4, §7.1) should instantiate the client the same way; confirm whether `o4-mini` is the right deployment for RAG answers/summarization or whether a different deployment on the same resource should be used once cost/latency needs are clearer.

### 7.4 Implementation Notes

**Module layout:**
- `src/rag/prompts/answerPrompt.ts` — `buildAnswerMessages()`, assembling messages in the exact §7.1 order: system instructions → summary (only if non-empty) → full conversation history → retrieved context (only if any chunks matched) → the new user query as the final turn
- `src/rag/answer.ts` — `generateAnswer(query, session)`: runs `hybridSearch` → `rerankCandidates` → builds the prompt → calls Azure OpenAI, own `AzureOpenAI` client instance (not shared with `aiReply.ts`, to avoid touching existing unrelated code — same credentials and deployment, per §7.3)
- `src/app/api/rag/answer/route.ts` — `POST { query }`. Resolves the session from the `rag_session` cookie; if missing, auto-creates a fresh session directly (skips the fingerprint-continuity confirmation dance — that's `GET /api/rag/session`'s job, callable separately by the frontend before the chat starts if it wants that UX). Appends both the user query and the assistant answer to R2 history via `updateSession` after a successful generation.
- `SESSION_COOKIE` / `SESSION_COOKIE_MAX_AGE` were promoted from copy-pasted per-route constants (in `session/route.ts`, `session/confirm/route.ts`) into `src/rag/session.ts`, now imported by all three session-touching routes including this one.

**System prompt:** instructs the model to answer only from retrieved context, admit uncertainty rather than invent pricing/commitments, and point uncertain visitors to the contact form — consistent with the tone in `aiReply.ts` and CLAUDE.md §8's content rules.

**Formatting:** plain bulleted/numbered lists are explicitly allowed for enumerable content (steps, categories, risk tiers) — no markdown syntax (`**bold**`, `#` headers, code fences), since the chat widget renders plain text but does preserve line breaks (confirmed with the product owner; see the 2026-08-14 eval).

**Call-to-action rules**, tuned after reviewing 16 real Q&A pairs (see `docs/rag-qa-eval-2026-08-14.md`) — the model was inconsistently appending "book an intro call" nudges to purely definitional answers, driven by CTA copy bleeding in from retrieved website chunks rather than any deliberate rule. Two explicit rules replace that emergent behavior:
- **Topical:** the system prompt instructs the model to only invite the visitor to the contact form / intro call when the *question itself* is about next steps, pricing, timelines, implementation phases, or engaging Ragtime-Pro — not on informational/definitional questions.
- **Cadence:** `generateAnswer()` in `src/rag/answer.ts` computes the current turn number from `session.history.length / 2 + 1` and forces a CTA regardless of topic every 3rd consecutive question in a session (`FORCE_CTA_INSTRUCTION` appended as an extra system message in `buildAnswerMessages()` when `forceCta` is true).

Verified with a 4-turn same-session test: two definitional questions (no CTA), a third definitional question landing on turn 3 (CTA forced by cadence), and a "how long does implementation take" question on turn 4 (CTA triggered by topic, not cadence — and the model correctly declined to invent a specific timeline). See `docs/rag-qa-eval-2026-08-14.md` for the full transcript.

**Verified end-to-end** against the live Azure OpenAI resource and R2 bucket: a two-turn conversation (a question, then a pronoun-referencing follow-up — "Which of those three did you mention first?") produced a correct, context-aware answer, and the R2 session file's `history` array contained all 4 messages in the right order afterward. Also verified: the missing-cookie path auto-creates a distinct session, and a missing `query` field returns 400.

**Not implemented yet — deliberately deferred, see §11:** summarization. `session.summary` is always `""` today, and `buildAnswerMessages` includes the *entire* `session.history` unbounded (no truncation). This is faithful to the spec's pre-summarization state, not a bug, but means very long conversations will grow the prompt without limit until §6's summarization/truncation logic is built.

---

## 8. Performance Expectations

| Stage | Target |
|---|---|
| Dense + sparse + hybrid scoring | < 10 ms |
| Cross-encoder re-ranking (20 pairs) | 20–40 ms |
| Azure OpenAI answer generation | 200–400 ms |
| **Total (typical)** | **~250–450 ms** |

Corpus size: ~3,000 chunks. Embedding dimension: 384. All operations are expected to fit comfortably within Vercel serverless limits.

---

## 9. Repository Structure

```
/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── rag/
│   │           ├── session/
│   │           │   ├── route.ts          # GET — resolve session (active/new/needs-confirmation)
│   │           │   └── confirm/
│   │           │       └── route.ts      # POST — accept/decline restoring a previous session
│   │           ├── retrieve/route.ts     # hybrid retrieval + cross-encoder re-ranking
│   │           └── answer/route.ts       # full RAG answer: retrieve → rerank → Azure OpenAI → append to R2
│   │
│   ├── rag/
│   │   ├── session.ts             # session orchestration + SESSION_COOKIE/SESSION_COOKIE_MAX_AGE constants
│   │   ├── answer.ts              # generateAnswer(query, session): retrieve → rerank → Azure OpenAI
│   │   │
│   │   ├── loaders/
│   │   │   ├── transformersEnv.ts  # single source of truth for env.cacheDir (global setting - see §3.4)
│   │   │   ├── loadEmbeddingModel.ts # runtime query-embedding model, embedQuery(text)
│   │   │   ├── loadCrossEncoder.ts # cross-encoder model, scorePassages(query, passages[]) — raw logits
│   │   │   ├── loadEmbeddings.ts  # static import of embeddings.json → Float32Array[]
│   │   │   ├── loadBM25.ts        # static import of bm25.json + precomputed term-frequency maps
│   │   │   └── loadChunks.ts      # static import of chunks.json, getChunkById()
│   │   │
│   │   ├── retrieval/
│   │   │   ├── dense.ts           # cosine similarity (dot product — vectors are pre-normalized)
│   │   │   ├── sparse.ts          # BM25 scoring (Okapi, k1=1.5, b=0.75)
│   │   │   ├── hybrid.ts          # normalize + combine dense/sparse, α=0.5, top-N=20
│   │   │   └── rerank.ts          # cross-encoder rerank of top-N → top-k=10
│   │   │
│   │   ├── utils/
│   │   │   └── tokenize.ts        # tokenizer for BM25 + query
│   │   │
│   │   └── prompts/
│   │       ├── answerPrompt.ts    # buildAnswerMessages() — system + summary + history + context + query
│   │       ├── summaryPrompt.ts   # (planned) conversation summarization prompt
│   │       └── rerankPrompt.ts    # (planned, likely unneeded) optional LLM-based re-ranking prompt
│   │
│   └── r2/
│       ├── client.ts              # R2 S3-compatible client + bucket/prefix constants
│       ├── types.ts               # SessionData / SessionMessage types
│       ├── fingerprint.ts         # computeFingerprint(ip, userAgent) — SHA-256
│       ├── readSession.ts         # load conversation from R2
│       ├── writeSession.ts        # save conversation to R2
│       ├── findByFingerprint.ts   # fingerprint-based lookup (via HeadObject metadata)
│       ├── createSession.ts       # generate id + fingerprint, write initial session
│       └── updateSession.ts       # merge updates into an existing session, write back
│
├── rag_data/
│   ├── chunks.json                # chunked corpus (200–300 tokens, overlap)
│   ├── embeddings.json            # dense embeddings (MiniLM-L6-v2)
│   ├── bm25.json                  # sparse BM25 index
│   └── metadata.json              # optional corpus metadata
│
├── models/                         # gitignored — fetched by `npm run rag:models` (see §3.4), NOT committed
│   └── Xenova/
│       ├── all-MiniLM-L6-v2/           # embedding model (config.json, tokenizer.json, onnx/model.onnx)
│       └── ms-marco-MiniLM-L-6-v2/     # cross-encoder (same file layout)
│
├── build/
│   ├── chunk/
│   │   ├── extractSources.ts      # per-file-type text extraction (Markdown / PDF) → blocks
│   │   ├── chunkText.ts           # token-based chunking (target/max/overlap, HARD_MAX_TOKENS enforced)
│   │   └── chunkCorpus.ts         # entrypoint: extract + chunk + merge → rag_data/chunks.json
│   ├── embed/
│   │   └── generateEmbeddings.ts  # embedding generation via @huggingface/transformers → rag_data/embeddings.json
│   ├── bm25/
│   │   └── buildBm25.ts           # BM25 index builder → rag_data/bm25.json
│   └── export/
│       └── downloadModels.ts      # warms models/ by calling the runtime embedQuery/scorePassages functions
│
├── scripts/
│   ├── validate_rag.ts            # checks consistency of JSON files
│   ├── benchmark_retrieval.ts     # local performance tests
│   └── test_reranker.ts           # cross-encoder test harness
│
├── public/
│   └── ui_assets/                 # optional UI assets
│
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

**Notes:**
- **`/rag_data` is generated offline and committed** to the repo (`npm run rag:chunk` / `rag:embed` / `rag:bm25`, all Node/TypeScript, no Python). **`/models` is also generated offline but NOT committed** — it's fetched during `npm run build` (via `rag:models`) and gitignored; see §3.4 for why.
- **Runtime:** only `/src/app/api/rag` and `/src/rag` execute inside Vercel serverless functions. (The original spec used a generic `/src/api` path; this project is Next.js App Router, so route handlers live under `/src/app/api` per existing convention — see `/src/app/api/contact/route.ts`.)
- **R2 integration:** all conversation history I/O lives under `/src/r2`; session orchestration (cookie/fingerprint resolution) lives in `/src/rag/session.ts` and is called from the App Router route handlers.
- **Cross-encoder & embedding model:** both loaded lazily (module-scope singleton promise, created on first call) via `src/rag/loaders/loadCrossEncoder.ts` and `loadEmbeddingModel.ts`.
- **Hybrid retrieval:** dense + sparse + hybrid + cross-encoder re-ranking is implemented under `/src/rag/retrieval`, exposed via `POST /api/rag/retrieve`.

---

## 10. Implementation Deliverables Checklist

- [x] Chunking script (`build/chunk/`, `npm run rag:chunk` — 125 chunks from `docs/RAG_Source_Docs/` as of last run)
- [x] Embedding generation script (`build/embed/generateEmbeddings.ts`, `npm run rag:embed` — `Xenova/all-MiniLM-L6-v2` via `@huggingface/transformers`, 384-dim, L2-normalized)
- [x] BM25 index builder (`build/bm25/buildBm25.ts`, `npm run rag:bm25` — hand-rolled TS implementation matching `rank_bm25`'s `BM25Okapi` IDF formula)
- [x] Cross-encoder loader (`src/rag/loaders/loadCrossEncoder.ts` — `Xenova/ms-marco-MiniLM-L-6-v2`, pre-converted ONNX, no manual export needed; raw-logit scoring, see §3.3)
- [x] Hybrid retrieval implementation (`src/rag/retrieval/{dense,sparse,hybrid}.ts` — normalized combination, see §4.5)
- [x] Cross-encoder re-ranking implementation (`src/rag/retrieval/rerank.ts`)
- [x] R2 session management utilities (`readSession`, `writeSession`, `findByFingerprint`, `createSession`, `updateSession`)
- [x] Session API route (cookie resolution + confirm/decline flow — `src/app/api/rag/session/`)
- [x] Retrieval API route (`POST /api/rag/retrieve` — verified end-to-end against the live corpus)
- [x] Next.js API route integrating retrieval + answer generation (`POST /api/rag/answer` — verified end-to-end: multi-turn conversation with a pronoun-referencing follow-up, correct answer, R2 history persisted correctly)
- [x] Prompt template: final answer generation (`src/rag/prompts/answerPrompt.ts`)
- [ ] Prompt templates: summarization, re-ranking (re-ranking template likely unneeded — cross-encoder re-ranking is already implemented without an LLM prompt)
- [ ] Summarization trigger logic
- [ ] Summarization prompt builder
- [ ] Azure OpenAI summarization call
- [ ] Summary storage in R2
- [ ] History truncation logic
- [ ] Summary injection into final-answer prompts (mechanism already exists in `answerPrompt.ts` — it reads `session.summary` when non-empty; what's missing is generating that summary in the first place)
- [x] Error handling and fallback behavior — retrieval and session (answer-generation failures return a 502 with a friendly message; missing-session/corrupted-session paths handled per §5.7). Summarization error handling (§6.8) still pending, since summarization itself isn't built.

---

## 11. Open Items / Discrepancies to Resolve

- **Deployment choice for RAG calls:** confirm whether the existing `o4-mini` deployment (used for the contact-form auto-reply) is also right for RAG answer generation and summarization, or whether a separate deployment on the same Azure OpenAI resource makes more sense once cost/latency needs are clearer (see §7.3).
- **Session confirmation UX not yet built:** the `confirm` status returned by `GET /api/rag/session` needs a frontend chat-widget prompt ("It looks like you may have a previous conversation...") wired to `POST /api/rag/session/confirm` — not yet implemented, since there's no chat UI yet.
- **PDF section labels are heuristic, not structural:** since plain-text PDF extraction doesn't expose real heading metadata, PDF chunk `section` values come from a "short line, no terminal punctuation, followed by a paragraph" heuristic (see §2.6) and may be inaccurate or missing for some chunks. The Markdown source's sections are accurate (real `#`/`##` headings). Revisit if retrieval quality on PDF-sourced answers is noticeably worse.
- **Corpus is small relative to the spec's numbers:** §8's performance targets assume ~3,000 chunks; the actual current corpus is 125 chunks across 3 source files. Performance should be well within target, but re-verify once more source documents are added.
- **npm script-approval:** `onnxruntime-node` and `protobufjs` needed their install scripts explicitly approved (`npm approve-scripts`) for `@huggingface/transformers` to run inference — recorded in `package.json`'s `allowScripts` field. Anyone re-cloning the repo and running `npm install` should already inherit this via the committed `package.json`, but flagging it in case it needs re-approval in a different environment (e.g. CI).
- **Model download adds ~175MB and real time to every `npm run build`:** since `models/` isn't committed or covered by Vercel's default build cache (which caches `node_modules` and `.next/cache`, not arbitrary custom directories), every Vercel deployment build re-downloads both models fresh. Both are currently unquantized fp32 ONNX (largest variant available) — switching to a quantized `dtype` (e.g. `q8`) would cut this substantially if build time becomes a problem. Not addressed now since it works correctly as-is.
- **Unbounded conversation history until summarization exists:** `POST /api/rag/answer` includes the full `session.history` in every prompt with no truncation (see §7.4). Fine for now; will need the summarization/truncation deliverable (§6) before long conversations are safe from unbounded token growth.
- **Source data typo:** at least one source PDF (`Ragtime-Pro - Modernizing Legacy Software with AI.pdf`) contains the literal text "RagtIme-Pro" (mixed capitalization) in its opening line. Because answers are grounded in retrieved chunk text, this typo can surface verbatim in generated answers — observed once during end-to-end testing. Not a code bug; would need a source-document correction (and a re-run of `rag:chunk` + `rag:embed` + `rag:bm25`) to fix at the root, or a light post-processing pass on generated answers if that's not practical.
- **Two separate `AzureOpenAI` client instances exist** (`src/lib/aiReply.ts` for the contact-form auto-reply, `src/rag/answer.ts` for RAG answers) — same credentials and deployment, but not a shared module. Deliberate: avoided refactoring existing, unrelated code without being asked. Worth consolidating later if a third caller appears.
