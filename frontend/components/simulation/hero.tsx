"use client";

import { useI18n } from "@/lib/i18n/context";
import { Lock, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function HeroSection() {
  const { dictionary } = useI18n();

  return (
    <section className="glass-panel relative overflow-hidden rounded-3xl p-6 shadow-neon-strong">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-compound via-accent-highlight to-accent-simple opacity-80" />
      <div className="absolute right-6 top-6 h-10 w-10 rounded-full border border-accent-simple/30" />
      <div className="absolute right-6 top-6 h-10 w-10 animate-pulse rounded-full bg-accent-compound/30 blur-2xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-accent-simple/40 bg-background shadow-[0_0_24px_rgba(59,130,246,0.35)]">
                <img src="/logo.svg" alt={dictionary.app.name} className="h-6 w-6" />
              </div>
              <span className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-accent-compound shadow-[0_0_14px_rgba(239,68,68,0.8)]" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-accent-simple">
                {dictionary.app.name}
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">{dictionary.hero.title}</h2>
              <p className="text-sm text-text-muted sm:text-base">{dictionary.hero.subtitle}</p>
              <p className="text-xs text-accent-highlight sm:text-sm">{dictionary.header.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            <HeroBadge icon={<Sparkles size={14} />} label="Live sim" />
            <HeroBadge icon={<Lock size={14} />} label="Secure channel" />
          </div>
        </div>

        <div className="grid gap-3 text-xs text-text-muted sm:grid-cols-2">
          <p className="rounded-2xl border border-accent-simple/25 bg-background/60 p-4 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
            {dictionary.hero.educationalDisclaimer}
          </p>
          <p className="rounded-2xl border border-accent-compound/25 bg-background/60 p-4 shadow-[0_0_24px_rgba(239,68,68,0.12)]">
            {dictionary.hero.legalDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent-simple/40 bg-background/60 px-3 py-2 shadow-[0_0_18px_rgba(59,130,246,0.18)]">
      <span className="text-accent-highlight">{icon}</span>
      <span>{label}</span>
    </span>
  );
}
