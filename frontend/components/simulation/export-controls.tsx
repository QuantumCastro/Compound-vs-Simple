"use client";

type ExportControlsProps = {
  onExportCsv: () => Promise<void> | void;
  labels: {
    title: string;
    csv: string;
    successCsv: string;
    error: string;
  };
  lastSuccess: "csv" | null;
  errorMessage: string | null;
};

export function ExportControls({ onExportCsv, labels, lastSuccess, errorMessage }: ExportControlsProps) {
  const liveMessage = errorMessage ?? (lastSuccess === "csv" ? labels.successCsv : "");

  return (
    <section className="glass-panel relative overflow-hidden rounded-2xl p-6">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-compound via-accent-highlight to-accent-simple" />
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{labels.title}</h3>
      </header>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onExportCsv()}
          className="inline-flex items-center gap-2 rounded-full border border-accent-simple/50 bg-background/80 px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-text-primary shadow-[0_0_14px_rgba(59,130,246,0.25)] transition hover:border-accent-compound hover:text-accent-compound"
        >
          {labels.csv}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 text-xs text-text-muted">
        {liveMessage || " "}
      </p>
    </section>
  );
}
