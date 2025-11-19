export type CurrencyCode = "USD" | "CRC";

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  locale: string,
  minimumFractionDigits = 2,
): string {
  const formatter = new Intl.NumberFormat(resolveCurrencyLocale(locale, currency), {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  });
  return formatter.format(value);
}

export function formatNumber(
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions = {},
): string {
  const formatter = new Intl.NumberFormat(locale, options);
  return formatter.format(value);
}

export function formatPercent(value: number, locale: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

export function clampToZeroDisplay(value: number): number {
  return value < 0 ? 0 : value;
}

function resolveCurrencyLocale(locale: string, currency: CurrencyCode): string {
  if (locale.startsWith("es")) {
    return currency === "CRC" ? "es-CR" : "es-MX";
  }
  return "en-US";
}
