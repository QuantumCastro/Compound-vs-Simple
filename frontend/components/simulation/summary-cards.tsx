"use client";

import { Activity, Gauge, Layers, TrendingUp, Wallet, Zap } from "lucide-react";
import { MetricCard } from "./types";

type SummaryCardsProps = {
  metrics: MetricCard[];
  title: string;
  subtitle: string;
};

export function SummaryCards({ metrics, title, subtitle }: SummaryCardsProps) {
  const accentPalette = [
    { text: "text-accent-compound", border: "border-accent-compound/40" },
    { text: "text-accent-simple", border: "border-accent-simple/40" },
    { text: "text-accent-highlight", border: "border-accent-highlight/40" },
    { text: "text-text-primary", border: "border-border-strong/40" },
  ];
  const icons = [TrendingUp, Activity, Wallet, Zap, Gauge, Layers];

  return (
    <section className="glass-panel relative overflow-hidden rounded-2xl p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent-compound via-accent-highlight to-accent-simple" />
      <header className="mb-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted">{subtitle}</p>
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric, index) => {
          const accent = accentPalette[index % accentPalette.length];
          const Icon = icons[index % icons.length];
          return (
            <article
              key={metric.id}
              className="relative min-w-0 overflow-hidden rounded-xl border border-border-subtle/70 bg-background/70 p-4 shadow-[0_14px_30px_rgba(5,5,16,0.45)]"
              >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-simple/60 to-transparent" />
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 break-words text-[11px] font-semibold uppercase leading-snug tracking-[0.2em] text-text-muted">
                  {metric.label}
                </p>
                <span className={`rounded-md border ${accent.border} bg-background/60 p-2`}>
                  <Icon size={14} className={accent.text} aria-hidden />
                </span>
              </div>
              <div className="overflow-x-auto">
                <p className="whitespace-nowrap text-2xl font-semibold text-text-primary">{metric.value}</p>
              </div>
              {metric.helper ? <p className="text-xs text-text-muted">{metric.helper}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
