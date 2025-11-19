"use client";

import { MetricCard } from "./types";

type SummaryCardsProps = {
  metrics: MetricCard[];
  title: string;
  subtitle: string;
};

export function SummaryCards({ metrics, title, subtitle }: SummaryCardsProps) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-background-raised/70 p-6 shadow-panel-soft backdrop-blur">
      <header className="mb-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted">{subtitle}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-background-muted/50 p-4"
          >
            <p className="text-xs uppercase tracking-wider text-text-muted">{metric.label}</p>
            <div className="overflow-x-auto">
              <p className="whitespace-nowrap text-2xl font-semibold text-text-primary">{metric.value}</p>
            </div>
            {metric.helper ? <p className="text-xs text-text-muted">{metric.helper}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
