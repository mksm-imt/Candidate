import "../styles/globals.css";
import { ReactNode } from "react";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Candidate – Candidatures automatiques",
  description: "Postulez automatiquement ou semi-automatiquement à des offres d'emploi.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
