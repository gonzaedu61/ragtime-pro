import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client, { BUCKET_NAME, SESSION_PREFIX } from "./client";

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${SESSION_PREFIX}${sessionId}.json`,
      })
    );
  } catch (error) {
    console.error("deleteSession error:", error);
  }
}
