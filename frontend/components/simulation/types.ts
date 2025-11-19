import type { CurrencyCode } from "@/lib/formatters";

export type SimulationFormValues = {
  principal: string;
  ratePercent: string;
  periods: string;
  compoundFrequency: string;
  contributionsEnabled: boolean;
  contribution: string;
  currency: CurrencyCode;
};

export type SimulationFieldName =
  | "principal"
  | "ratePercent"
  | "periods"
  | "compoundFrequency"
  | "contribution";

export type SimulationErrors = Partial<Record<SimulationFieldName, string | undefined>>;

export type ComparisonPoint = {
  period: number;
  simple: number;
  compound: number;
};

export type GapPoint = {
  period: number;
  value: number;
};

export type MetricCard = {
  id: string;
  label: string;
  value: string;
  helper?: string;
  trend?: "up" | "down" | "neutral";
};
