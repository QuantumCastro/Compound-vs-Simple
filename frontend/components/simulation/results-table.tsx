"use client";

import { useMemo, useState } from "react";
import type { CurrencyCode } from "@/lib/formatters";
import { clampToZeroDisplay, formatCurrency, formatNumber } from "@/lib/formatters";
import type { PeriodSnapshot } from "@/lib/interest-calculator";

type ResultsTableProps = {
  rows: PeriodSnapshot[];
  currency: CurrencyCode;
  locale: string;
  labels: {
    title: string;
    description: string;
    columnPeriod: string;
    columnSimpleTotal: string;
    columnSimpleInterest: string;
    columnCompoundTotal: string;
    columnCompoundInterest: string;
    columnContribution: string;
    columnGap: string;
    showMore: string;
    showLess: string;
    ariaLabel: string;
  };
};

const PAGE_SIZE = 12;

export function ResultsTable({ rows, currency, locale, labels }: ResultsTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleRows = useMemo(() => rows.slice(0, visibleCount), [rows, visibleCount]);

  const canShowMore = visibleCount < rows.length;
  const canShowLess = visibleCount > PAGE_SIZE;
  const remaining = Math.min(PAGE_SIZE, rows.length - visibleCount);

  return (
    <section className="glass-panel relative overflow-hidden rounded-2xl p-6">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-compound via-accent-highlight to-accent-simple" />
      <header className="mb-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">{labels.title}</h3>
        <p className="text-sm text-text-muted">{labels.description}</p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-subtle/60 text-left text-sm" aria-label={labels.ariaLabel}>
          <thead className="bg-background/60 text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-3 py-2">{labels.columnPeriod}</th>
              <th className="px-3 py-2">{labels.columnSimpleTotal}</th>
              <th className="px-3 py-2">{labels.columnSimpleInterest}</th>
              <th className="px-3 py-2">{labels.columnCompoundTotal}</th>
              <th className="px-3 py-2">{labels.columnCompoundInterest}</th>
              <th className="px-3 py-2">{labels.columnContribution}</th>
              <th className="px-3 py-2">{labels.columnGap}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40 text-xs text-text-secondary">
            {visibleRows.map((row) => {
              const gap = clampToZeroDisplay(row.compound.total - row.simple.total);
              return (
                <tr key={row.periodIndex} className="transition hover:bg-accent-compound/5">
                  <td className="px-3 py-2 font-medium text-text-primary">
                    {formatNumber(row.periodIndex, locale)}
                  </td>
                  <td className="px-3 py-2">{formatCurrency(row.simple.total, currency, locale)}</td>
                  <td className="px-3 py-2">{formatCurrency(row.simple.interestAccrued, currency, locale)}</td>
                  <td className="px-3 py-2">{formatCurrency(row.compound.total, currency, locale)}</td>
                  <td className="px-3 py-2">
                    {formatCurrency(row.compound.interestAccrued, currency, locale)}
                  </td>
                  <td className="px-3 py-2">
                    {formatCurrency(row.contributionApplied, currency, locale)}
                  </td>
                  <td className="px-3 py-2 text-accent-highlight">{formatCurrency(gap, currency, locale)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {canShowMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-full border border-accent-simple/40 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-text-primary shadow-[0_0_12px_rgba(59,130,246,0.25)] transition hover:border-accent-compound hover:text-accent-compound"
          >
            {labels.showMore.replace("{{count}}", remaining.toString())}
          </button>
        ) : null}
        {canShowLess ? (
          <button
            type="button"
            onClick={() => setVisibleCount(PAGE_SIZE)}
            className="rounded-full border border-accent-simple/40 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-text-primary shadow-[0_0_12px_rgba(59,130,246,0.25)] transition hover:border-accent-compound hover:text-accent-compound"
          >
            {labels.showLess}
          </button>
        ) : null}
      </div>
    </section>
  );
}
