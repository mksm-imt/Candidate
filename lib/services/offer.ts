import { prisma } from "@/lib/prisma";
import { getProvider } from "@/lib/providers";
import type { SearchCriteria, OfferDto } from "@/lib/providers";

export async function searchAndUpsertOffers(
  criteria: SearchCriteria,
  providerName: string,
  apiKey: string,
  config?: unknown
): Promise<OfferDto[]> {
  const provider = getProvider(providerName);
  const offers = await provider.search(criteria, apiKey, config);

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { externalId: offer.externalId },
      create: {
        provider: offer.provider,
        externalId: offer.externalId,
        title: offer.title,
        company: offer.company,
        location: offer.location,
        salary: offer.salary,
        contract: offer.contract,
        remote: offer.remote,
        url: offer.url,
        description: offer.description,
        raw: offer.raw != null ? (offer.raw as object) : undefined,
      },
      update: {
        title: offer.title,
        company: offer.company,
        location: offer.location,
        salary: offer.salary,
        contract: offer.contract,
        remote: offer.remote,
        url: offer.url,
        description: offer.description,
        raw: offer.raw != null ? (offer.raw as object) : undefined,
      },
    });
  }

  return offers;
}

export async function listOffers(skip = 0, take = 20) {
  return prisma.offer.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}
