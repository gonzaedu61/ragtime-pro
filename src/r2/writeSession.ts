import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { BUCKET_NAME, SESSION_PREFIX } from "./client";
import type { SessionData } from "./types";

export async function writeSession(session: SessionData): Promise<void> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${SESSION_PREFIX}${session.sessionId}.json`,
      Body: JSON.stringify(session),
      ContentType: "application/json",
      Metadata: { fingerprint: session.fingerprint },
    })
  );
}
