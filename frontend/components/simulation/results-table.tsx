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
    <section className="rounded-2xl border border-border-subtle bg-background-raised/60 p-6 shadow-panel-soft backdrop-blur">
      <header className="mb-4 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">{labels.title}</h3>
        <p className="text-sm text-text-muted">{labels.description}</p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-subtle/60 text-left text-sm" aria-label={labels.ariaLabel}>
          <thead className="text-xs uppercase tracking-wide text-text-muted">
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
                <tr key={row.periodIndex}>
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
                  <td className="px-3 py-2">{formatCurrency(gap, currency, locale)}</td>
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
            className="rounded-full border border-border-subtle px-4 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-highlight hover:text-text-primary"
          >
            {labels.showMore.replace("{{count}}", remaining.toString())}
          </button>
        ) : null}
        {canShowLess ? (
          <button
            type="button"
            onClick={() => setVisibleCount(PAGE_SIZE)}
            className="rounded-full border border-border-subtle px-4 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-highlight hover:text-text-primary"
          >
            {labels.showLess}
          </button>
        ) : null}
      </div>
    </section>
  );
}
