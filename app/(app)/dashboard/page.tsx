import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge, STATUS_COLORS } from "@/components/ui/Badge";
import Link from "next/link";

async function getStats(userId: string) {
  const [totalApplications, byStatus, recentApplications] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { offer: { select: { title: true, company: true } } },
    }),
  ]);
  return { totalApplications, byStatus, recentApplications };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { totalApplications, byStatus, recentApplications } = await getStats(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 text-sm mt-1">
          Bonjour{session.user.name ? `, ${session.user.name}` : ""} 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Candidatures totales</p>
          <p className="mt-1 text-3xl font-bold text-indigo-600">{totalApplications}</p>
        </Card>
        {byStatus.map((s) => (
          <Card key={s.status}>
            <p className="text-sm text-slate-500">{s.status}</p>
            <p className="mt-1 text-3xl font-bold text-slate-800">{s._count.status}</p>
          </Card>
        ))}
      </div>

      {/* Recent applications */}
      <Card title="Candidatures récentes">
        {recentApplications.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucune candidature.{" "}
            <Link href="/offers" className="text-indigo-600 hover:underline">
              Recherchez des offres
            </Link>{" "}
            pour commencer.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentApplications.map((app) => (
              <li key={app.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{app.offer.title}</p>
                  <p className="text-xs text-slate-500">{app.offer.company}</p>
                </div>
                <Badge
                  label={app.status}
                  color={STATUS_COLORS[app.status] ?? "gray"}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
