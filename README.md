# Candidate

MVP Next.js + TypeScript + Prisma + PostgreSQL + Tailwind pour postuler automatiquement ou semi-automatiquement à des offres d’emploi.

## Démarrage
```bash
npm install
npm run prisma:generate
npm run dev
```

## Environnements
Créer un fichier `.env.local` avec :
```
DATABASE_URL="postgresql://user:password@localhost:5432/candidate"
NEXTAUTH_SECRET="changeme"
ENCRYPTION_KEY="<clé hex 64 chars>"
```

## Roadmap courte
- Auth + profil candidat
- Providers interchangeables (mock inclus)
- Recherche d’offres + scoring simple
- Création de candidatures + upload/génération de docs
- Dashboard statuts
