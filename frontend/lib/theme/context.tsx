"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "dark" | "light";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "interest-growth-theme";
const DEFAULT_THEME: ThemeMode = "dark";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);

  const applyTheme = useCallback((next: ThemeMode) => {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setThemeState(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
    window.localStorage.setItem(STORAGE_KEY, DEFAULT_THEME);
  }, [applyTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((_next: ThemeMode) => {
    setThemeState(DEFAULT_THEME);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(DEFAULT_THEME);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
