import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listApplications } from "@/lib/services/application";
import { Card } from "@/components/ui/Card";
import { Badge, STATUS_COLORS } from "@/components/ui/Badge";
import Link from "next/link";

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const applications = await listApplications(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mes candidatures</h1>

      {applications.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">
            Aucune candidature.{" "}
            <Link href="/offers" className="text-indigo-600 hover:underline">
              Recherchez des offres
            </Link>{" "}
            pour postuler.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Poste</th>
                  <th className="pb-3 pr-4">Entreprise</th>
                  <th className="pb-3 pr-4">Lieu</th>
                  <th className="pb-3 pr-4">Mode</th>
                  <th className="pb-3 pr-4">Statut</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-800">
                      <a
                        href={app.offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-600 hover:underline"
                      >
                        {app.offer.title}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{app.offer.company ?? "—"}</td>
                    <td className="py-3 pr-4 text-slate-600">{app.offer.location ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <Badge label={app.mode} color="gray" />
                    </td>
                    <td className="py-3 pr-4">
                      <Badge label={app.status} color={STATUS_COLORS[app.status] ?? "gray"} />
                    </td>
                    <td className="py-3 text-slate-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
