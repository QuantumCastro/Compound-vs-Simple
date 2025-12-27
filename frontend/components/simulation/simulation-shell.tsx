"use client";

import { useMemo, useState } from "react";
import {
  INPUT_LIMITS,
  type NormalizedSimulationInput,
  type SimulationInput,
  type SimulationSummary,
  simulateInterest,
} from "@/lib/interest-calculator";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationDictionary } from "@/lib/i18n/dictionaries";
import {
  clampToZeroDisplay,
  formatCurrency,
  formatNumber,
  formatPercent,
  type CurrencyCode,
} from "@/lib/formatters";
import { generateSeriesCsv, downloadTextFile } from "@/lib/exporters";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { SimulationForm } from "./simulation-form";
import { SummaryCards } from "./summary-cards";
import { GrowthCharts } from "./growth-charts";
import { ResultsTable } from "./results-table";
import { ExportControls } from "./export-controls";
import type { MetricCard, SimulationErrors, SimulationFieldName, SimulationFormValues } from "./types";
import { RefreshCw } from "lucide-react";

const DEFAULT_FORM_VALUES: SimulationFormValues = {
  principal: "1000",
  ratePercent: "1",
  periods: "120",
  compoundFrequency: "4",
  contributionsEnabled: false,
  contribution: "100",
  currency: "USD",
};

export function SimulationShell() {
  const { dictionary, locale } = useI18n();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [values, setValues] = useState<SimulationFormValues>(DEFAULT_FORM_VALUES);
  const [touched, setTouched] = useState<Partial<Record<SimulationFieldName, boolean>>>({});
  const [lastExportSuccess, setLastExportSuccess] = useState<"csv" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const simulationInput = useMemo<SimulationInput>(() => toSimulationInput(values), [values]);
  const result = useMemo(() => simulateInterest(simulationInput), [simulationInput]);

  const validationErrors = useMemo(
    () => validateForm(values, dictionary.validations, locale),
    [values, dictionary.validations, locale],
  );

  const displayErrors = useMemo<SimulationErrors>(() => {
    const showErrors: SimulationErrors = {};
    (Object.keys(validationErrors) as SimulationFieldName[]).forEach((field) => {
      if (field === "contribution" && !values.contributionsEnabled) {
        return;
      }
      if (validationErrors[field] && (touched[field] || values[field] === "")) {
        showErrors[field] = validationErrors[field];
      }
    });
    return showErrors;
  }, [touched, validationErrors, values]);

  const hasBlockingErrors = (Object.entries(validationErrors) as Array<[SimulationFieldName, string | undefined]>).some(
    ([field, message]) => {
      if (!message) {
        return false;
      }
      if (field === "contribution" && !values.contributionsEnabled) {
        return false;
      }
      return true;
    },
  );

  const metrics = useMemo(
    () => buildMetrics(result.summary, result.input, dictionary, values.currency, locale),
    [result.summary, result.input, dictionary, values.currency, locale],
  );

  const comparisonData = useMemo(
    () =>
      result.series.map((snapshot) => ({
        period: snapshot.periodIndex,
        simple: snapshot.simple.total,
        compound: snapshot.compound.total,
      })),
    [result.series],
  );

  const gapData = useMemo(
    () =>
      result.series.map((snapshot) => ({
        period: snapshot.periodIndex,
        value: snapshot.compound.total - snapshot.simple.total,
      })),
    [result.series],
  );

  const handleFieldChange = (field: SimulationFieldName, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleBlur = (field: SimulationFieldName) => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };

  const handleToggleContributions = (enabled: boolean) => {
    setValues((current) => ({
      ...current,
      contributionsEnabled: enabled,
    }));
  };

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setValues((current) => ({
      ...current,
      currency,
    }));
  };

  const handleReset = () => {
    setValues(DEFAULT_FORM_VALUES);
    setTouched({});
  };

  const handleExportCsv = async () => {
    try {
      const csv = generateSeriesCsv(result.series, {
        locale,
        currency: values.currency,
        headers: {
          period: dictionary.results.table.columnPeriod,
          simpleTotal: dictionary.results.table.columnSimpleTotal,
          simpleInterest: dictionary.results.table.columnSimpleInterest,
          compoundTotal: dictionary.results.table.columnCompoundTotal,
          compoundInterest: dictionary.results.table.columnCompoundInterest,
          contribution: dictionary.results.table.columnContribution,
          gap: dictionary.results.table.columnGap,
        },
      });
      downloadTextFile(`interest-growth-${locale}.csv`, csv, "text/csv");
      setLastExportSuccess("csv");
      setExportError(null);
    } catch (error) {
      console.error(error);
      setExportError(dictionary.results.export.error);
    }
  };

  const resultStateMessage =
    hasBlockingErrors && Object.values(displayErrors).some(Boolean)
      ? dictionary.results.states.invalidInput
      : result.input.periods === 0
        ? dictionary.results.states.zeroPeriods
        : null;

  const projectedTotal = formatCurrency(result.summary.finalCompound, values.currency, locale);
  const projectedGap = formatCurrency(result.summary.difference, values.currency, locale);
  const projectedContributions = formatCurrency(result.summary.totalContributions, values.currency, locale);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-4">
          <SimulationForm
            values={values}
            errors={displayErrors}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            onToggleContributions={handleToggleContributions}
            onChangeCurrency={handleCurrencyChange}
            onReset={handleReset}
          />

          <div className="glass-panel relative overflow-hidden rounded-2xl p-4">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-compound via-accent-highlight to-accent-simple" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {dictionary.results.summary.finalCompound}
                </p>
                <div className="overflow-x-auto">
                  <p className="whitespace-nowrap text-2xl font-semibold text-text-primary">{projectedTotal}</p>
                </div>
                <p className="text-xs text-text-muted">{dictionary.hero.subtitle}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-simple/40 bg-background shadow-[0_0_14px_rgba(59,130,246,0.25)]">
                <RefreshCw size={18} className="text-accent-simple animate-spin-slow" aria-hidden />
              </div>
            </div>
            <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
              <div className="min-w-0 rounded-xl border border-accent-simple/20 bg-background/60 p-3">
                <p className="text-text-muted">{dictionary.results.summary.difference}</p>
                <div className="overflow-x-auto">
                  <p className="whitespace-nowrap text-sm font-semibold text-accent-highlight">{projectedGap}</p>
                </div>
              </div>
              <div className="min-w-0 rounded-xl border border-accent-compound/20 bg-background/60 p-3">
                <p className="text-text-muted">{dictionary.results.summary.contributions}</p>
                <div className="overflow-x-auto">
                  <p className="whitespace-nowrap text-sm font-semibold text-text-primary">
                    {projectedContributions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6 xl:col-span-8">
          {resultStateMessage ? (
            <div className="glass-panel flex items-center gap-3 rounded-2xl border-accent-danger/50 bg-accent-danger/10 px-4 py-3 text-sm text-text-primary">
              <span className="h-2 w-2 rounded-full bg-accent-danger shadow-[0_0_10px_rgba(248,113,113,0.7)]" />
              <span>{resultStateMessage}</span>
            </div>
          ) : null}

          <SummaryCards
            metrics={metrics}
            title={dictionary.results.title}
            subtitle={dictionary.results.subtitle}
          />

          <GrowthCharts
            comparisonData={comparisonData}
            gapData={gapData}
            currency={values.currency}
            locale={locale}
            labels={{
              comparisonTitle: dictionary.results.charts.comparison.title,
              comparisonDescription: dictionary.results.charts.comparison.description,
              legendSimple: dictionary.results.charts.comparison.legendSimple,
              legendCompound: dictionary.results.charts.comparison.legendCompound,
              gapTitle: dictionary.results.charts.gap.title,
              gapDescription: dictionary.results.charts.gap.description,
              gapLegend: dictionary.results.charts.gap.legendGap,
            }}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      </div>

      <ResultsTable
        rows={result.series}
        currency={values.currency}
        locale={locale}
        labels={{
          title: dictionary.results.table.title,
          description: dictionary.results.table.description,
          columnPeriod: dictionary.results.table.columnPeriod,
          columnSimpleTotal: dictionary.results.table.columnSimpleTotal,
          columnSimpleInterest: dictionary.results.table.columnSimpleInterest,
          columnCompoundTotal: dictionary.results.table.columnCompoundTotal,
          columnCompoundInterest: dictionary.results.table.columnCompoundInterest,
          columnContribution: dictionary.results.table.columnContribution,
          columnGap: dictionary.results.table.columnGap,
          showMore: dictionary.results.table.showMore,
          showLess: dictionary.results.table.showLess,
          ariaLabel: dictionary.results.table.ariaLabel,
        }}
      />

      <ExportControls
        onExportCsv={handleExportCsv}
        labels={{
          title: dictionary.results.export.title,
          csv: dictionary.results.export.csv,
          successCsv: dictionary.results.export.csvSuccess,
          error: dictionary.results.export.error,
        }}
        lastSuccess={lastExportSuccess}
        errorMessage={exportError}
      />
    </div>
  );
}

function toSimulationInput(values: SimulationFormValues): SimulationInput {
  return {
    principal: parseNumber(values.principal),
    ratePercent: parseNumber(values.ratePercent),
    periods: parseNumber(values.periods),
    compoundFrequency: parseNumber(values.compoundFrequency),
    contribution: values.contributionsEnabled ? parseNumber(values.contribution) : 0,
    contributionsEnabled: values.contributionsEnabled,
  };
}

function parseNumber(raw: string): number {
  const normalized = raw.replace(/\s+/g, "").replace(/,/g, ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

function validateForm(
  values: SimulationFormValues,
  validationTexts: TranslationDictionary["validations"],
  locale: string,
): SimulationErrors {
  const errors: SimulationErrors = {};
  const numericChecks: Record<SimulationFieldName, { min: number; max: number; integer: boolean }> = {
    principal: { min: INPUT_LIMITS.principal.min, max: INPUT_LIMITS.principal.max, integer: false },
    ratePercent: { min: INPUT_LIMITS.ratePercent.min, max: INPUT_LIMITS.ratePercent.max, integer: false },
    periods: { min: INPUT_LIMITS.periods.min, max: INPUT_LIMITS.periods.max, integer: true },
    compoundFrequency: {
      min: INPUT_LIMITS.compoundFrequency.min,
      max: INPUT_LIMITS.compoundFrequency.max,
      integer: true,
    },
    contribution: { min: INPUT_LIMITS.contribution.min, max: INPUT_LIMITS.contribution.max, integer: false },
  };

  (Object.entries(numericChecks) as Array<[SimulationFieldName, typeof numericChecks[SimulationFieldName]]>).forEach(
    ([field, config]) => {
      if (field === "contribution" && !values.contributionsEnabled) {
        return;
      }

      const raw = values[field].trim();
      if (raw === "") {
        errors[field] = validationTexts.required;
        return;
      }

      const normalized = raw.replace(/\s+/g, "").replace(/,/g, ".");
      const parsedValue = Number(normalized);
      if (!Number.isFinite(parsedValue)) {
        errors[field] = validationTexts.required;
        return;
      }

      if (parsedValue < config.min) {
        errors[field] = validationTexts.minInclusive.replace("{{min}}", formatNumber(config.min, locale));
        return;
      }

      if (Number.isFinite(config.max) && parsedValue > config.max) {
        errors[field] = validationTexts.maxInclusive.replace("{{max}}", formatNumber(config.max, locale));
        return;
      }

      if (config.integer && !Number.isInteger(parsedValue)) {
        errors[field] = validationTexts.integer;
      }
    },
  );

  return errors;
}

function buildMetrics(
  summary: SimulationSummary,
  normalizedInput: NormalizedSimulationInput,
  dictionary: TranslationDictionary,
  currency: CurrencyCode,
  locale: string,
): MetricCard[] {
  const safeFinalSimple = clampToZeroDisplay(summary.finalSimple);
  const safeFinalCompound = clampToZeroDisplay(summary.finalCompound);

  const breakEvenHelper = summary.breakEvenPeriod
    ? dictionary.results.summary.breakEven.replace(
        "{{period}}",
        formatNumber(summary.breakEvenPeriod, locale),
      )
    : dictionary.results.summary.breakEvenNever;

  return [
    {
      id: "finalCompound",
      label: dictionary.results.summary.finalCompound,
      value: formatCurrency(safeFinalCompound, currency, locale),
      helper: `${dictionary.results.summary.interestCompound}: ${formatCurrency(summary.interestCompound, currency, locale)}`,
    },
    {
      id: "finalSimple",
      label: dictionary.results.summary.finalSimple,
      value: formatCurrency(safeFinalSimple, currency, locale),
      helper: `${dictionary.results.summary.interestSimple}: ${formatCurrency(summary.interestSimple, currency, locale)}`,
    },
    {
      id: "difference",
      label: dictionary.results.summary.difference,
      value: formatCurrency(summary.difference, currency, locale),
      helper: breakEvenHelper,
    },
    {
      id: "contributions",
      label: dictionary.results.summary.contributions,
      value: formatCurrency(summary.totalContributions, currency, locale),
      helper: dictionary.form.fields.contributionsEnabled.helper,
    },
    {
      id: "effectiveCompound",
      label: dictionary.results.summary.effectiveCompound,
      value: formatPercent(summary.effectiveAnnualRateCompound, locale),
      helper: `${dictionary.results.summary.effectiveSimple}: ${formatPercent(summary.effectiveAnnualRateSimple, locale)}`,
    },
    {
      id: "ratePerPeriod",
      label: dictionary.form.fields.ratePercent.label,
      value: `${formatNumber(normalizedInput.ratePercentPerPeriod, locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} %`,
      helper: dictionary.form.fields.ratePercent.helper,
    },
  ];
}
