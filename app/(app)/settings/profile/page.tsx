"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Profile {
  title?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
  yearsExp?: number;
  contractTypes?: string[];
  skills?: string[];
  keywords?: string[];
}

const CONTRACT_TYPES = ["CDI", "CDD", "Freelance", "Stage", "Alternance"];

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data ?? {}))
      .catch(() => {});
  }, []);

  function toggleContract(type: string) {
    const current = profile.contractTypes ?? [];
    setProfile((p) => ({
      ...p,
      contractTypes: current.includes(type)
        ? current.filter((c) => c !== type)
        : [...current, type],
    }));
  }

  function addTag(field: "skills" | "keywords", value: string) {
    if (!value.trim()) return;
    setProfile((p) => ({ ...p, [field]: [...(p[field] ?? []), value.trim()] }));
    if (field === "skills") setSkillInput("");
    else setKeywordInput("");
  }

  function removeTag(field: "skills" | "keywords", value: string) {
    setProfile((p) => ({ ...p, [field]: (p[field] ?? []).filter((t) => t !== value) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erreur lors de la sauvegarde.");
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Profil & critères de recherche</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <Card title="Informations générales">
          <div className="space-y-4">
            <Input
              label="Titre recherché"
              value={profile.title ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
              placeholder="ex. Développeur Full Stack"
            />
            <Input
              label="Lieu préféré"
              value={profile.location ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
              placeholder="ex. Paris, Lyon"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Salaire min (k€)"
                type="number"
                value={profile.salaryMin ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, salaryMin: Number(e.target.value) || undefined }))
                }
              />
              <Input
                label="Salaire max (k€)"
                type="number"
                value={profile.salaryMax ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, salaryMax: Number(e.target.value) || undefined }))
                }
              />
            </div>
            <Input
              label="Années d'expérience"
              type="number"
              value={profile.yearsExp ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, yearsExp: Number(e.target.value) || undefined }))
              }
            />
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.remote ?? false}
                onChange={(e) => setProfile((p) => ({ ...p, remote: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600"
              />
              Télétravail souhaité
            </label>
          </div>
        </Card>

        <Card title="Types de contrat">
          <div className="flex flex-wrap gap-2">
            {CONTRACT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleContract(type)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors border ${
                  (profile.contractTypes ?? []).includes(type)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Compétences">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="ex. React, TypeScript…"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("skills", skillInput); } }}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={() => addTag("skills", skillInput)}>
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.skills ?? []).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                >
                  {skill}
                  <button type="button" onClick={() => removeTag("skills", skill)} className="hover:text-indigo-900">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Mots-clés de recherche">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="ex. startup, remote-first…"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("keywords", keywordInput); } }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => addTag("keywords", keywordInput)}
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.keywords ?? []).map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {kw}
                  <button type="button" onClick={() => removeTag("keywords", kw)} className="hover:text-slate-900">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">Profil sauvegardé ✓</p>}

        <Button type="submit" loading={loading}>
          Sauvegarder le profil
        </Button>
      </form>
    </div>
  );
}
