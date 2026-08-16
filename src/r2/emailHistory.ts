import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
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
      // Mirrors findByFingerprint's pattern (src/r2/findByFingerprint.ts) -
      // stored as metadata (not just in the body) so a name/company search
      // can scan via cheap HeadObject calls instead of downloading every
      // record. Omitted entirely when absent, rather than an empty string,
      // so a search never matches on "nothing".
      Metadata: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.company ? { company: data.company } : {}),
      },
    })
  );
}

// Soft-match fallback for when a chat visitor doesn't have (or doesn't
// want to give) their email - matches on whichever of name/company the
// caller actually provides; providing both requires both to match, for
// more precision. Case-insensitive. Returns the most recently active
// match when more than one record matches.
export async function findEmailHistoryByNameOrCompany(identity: {
  name?: string;
  company?: string;
}): Promise<EmailHistoryData | null> {
  const name = identity.name?.trim().toLowerCase();
  const company = identity.company?.trim().toLowerCase();
  if (!name && !company) return null;

  const list = await r2Client.send(
    new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: EMAIL_HISTORY_PREFIX })
  );

  const keys = (list.Contents ?? [])
    .map((obj) => obj.Key)
    .filter((key): key is string => !!key);

  const matches: { email: string; lastModified: Date }[] = [];

  for (const key of keys) {
    const head = await r2Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    const metaName = head.Metadata?.name?.toLowerCase();
    const metaCompany = head.Metadata?.company?.toLowerCase();

    const nameOk = !name || metaName === name;
    const companyOk = !company || metaCompany === company;

    if (nameOk && companyOk) {
      matches.push({
        email: key.slice(EMAIL_HISTORY_PREFIX.length, -".json".length),
        lastModified: head.LastModified ?? new Date(0),
      });
    }
  }

  if (matches.length === 0) return null;

  matches.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  return readEmailHistory(matches[0].email);
}
