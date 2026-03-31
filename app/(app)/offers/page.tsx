"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface DbOffer {
  id: string;
  provider: string;
  externalId: string;
  title: string;
  company?: string | null;
  location?: string | null;
  salary?: string | null;
  contract?: string | null;
  remote?: boolean | null;
  url: string;
  description: string;
}

export default function OffersPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [offers, setOffers] = useState<DbOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<Set<string>>(new Set());

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOffers([]);
    setLoading(true);
    try {
      const res = await fetch("/api/offers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || undefined, location: location || undefined }),
      });
      if (!res.ok) throw new Error("Erreur lors de la recherche.");
      setOffers(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(offerId: string) {
    setApplying(offerId);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, mode: "MANUAL" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur lors de la candidature.");
      }
      setApplySuccess((prev) => new Set(prev).add(offerId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la candidature.");
    } finally {
      setApplying(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Recherche d&apos;offres</h1>

      <Card title="Critères de recherche">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Titre / poste"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. Développeur React"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Lieu"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex. Paris"
            />
          </div>
          <Button type="submit" loading={loading}>
            Rechercher
          </Button>
        </form>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {offers.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{offers.length} offre(s) trouvée(s)</p>
          {offers.map((offer) => (
            <Card key={offer.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-800">{offer.title}</h2>
                    {offer.remote && <Badge label="Remote" color="green" />}
                    {offer.contract && <Badge label={offer.contract} color="blue" />}
                  </div>
                  <p className="text-sm text-slate-600">
                    {offer.company}
                    {offer.location ? ` · ${offer.location}` : ""}
                    {offer.salary ? ` · ${offer.salary}` : ""}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2">{offer.description}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md px-3 py-1.5 text-xs border border-slate-200 hover:bg-slate-50 transition-colors text-center"
                  >
                    Voir l&apos;offre
                  </a>
                  {applySuccess.has(offer.id) ? (
                    <span className="text-xs text-green-600 font-medium text-center">✓ Postulé</span>
                  ) : (
                    <Button
                      size="sm"
                      loading={applying === offer.id}
                      onClick={() => handleApply(offer.id)}
                    >
                      Postuler
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && offers.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-12">
          Lancez une recherche pour afficher les offres disponibles.
        </p>
      )}
    </div>
  );
}
