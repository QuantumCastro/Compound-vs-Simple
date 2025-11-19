interface FeaturePillProps {
  label: string;
}

export function FeaturePill({ label }: FeaturePillProps) {
  return (
    <span className="rounded-full bg-accent-compound/15 px-2 py-1 text-xs font-medium uppercase tracking-wide text-accent-compound">
      {label}
    </span>
  );
}
