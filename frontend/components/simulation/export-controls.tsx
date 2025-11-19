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
    <section className="rounded-2xl border border-border-subtle bg-background-raised/70 p-6 shadow-panel-soft backdrop-blur">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{labels.title}</h3>
      </header>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onExportCsv()}
          className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-5 py-2 text-sm font-medium text-text-primary transition hover:border-accent-highlight hover:text-accent-highlight"
        >
          {labels.csv}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 text-xs text-text-muted">
        {liveMessage || " "}
      </p>
    </section>
  );
}
