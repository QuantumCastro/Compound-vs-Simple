"use client";

import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";

export function FloatingControls() {
  const { dictionary, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const nextLocale = locale === "en" ? "es" : "en";
  const languageLabel =
    locale === "en" ? dictionary.actions.switchToSpanish : dictionary.actions.switchToEnglish;
  const themeLabel =
    theme === "dark" ? dictionary.actions.switchToLightTheme : dictionary.actions.switchToDarkTheme;

  return (
    <div className="fixed left-3 top-0 z-50 flex items-center gap-1 md:left-2 md:top-1">
      <ToggleButton
        label={languageLabel}
        ariaLabel={dictionary.header.languageToggleAria}
        onClick={() => setLocale(nextLocale)}
      />
      <ToggleButton
        label={themeLabel}
        ariaLabel={dictionary.header.themeToggleAria}
        ariaPressed={theme === "light"}
        onClick={toggleTheme}
      />
    </div>
  );
}

type ToggleButtonProps = {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  ariaPressed?: boolean;
};

function ToggleButton({ label, ariaLabel, onClick, ariaPressed }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle bg-background-raised/90 px-4 py-2 text-xs font-medium text-text-primary shadow-panel-soft transition hover:border-accent-highlight hover:text-accent-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-highlight/60"
    >
      {label}
    </button>
  );
}

