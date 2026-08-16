import { S3Client } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_CLIENTS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET!;
export const SESSION_PREFIX = "conversations/";
export const EMAIL_HISTORY_PREFIX = "email-history/";

export default r2Client;
