"use client";

import { INPUT_LIMITS } from "@/lib/interest-calculator";
import { useI18n } from "@/lib/i18n/context";
import type { CurrencyCode } from "@/lib/formatters";
import { SimulationErrors, SimulationFieldName, SimulationFormValues } from "./types";
import { Calculator, Zap } from "lucide-react";

type SimulationFormProps = {
  values: SimulationFormValues;
  errors: SimulationErrors;
  onChange: (name: SimulationFieldName, value: string) => void;
  onBlur: (name: SimulationFieldName) => void;
  onToggleContributions: (enabled: boolean) => void;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onReset: () => void;
};

const FIELD_ORDER: SimulationFieldName[] = [
  "principal",
  "ratePercent",
  "periods",
  "compoundFrequency",
  "contribution",
];

export function SimulationForm({
  values,
  errors,
  onChange,
  onBlur,
  onToggleContributions,
  onChangeCurrency,
  onReset,
}: SimulationFormProps) {
  const { dictionary } = useI18n();
  const formTexts = dictionary.form;

  const fieldConfigs: Record<SimulationFieldName, { type: "number"; min?: number; max?: number; step?: string }> = {
    principal: { type: "number", min: INPUT_LIMITS.principal.min, step: "1" },
    ratePercent: { type: "number", min: INPUT_LIMITS.ratePercent.min, max: INPUT_LIMITS.ratePercent.max, step: "0.1" },
    periods: { type: "number", min: INPUT_LIMITS.periods.min, max: INPUT_LIMITS.periods.max, step: "1" },
    compoundFrequency: {
      type: "number",
      min: INPUT_LIMITS.compoundFrequency.min,
      max: INPUT_LIMITS.compoundFrequency.max,
      step: "1",
    },
    contribution: { type: "number", min: INPUT_LIMITS.contribution.min, max: INPUT_LIMITS.contribution.max, step: "1" },
  };

  const fieldLabels: Record<SimulationFieldName, string> = {
    principal: formTexts.fields.principal.label,
    ratePercent: formTexts.fields.ratePercent.label,
    periods: formTexts.fields.periods.label,
    compoundFrequency: formTexts.fields.compoundFrequency.label,
    contribution: formTexts.fields.contribution.label,
  };

  const fieldHelpers: Record<SimulationFieldName, string> = {
    principal: formTexts.fields.principal.helper,
    ratePercent: formTexts.fields.ratePercent.helper,
    periods: formTexts.fields.periods.helper,
    compoundFrequency: formTexts.fields.compoundFrequency.helper,
    contribution: formTexts.fields.contribution.helper,
  };

  const fieldPlaceholders: Partial<Record<SimulationFieldName, string>> = {
    principal: formTexts.fields.principal.placeholder,
    contribution: formTexts.fields.contribution.placeholder,
  };

  return (
    <section
      className="glass-panel relative overflow-hidden rounded-2xl p-6"
      aria-labelledby="simulation-form-title"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-compound via-accent-highlight to-accent-simple" />
      <div className="flex flex-col gap-2 pb-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-simple/40 bg-background shadow-[0_0_16px_rgba(59,130,246,0.25)]">
              <Calculator size={18} className="text-accent-simple" aria-hidden />
            </div>
            <div>
              <h2 id="simulation-form-title" className="text-xl font-semibold text-text-primary">
                {formTexts.title}
              </h2>
              <p className="text-sm text-text-muted">{formTexts.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="self-start rounded-full border border-accent-simple/50 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-text-primary shadow-[0_0_14px_rgba(59,130,246,0.35)] transition hover:border-accent-compound hover:text-accent-compound"
          >
            {formTexts.reset}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FIELD_ORDER.map((fieldName) => {
          if (fieldName === "contribution" && !values.contributionsEnabled) {
            return null;
          }

          const fieldConfig = fieldConfigs[fieldName];
          const inputId = `field-${fieldName}`;
          const helperId = `${inputId}-helper`;
          const errorId = `${inputId}-error`;
          const errorMessage = errors[fieldName];
          const placeholder = fieldPlaceholders[fieldName];

          return (
            <div
              key={fieldName}
              className="group relative overflow-hidden rounded-xl border border-border-subtle/60 bg-background/70 p-4 shadow-[0_10px_30px_rgba(5,5,16,0.45)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-simple/60 to-transparent opacity-70" />
              <label
                htmlFor={inputId}
                className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted"
              >
                <Zap size={12} className="text-accent-compound" aria-hidden />
                {fieldLabels[fieldName]}
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id={inputId}
                  type={fieldConfig.type}
                  inputMode="decimal"
                  min={fieldConfig.min !== undefined ? fieldConfig.min : undefined}
                  max={fieldConfig.max !== undefined && Number.isFinite(fieldConfig.max) ? fieldConfig.max : undefined}
                  step={fieldConfig.step}
                  value={values[fieldName]}
                  onChange={(event) => onChange(fieldName, event.target.value)}
                  onBlur={() => onBlur(fieldName)}
                  aria-describedby={`${helperId}${errorMessage ? ` ${errorId}` : ""}`}
                  aria-invalid={Boolean(errorMessage) || undefined}
                  className="w-full rounded-lg border border-border-subtle/80 bg-background-raised/70 px-3 py-3 text-base font-mono text-text-primary shadow-inner transition focus:border-accent-compound focus:outline-none focus:ring-1 focus:ring-accent-compound group-hover:border-accent-simple/60"
                  placeholder={placeholder}
                />
              </div>
              <p id={helperId} className="mt-2 text-xs text-text-muted">
                {fieldHelpers[fieldName]}
              </p>
              {errorMessage ? (
                <p id={errorId} className="mt-1 text-xs text-accent-danger">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="glass-panel md:col-span-2 rounded-xl p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-secondary">
                {formTexts.fields.contributionsEnabled.label}
              </p>
              <p className="text-xs text-text-muted">{formTexts.fields.contributionsEnabled.helper}</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={values.contributionsEnabled}
                onChange={(event) => onToggleContributions(event.target.checked)}
              />
              <span
                className="flex h-6 w-12 items-center rounded-full border border-accent-simple/40 bg-background transition peer-checked:border-accent-compound peer-checked:bg-accent-compound/30"
                role="switch"
                aria-checked={values.contributionsEnabled}
              >
                <span className="ml-1 h-5 w-5 rounded-full bg-background shadow transition peer-checked:translate-x-5 peer-checked:bg-background peer-checked:shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="currency-selector"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted"
          >
            {formTexts.fields.currency.label}
          </label>
          <select
            id="currency-selector"
            value={values.currency}
            onChange={(event) => onChangeCurrency(event.target.value as CurrencyCode)}
            className="w-full rounded-xl border border-accent-simple/40 bg-background-raised/80 px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-text-primary shadow-[0_0_14px_rgba(59,130,246,0.22)] focus:border-accent-compound focus:outline-none focus:ring-1 focus:ring-accent-compound"
          >
            <option value="USD">{dictionary.header.currencyOptions.USD}</option>
            <option value="CRC">{dictionary.header.currencyOptions.CRC}</option>
          </select>
        </div>
      </div>
    </section>
  );
}
