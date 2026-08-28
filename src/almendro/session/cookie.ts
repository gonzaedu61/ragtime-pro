// Separate cookie from the main site's `rag_session` (src/rag/session.ts) -
// this chat is a fully independent conversation, never linked to the main
// site's session/email history.
export const ALMENDRO_SESSION_COOKIE = "almendro_session";
export const ALMENDRO_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day
