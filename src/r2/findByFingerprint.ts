import { HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import r2Client, { BUCKET_NAME, SESSION_PREFIX } from "./client";
import { readSession } from "./readSession";
import type { SessionData } from "./types";

export async function findByFingerprint(fingerprint: string): Promise<SessionData | null> {
  const list = await r2Client.send(
    new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: SESSION_PREFIX })
  );

  const keys = (list.Contents ?? [])
    .map((obj) => obj.Key)
    .filter((key): key is string => !!key);

  const matches: { sessionId: string; lastModified: Date }[] = [];

  for (const key of keys) {
    const head = await r2Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    if (head.Metadata?.fingerprint === fingerprint) {
      matches.push({
        sessionId: key.slice(SESSION_PREFIX.length, -".json".length),
        lastModified: head.LastModified ?? new Date(0),
      });
    }
  }

  if (matches.length === 0) return null;

  matches.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

  return readSession(matches[0].sessionId);
}
