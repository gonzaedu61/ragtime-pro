import { createHash } from "crypto";

export function computeFingerprint(ip: string, userAgent: string): string {
  return createHash("sha256").update(`${ip}${userAgent}`).digest("hex");
}
