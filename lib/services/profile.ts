import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ProfileSchema } from "@/lib/utils/validation";

type ProfileInput = z.infer<typeof ProfileSchema>;

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({ where: { userId } });
}

export async function upsertProfile(userId: string, data: ProfileInput) {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}
