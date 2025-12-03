"use client";

import { HeroSection } from "./hero";
import { SimulationShell } from "./simulation-shell";
import { EducationalContent } from "./educational-content";
import { FloatingControls } from "../ui/floating-controls";

export function SimulationPage() {
  return (
    <div className="relative flex flex-col gap-10">
      <FloatingControls />

      <HeroSection />

      <main id="simulation" className="flex flex-col gap-8">
        <SimulationShell />
      </main>

      <EducationalContent />
    </div>
  );
}
