import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const hexKey = process.env.ENCRYPTION_KEY;
  if (!hexKey || hexKey.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
  }
  return Buffer.from(hexKey, "hex");
}

export function encrypt(text: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(text: string): string {
  const key = getKey();
  const parts = text.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted value format.");
  const [ivHex, tagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted).toString("utf8") + decipher.final("utf8");
}
