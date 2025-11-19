export function getFeatureFlags(source?: string): string[] {
  const raw = source ?? process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "";
  return raw
    .split(",")
    .map((flag) => flag.trim())
    .filter(Boolean);
}

export function isFeatureEnabled(feature: string, flags: string[] = getFeatureFlags()): boolean {
  return flags.includes(feature.trim());
}
