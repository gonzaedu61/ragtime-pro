// Shared between the /api/rag/session/history route and the ChatWidget
// client component - kept in its own file (no server-only imports) so it's
// safe to import from client code.
export const HISTORY_PAGE_SIZE = 20;
export const HISTORY_PAGE_SIZE_MAX = 100;
