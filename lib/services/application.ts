import { prisma } from "@/lib/prisma";
import { ApplicationMode, ApplicationStatus } from "@prisma/client";

export async function listApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: { offer: { select: { title: true, company: true, location: true, url: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplication(userId: string, id: string) {
  return prisma.application.findFirst({
    where: { id, userId },
    include: { offer: true },
  });
}

export async function createApplication(
  userId: string,
  offerId: string,
  mode: ApplicationMode,
  notes?: string
) {
  return prisma.application.create({
    data: { userId, offerId, mode, notes },
    include: { offer: { select: { title: true, company: true } } },
  });
}

export async function updateApplication(
  userId: string,
  id: string,
  data: { status?: ApplicationStatus; notes?: string }
) {
  const existing = await prisma.application.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Application not found.");

  const historyEntry = {
    at: new Date().toISOString(),
    from: existing.status,
    to: data.status ?? existing.status,
    notes: data.notes,
  };

  const history = Array.isArray(existing.history) ? existing.history : [];

  return prisma.application.update({
    where: { id },
    data: {
      ...data,
      sentAt: data.status === "SENT" ? new Date() : existing.sentAt,
      history: [...history, historyEntry],
    },
  });
}
