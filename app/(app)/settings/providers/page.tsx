"use client";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ProviderKey {
  id: string;
  provider: string;
  config: unknown;
  createdAt: string;
}

const AVAILABLE_PROVIDERS = ["mock", "adzuna", "custom"];

export default function ProvidersSettingsPage() {
  const [providers, setProviders] = useState<ProviderKey[]>([]);
  const [provider, setProvider] = useState("mock");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProviders = useCallback(async () => {
    try {
      const res = await fetch("/api/providers");
      if (res.ok) setProviders(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur lors de l'ajout.");
      }
      setSuccess("Provider ajouté avec succès.");
      setApiKey("");
      await loadProviders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/providers?id=${id}`, { method: "DELETE" });
      await loadProviders();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Providers de recherche</h1>

      <Card title="Ajouter un provider">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AVAILABLE_PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Clé API"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            placeholder={provider === "mock" ? "N'importe quelle valeur pour le mock" : "Votre clé API"}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <Button type="submit" loading={loading}>
            Ajouter
          </Button>
        </form>
      </Card>

      <Card title="Providers configurés">
        {providers.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun provider configuré.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {providers.map((pk) => (
              <li key={pk.id} className="flex items-center justify-between py-3">
                <div>
                  <Badge label={pk.provider} color="indigo" />
                  <p className="mt-1 text-xs text-slate-400">
                    Ajouté le {new Date(pk.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleting === pk.id}
                  onClick={() => handleDelete(pk.id)}
                >
                  Supprimer
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
