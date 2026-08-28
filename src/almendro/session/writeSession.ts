import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { BUCKET_NAME, ALMENDRO_SESSION_PREFIX } from "./client";
import type { AlmendroSessionData } from "./types";

export async function writeSession(session: AlmendroSessionData): Promise<void> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${ALMENDRO_SESSION_PREFIX}${session.sessionId}.json`,
      Body: JSON.stringify(session),
      ContentType: "application/json",
    })
  );
}
