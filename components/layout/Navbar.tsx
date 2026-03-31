"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/offers", label: "Offres" },
  { href: "/applications", label: "Candidatures" },
  { href: "/settings/profile", label: "Profil" },
  { href: "/settings/providers", label: "Providers" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="text-lg font-bold text-indigo-600 tracking-tight">
          Candidate
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {session?.user && (
            <span className="hidden text-sm text-slate-500 sm:block">
              {session.user.email}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
