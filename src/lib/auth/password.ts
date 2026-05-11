import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export async function hashPassword(rawPassword: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(rawPassword, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export async function verifyPassword(rawPassword: string, encoded: string): Promise<boolean> {
  const [salt, expectedHash] = encoded.split(":");
  if (!salt || !expectedHash) return false;

  const actualHash = scryptSync(rawPassword, salt, KEY_LENGTH);
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (actualHash.length !== expectedBuffer.length) return false;

  return timingSafeEqual(actualHash, expectedBuffer);
}
