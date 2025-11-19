"use client";

import { INPUT_LIMITS } from "@/lib/interest-calculator";
import { useI18n } from "@/lib/i18n/context";
import type { CurrencyCode } from "@/lib/formatters";
import { SimulationErrors, SimulationFieldName, SimulationFormValues } from "./types";

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
      className="rounded-2xl border border-border-subtle bg-background-raised/80 p-6 shadow-panel-soft backdrop-blur"
      aria-labelledby="simulation-form-title"
    >
      <div className="flex flex-col gap-2 pb-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="simulation-form-title" className="text-xl font-semibold text-text-primary">
              {formTexts.title}
            </h2>
            <p className="text-sm text-text-muted">{formTexts.description}</p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="self-start rounded-full border border-border-subtle px-4 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-highlight hover:text-text-primary"
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
            <div key={fieldName} className="flex flex-col gap-2">
              <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
                {fieldLabels[fieldName]}
              </label>
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
                className="w-full rounded-xl border border-border-subtle bg-background px-2 text-base text-text-primary shadow-inner focus:border-accent-highlight focus:outline-none focus:ring-0"
                placeholder={placeholder}
              />
              <p id={helperId} className="text-xs text-text-muted">
                {fieldHelpers[fieldName]}
              </p>
              {errorMessage ? (
                <p id={errorId} className="text-xs text-accent-danger">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-background-muted/40 p-4 md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
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
                className="flex h-6 w-11 items-center rounded-full bg-border-subtle transition peer-checked:bg-accent-compound"
                role="switch"
                aria-checked={values.contributionsEnabled}
              >
                <span className="ml-1 h-5 w-5 rounded-full bg-background shadow transition peer-checked:translate-x-5 peer-checked:bg-background peer-checked:shadow-lg" />
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="currency-selector" className="text-sm font-medium text-text-secondary">
            {formTexts.fields.currency.label}
          </label>
          <select
            id="currency-selector"
            value={values.currency}
            onChange={(event) => onChangeCurrency(event.target.value as CurrencyCode)}
            className="w-full rounded-xl border border-border-subtle bg-background text-sm text-text-primary focus:border-accent-highlight focus:outline-none focus:ring-0"
          >
            <option value="USD">{dictionary.header.currencyOptions.USD}</option>
            <option value="CRC">{dictionary.header.currencyOptions.CRC}</option>
          </select>
        </div>
      </div>
    </section>
  );
}
