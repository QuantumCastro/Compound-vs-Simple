"use client";

import { useI18n } from "@/lib/i18n/context";
import { HeroSection } from "./hero";
import { SimulationShell } from "./simulation-shell";
import { EducationalContent } from "./educational-content";
import { FloatingControls } from "../ui/floating-controls";

export function SimulationPage() {
  const { dictionary } = useI18n();

  return (
    <div className="flex flex-col gap-8">
      <a
        href="#simulation"
        className="absolute left-4 top-4 z-10 -translate-y-20 rounded-full bg-accent-compound px-4 py-2 text-xs font-semibold text-background transition focus-visible:translate-y-0"
      >
        {dictionary.nav.skipToMain}
      </a>

      <FloatingControls />

      <HeroSection />

      <main id="simulation" className="flex flex-col gap-8">
        <SimulationShell />
      </main>

      <EducationalContent />
    </div>
  );
}
