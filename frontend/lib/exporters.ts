import type { PeriodSnapshot } from "./interest-calculator";
import type { CurrencyCode } from "./formatters";
import { formatCurrency, formatNumber } from "./formatters";

type CsvOptions = {
  locale: string;
  currency: CurrencyCode;
  headers: {
    period: string;
    simpleTotal: string;
    simpleInterest: string;
    compoundTotal: string;
    compoundInterest: string;
    contribution: string;
    gap: string;
  };
};

export function generateSeriesCsv(series: PeriodSnapshot[], options: CsvOptions): string {
  const { locale, currency, headers } = options;
  const rows: string[] = [
    [
      headers.period,
      headers.simpleTotal,
      headers.simpleInterest,
      headers.compoundTotal,
      headers.compoundInterest,
      headers.contribution,
      headers.gap,
    ].join(","),
  ];

  for (const snapshot of series) {
    const { periodIndex, simple, compound, contributionApplied } = snapshot;
    const gap = compound.total - simple.total;

    rows.push(
      [
        formatNumber(periodIndex, locale),
        formatCurrency(simple.total, currency, locale),
        formatCurrency(simple.interestAccrued, currency, locale),
        formatCurrency(compound.total, currency, locale),
        formatCurrency(compound.interestAccrued, currency, locale),
        formatCurrency(contributionApplied, currency, locale),
        formatCurrency(gap, currency, locale),
      ].join(","),
    );
  }

  return rows.join("\n");
}

export function downloadTextFile(fileName: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

