"use client";

import type { MouseEvent } from "react";
import { useI18n } from "@/lib/i18n/context";

export function FloatingControls() {
  const { dictionary, locale, setLocale } = useI18n();

  const nextLocale = locale === "en" ? "es" : "en";
  const languageLabel =
    locale === "en" ? dictionary.actions.switchToSpanish : dictionary.actions.switchToEnglish;
  const startLabel = locale === "es" ? "Iniciar" : "Start";

  return (
    <>
      <div className="fixed left-3 top-1 z-50 flex max-w-[calc(100vw-1.5rem)] flex-col items-start gap-2 sm:flex-row sm:items-center md:left-4 md:top-1">
        <ToggleButton
          label={languageLabel}
          ariaLabel={dictionary.header.languageToggleAria}
          onClick={() => setLocale(nextLocale)}
        />
      </div>

      <div className="pointer-events-none fixed right-3 top-1 z-50 flex w-auto max-w-[calc(100vw-1.5rem)] translate-x-0 justify-end px-0 sm:left-1/2 sm:right-auto sm:w-full sm:-translate-x-1/2 sm:justify-center sm:px-3 md:px-0">
        <StartButton label={startLabel} ariaLabel={dictionary.hero.cta} />
      </div>
    </>
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
      className="inline-flex max-w-[70vw] flex-wrap items-center justify-center gap-2 rounded-full border border-accent-simple/40 bg-background/80 px-2 py-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-text-primary shadow-[0_0_18px_rgba(59,130,246,0.35)] backdrop-blur transition hover:border-accent-compound hover:text-accent-compound focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-highlight/60 sm:px-3"
    >
      <span className="h-2 w-2 rounded-full bg-accent-compound shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
      {label}
    </button>
  );
}

function StartButton({ label, ariaLabel }: { label: string; ariaLabel: string }) {
  const scrollToSimulation = (event: MouseEvent<HTMLButtonElement>) => {
    const target = document.getElementById("simulation");
    const triggerHeight = event.currentTarget.getBoundingClientRect().height;
    const offset = triggerHeight + 8; // leave room for the floating controls
    if (target) {
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const top = Math.max(targetTop - offset, 0);
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
    window.location.hash = "#simulation";
  };

  return (
    <button
      type="button"
      onClick={scrollToSimulation}
      aria-label={ariaLabel}
      className="pointer-events-auto inline-flex max-w-[80vw] flex-wrap items-center justify-center gap-2 rounded-full border border-accent-compound/60 bg-gradient-to-r from-background/80 via-background-muted/80 to-background-raised/80 px-3 py-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-text-primary shadow-[0_0_18px_rgba(239,68,68,0.35)] backdrop-blur transition hover:border-accent-simple hover:text-accent-simple"
    >
      <span className="h-2 w-2 rounded-full bg-accent-simple shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
      {label}
      <span className="h-2 w-2 rounded-full bg-accent-compound shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
    </button>
  );
}
