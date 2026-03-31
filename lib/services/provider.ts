import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/utils/crypto";

export async function listProviders(userId: string) {
  const keys = await prisma.providerKey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, provider: true, config: true, createdAt: true, updatedAt: true },
  });
  return keys;
}

export async function createProvider(
  userId: string,
  provider: string,
  apiKey: string,
  config?: Record<string, unknown>
) {
  const apiKeyEnc = encrypt(apiKey);
  return prisma.providerKey.create({
    data: { userId, provider, apiKeyEnc, config },
    select: { id: true, provider: true, config: true, createdAt: true },
  });
}

export async function deleteProvider(userId: string, providerId: string) {
  await prisma.providerKey.deleteMany({ where: { id: providerId, userId } });
}

export async function getDecryptedApiKey(userId: string, providerId: string): Promise<string> {
  const key = await prisma.providerKey.findFirst({
    where: { id: providerId, userId },
    select: { apiKeyEnc: true },
  });
  if (!key) throw new Error("Provider key not found.");
  return decrypt(key.apiKeyEnc);
}
