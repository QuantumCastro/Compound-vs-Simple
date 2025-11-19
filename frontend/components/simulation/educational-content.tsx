"use client";

import { useI18n } from "@/lib/i18n/context";

type EducationSectionContent = {
  id: string;
  title: string;
  summary: string;
  points?: string[];
  items?: { title: string; description: string }[];
  qa?: { question: string; answer: string }[];
  terms?: { term: string; definition: string }[];
  myths?: { myth: string; reality: string }[];
  references?: { label: string; url: string }[];
};

export function EducationalContent() {
  const { dictionary } = useI18n();
  const sections = dictionary.education.sections as EducationSectionContent[];

  if (sections.length === 0) {
    return null;
  }

  return (
    <section
      id="learning"
      className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-background-raised/60 p-6 shadow-panel-soft backdrop-blur"
    >
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-text-primary">{dictionary.education.header.title}</h2>
        <p className="text-sm text-text-muted">{dictionary.education.header.subtitle}</p>
      </header>

      <div className="flex max-h-[420px] flex-col gap-6 overflow-y-auto pr-1">
        {sections.map((section) => (
          <EducationSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}
function EducationSection({ section }: { section: EducationSectionContent }) {
  return (
    <article className="rounded-xl border border-border-subtle bg-background-muted/40 p-5">
      <header className="mb-3 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">{section.title}</h3>
        <p className="text-sm text-text-muted">{section.summary}</p>
      </header>

      <div className="flex flex-col gap-3 text-sm text-text-secondary">
        {section.points ? (
          <ul className="list-disc space-y-2 pl-5">
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}

        {section.items ? (
          <ul className="space-y-3">
            {section.items.map((item) => (
              <li key={item.title} className="rounded-lg border border-border-subtle/60 bg-background/40 p-3">
                <h4 className="font-medium text-text-primary">{item.title}</h4>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {section.qa ? (
          <dl className="space-y-3">
            {section.qa.map((entry) => (
              <div key={entry.question} className="rounded-lg border border-border-subtle/60 bg-background/40 p-3">
                <dt className="font-medium text-text-primary">{entry.question}</dt>
                <dd className="mt-1 text-sm text-text-secondary">{entry.answer}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {section.terms ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            {section.terms.map((term) => (
              <div key={term.term} className="rounded-lg border border-border-subtle/60 bg-background/40 p-3">
                <dt className="font-semibold text-text-primary">{term.term}</dt>
                <dd className="mt-1 text-sm text-text-secondary">{term.definition}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {section.myths ? (
          <ul className="space-y-3">
            {section.myths.map((entry) => (
              <li key={entry.myth} className="rounded-lg border border-border-subtle/60 bg-background/40 p-3">
                <p className="text-sm font-semibold text-accent-highlight">{entry.myth}</p>
                <p className="mt-1 text-sm text-text-secondary">{entry.reality}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {section.references ? (
          <ul className="list-disc space-y-2 pl-5">
            {section.references.map((ref) => (
              <li key={ref.url}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-compound underline-offset-4 hover:underline"
                >
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
