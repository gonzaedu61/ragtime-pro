// Reuses the site's existing R2 bucket/client (src/r2/client.ts) - just a
// different key prefix, so these objects never collide with the main site's
// `conversations/` or `email-history/` ones.
export { default } from "@/r2/client";
export { BUCKET_NAME } from "@/r2/client";

export const ALMENDRO_SESSION_PREFIX = "almendro-sessions/";
