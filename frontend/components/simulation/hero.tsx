"use client";

import { useI18n } from "@/lib/i18n/context";

export function HeroSection() {
  const { dictionary } = useI18n();

  return (
    <section className="rounded-2xl border border-border-subtle bg-background-raised/60 p-6 shadow-panel-soft backdrop-blur">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-accent-compound">
            {dictionary.app.name}
          </p>
          <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">{dictionary.hero.title}</h2>
          <p className="text-sm text-text-muted sm:text-base">{dictionary.hero.subtitle}</p>
          <p className="text-xs text-text-muted sm:text-sm">{dictionary.header.tagline}</p>
        </div>
        <div className="grid gap-3 text-xs text-text-muted sm:grid-cols-2">
          <p className="rounded-xl border border-border-subtle bg-background-muted/50 p-4">
            {dictionary.hero.educationalDisclaimer}
          </p>
          <p className="rounded-xl border border-border-subtle bg-background-muted/50 p-4">
            {dictionary.hero.legalDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
