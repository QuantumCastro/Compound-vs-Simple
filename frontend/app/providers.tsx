"use client";

import { I18nProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme/context";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
