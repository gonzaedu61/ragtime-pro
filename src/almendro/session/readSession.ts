import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { BUCKET_NAME, ALMENDRO_SESSION_PREFIX } from "./client";
import type { AlmendroSessionData } from "./types";

export async function readSession(sessionId: string): Promise<AlmendroSessionData | null> {
  try {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${ALMENDRO_SESSION_PREFIX}${sessionId}.json`,
      })
    );

    const raw = await response.Body?.transformToString();
    if (!raw) return null;

    return JSON.parse(raw) as AlmendroSessionData;
  } catch (error) {
    if ((error as { name?: string }).name === "NoSuchKey") return null;
    console.error("almendro readSession error:", error);
    return null;
  }
}
