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
import { dictionaries, type Locale, type TranslationDictionary } from "./dictionaries";

type TranslateVariables = Record<string, string | number>;

type TranslateFn = (key: string, vars?: TranslateVariables) => string;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  dictionary: TranslationDictionary;
};

const STORAGE_KEY = "interest-growth-locale";
const FALLBACK_LOCALE: Locale = "en";

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(FALLBACK_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && stored in dictionaries) {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    } else {
      document.documentElement.lang = FALLBACK_LOCALE;
    }
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  const dictionary = dictionaries[locale] ?? dictionaries[FALLBACK_LOCALE];

  const translate = useCallback<TranslateFn>(
    (key, vars) => {
      const raw = resolveKey(dictionary, key) ?? key;
      if (typeof raw !== "string") {
        return key;
      }
      if (!vars) {
        return raw;
      }
      return Object.entries(vars).reduce(
        (acc, [token, value]) => acc.replaceAll(`{{${token}}}`, String(value)),
        raw,
      );
    },
    [dictionary],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: translate,
      dictionary,
    }),
    [dictionary, locale, setLocale, translate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

function resolveKey(dictionary: TranslationDictionary, key: string) {
  const segments = key.split(".");
  let current: unknown = dictionary;

  for (const segment of segments) {
    if (current && typeof current === "object" && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return current as string | TranslationDictionary | undefined;
}
