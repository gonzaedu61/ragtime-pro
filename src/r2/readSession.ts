import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { BUCKET_NAME, SESSION_PREFIX } from "./client";
import type { SessionData } from "./types";

export async function readSession(sessionId: string): Promise<SessionData | null> {
  try {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${SESSION_PREFIX}${sessionId}.json`,
      })
    );

    const raw = await response.Body?.transformToString();
    if (!raw) return null;

    return JSON.parse(raw) as SessionData;
  } catch (error) {
    if ((error as { name?: string }).name === "NoSuchKey") return null;
    console.error("readSession error:", error);
    return null;
  }
}
