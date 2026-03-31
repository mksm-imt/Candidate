import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchAndUpsertOffers } from "@/lib/services/offer";
import { getDecryptedApiKey } from "@/lib/services/provider";
import { SearchCriteriaSchema } from "@/lib/utils/validation";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { providerId, ...criteria } = SearchCriteriaSchema.parse(body);

    let apiKey = "mock";
    let providerName = "mock";
    let config: unknown;

    if (providerId) {
      apiKey = await getDecryptedApiKey(session.user.id, providerId);
      const pk = await prisma.providerKey.findFirst({
        where: { id: providerId, userId: session.user.id },
        select: { provider: true, config: true },
      });
      if (!pk) return NextResponse.json({ error: "Provider not found" }, { status: 404 });
      providerName = pk.provider;
      config = pk.config;
    }

    const dtos = await searchAndUpsertOffers(criteria, providerName, apiKey, config);
    const externalIds = dtos.map((o) => o.externalId);

    // Return DB records so clients have the internal DB id for creating applications
    const dbOffers = await prisma.offer.findMany({
      where: { externalId: { in: externalIds } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(dbOffers);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


