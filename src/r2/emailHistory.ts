import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { BUCKET_NAME, EMAIL_HISTORY_PREFIX } from "./client";
import type { EmailHistoryData } from "./types";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function readEmailHistory(email: string): Promise<EmailHistoryData | null> {
  try {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${EMAIL_HISTORY_PREFIX}${normalizeEmail(email)}.json`,
      })
    );

    const raw = await response.Body?.transformToString();
    if (!raw) return null;

    return JSON.parse(raw) as EmailHistoryData;
  } catch (error) {
    if ((error as { name?: string }).name === "NoSuchKey") return null;
    console.error("readEmailHistory error:", error);
    return null;
  }
}

export async function writeEmailHistory(data: EmailHistoryData): Promise<void> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${EMAIL_HISTORY_PREFIX}${data.email}.json`,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    })
  );
}
