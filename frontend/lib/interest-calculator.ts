export const INPUT_LIMITS = {
  principal: { min: 0, max: Number.POSITIVE_INFINITY },
  ratePercent: { min: -100, max: 1000 },
  periods: { min: 0, max: 480 },
  compoundFrequency: { min: 1, max: 12 },
  contribution: { min: 0, max: 100000 },
} as const;

export type SimulationInput = {
  principal: number;
  ratePercent: number;
  periods: number;
  compoundFrequency: number;
  contribution: number;
  contributionsEnabled: boolean;
};

export type NormalizedSimulationInput = {
  principal: number;
  ratePercentPerPeriod: number;
  ratePerPeriod: number;
  periods: number;
  compoundFrequency: number;
  contributionPerPeriod: number;
  contributionsEnabled: boolean;
};

export type PeriodSnapshot = {
  periodIndex: number;
  totalContributions: number;
  contributionApplied: number;
  simple: {
    base: number;
    interestAccrued: number;
    total: number;
  };
  compound: {
    interestAccrued: number;
    total: number;
  };
};

export type SimulationSummary = {
  finalSimple: number;
  finalCompound: number;
  interestSimple: number;
  interestCompound: number;
  totalContributions: number;
  difference: number;
  breakEvenPeriod?: number;
  effectiveAnnualRateSimple: number;
  effectiveAnnualRateCompound: number;
};

export type SimulationResult = {
  input: NormalizedSimulationInput;
  series: PeriodSnapshot[];
  summary: SimulationSummary;
};

export function sanitizeInput(input: SimulationInput): NormalizedSimulationInput {
  const principal = clampNumber(
    input.principal,
    INPUT_LIMITS.principal.min,
    INPUT_LIMITS.principal.max,
  );
  const ratePercentPerPeriod = clampNumber(
    input.ratePercent,
    INPUT_LIMITS.ratePercent.min,
    INPUT_LIMITS.ratePercent.max,
  );
  const periods = clampInteger(
    input.periods,
    INPUT_LIMITS.periods.min,
    INPUT_LIMITS.periods.max,
  );
  const compoundFrequency = clampInteger(
    input.compoundFrequency,
    INPUT_LIMITS.compoundFrequency.min,
    INPUT_LIMITS.compoundFrequency.max,
  );
  const contributionPerPeriod = clampNumber(
    input.contribution,
    INPUT_LIMITS.contribution.min,
    INPUT_LIMITS.contribution.max,
  );

  return {
    principal,
    ratePercentPerPeriod,
    ratePerPeriod: ratePercentPerPeriod / 100,
    periods,
    compoundFrequency,
    contributionPerPeriod,
    contributionsEnabled: Boolean(input.contributionsEnabled),
  };
}

export function simulateInterest(input: SimulationInput): SimulationResult {
  const normalized = sanitizeInput(input);
  const {
    principal,
    ratePerPeriod,
    periods,
    compoundFrequency,
    contributionPerPeriod,
    contributionsEnabled,
  } = normalized;

  const totalPeriods = Math.max(periods, 0);
  const contributionApplied = contributionsEnabled ? contributionPerPeriod : 0;
  const reinvestmentsPerPeriod = Math.max(compoundFrequency, 1);
  const periodRate = ratePerPeriod;

  const series: PeriodSnapshot[] = [];

  for (let periodIndex = 0; periodIndex <= totalPeriods; periodIndex += 1) {
    const simplePrincipalTotals = calculateSimplePrincipalTotals(principal, periodRate, periodIndex);
    const simpleContributionTotals = calculateSimpleContributionTotals(contributionApplied, periodRate, periodIndex);
    const simpleTotal = simplePrincipalTotals.total + simpleContributionTotals.total;

    const compoundPrincipalTotals = calculateCompoundPrincipalTotals(
      principal,
      periodRate,
      reinvestmentsPerPeriod,
      periodIndex,
    );
    const compoundContributionTotals = calculateCompoundContributionTotals(
      contributionApplied,
      periodRate,
      reinvestmentsPerPeriod,
      periodIndex,
    );
    const compoundTotal = compoundPrincipalTotals.total + compoundContributionTotals.total;

    const contributionsSoFar = contributionApplied * periodIndex;
    const investedBase = principal + contributionsSoFar;

    series.push({
      periodIndex,
      totalContributions: contributionsSoFar,
      contributionApplied,
      simple: {
        base: investedBase,
        interestAccrued: simpleTotal - investedBase,
        total: simpleTotal,
      },
      compound: {
        interestAccrued: compoundTotal - investedBase,
        total: compoundTotal,
      },
    });
  }

  const finalSimplePrincipalTotals = calculateSimplePrincipalTotals(principal, periodRate, totalPeriods);
  const finalSimpleContributionTotals = calculateSimpleContributionTotals(contributionApplied, periodRate, totalPeriods);
  const finalCompoundPrincipalTotals = calculateCompoundPrincipalTotals(
    principal,
    periodRate,
    reinvestmentsPerPeriod,
    totalPeriods,
  );
  const finalCompoundContributionTotals = calculateCompoundContributionTotals(
    contributionApplied,
    periodRate,
    reinvestmentsPerPeriod,
    totalPeriods,
  );

  const finalSimple = finalSimplePrincipalTotals.total + finalSimpleContributionTotals.total;
  const finalCompound = finalCompoundPrincipalTotals.total + finalCompoundContributionTotals.total;
  const totalContributions = contributionApplied * totalPeriods;
  const investedCapital = principal + totalContributions;

  const interestSimple = finalSimplePrincipalTotals.interest + finalSimpleContributionTotals.interest;
  const interestCompound = finalCompoundPrincipalTotals.interest + finalCompoundContributionTotals.interest;
  const breakEvenPeriod = series.find((snapshot) => snapshot.compound.total > snapshot.simple.total)?.periodIndex;
  const years = totalPeriods / 12;

  const effectiveAnnualRateSimple =
    years > 0 && investedCapital > 0
      ? Math.pow(Math.max(finalSimple, 0) / investedCapital, 1 / Math.max(years, 1e-8)) - 1
      : 0;
  const effectiveAnnualRateCompound =
    years > 0 && investedCapital > 0
      ? Math.pow(Math.max(finalCompound, 0) / investedCapital, 1 / Math.max(years, 1e-8)) - 1
      : 0;

  const summary: SimulationSummary = {
    finalSimple,
    finalCompound,
    interestSimple,
    interestCompound,
    totalContributions,
    difference: finalCompound - finalSimple,
    breakEvenPeriod: breakEvenPeriod && breakEvenPeriod > 0 ? breakEvenPeriod : undefined,
    effectiveAnnualRateSimple,
    effectiveAnnualRateCompound,
  };

  return {
    input: normalized,
    series,
    summary,
  };
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

function clampInteger(value: number, min: number, max: number): number {
  return Math.round(clampNumber(value, min, max));
}

type GrowthTotals = {
  total: number;
  interest: number;
};

function calculateSimplePrincipalTotals(principal: number, ratePerPeriod: number, periods: number): GrowthTotals {
  if (principal === 0) {
    return { total: 0, interest: 0 };
  }
  const clampedPeriods = Math.max(periods, 0);
  const total = principal * (1 + ratePerPeriod * clampedPeriods);
  return {
    total,
    interest: principal * ratePerPeriod * clampedPeriods,
  };
}

function calculateSimpleContributionTotals(contribution: number, ratePerPeriod: number, periods: number): GrowthTotals {
  if (contribution <= 0 || periods <= 0) {
    return { total: 0, interest: 0 };
  }

  const clampedPeriods = Math.max(periods, 0);
  const contributions = contribution * clampedPeriods;
  const interest = contribution * ratePerPeriod * (clampedPeriods * (clampedPeriods - 1)) / 2;

  return {
    total: contributions + interest,
    interest,
  };
}

function calculateCompoundPrincipalTotals(
  principal: number,
  ratePerPeriod: number,
  compoundingPerPeriod: number,
  periods: number,
): GrowthTotals {
  if (principal === 0) {
    return { total: 0, interest: 0 };
  }

  const growthFactor = canonicalCompoundFactor(ratePerPeriod, compoundingPerPeriod, periods);
  const total = principal * growthFactor;
  return {
    total,
    interest: principal * (growthFactor - 1),
  };
}

function calculateCompoundContributionTotals(
  contribution: number,
  ratePerPeriod: number,
  compoundingPerPeriod: number,
  periods: number,
): GrowthTotals {
  if (contribution <= 0 || periods <= 0) {
    return { total: 0, interest: 0 };
  }

  const perPeriodFactor = canonicalCompoundFactor(ratePerPeriod, compoundingPerPeriod, 1);

  if (Math.abs(perPeriodFactor - 1) < 1e-12) {
    const totalFlat = contribution * periods;
    return { total: totalFlat, interest: 0 };
  }

  const total = contribution * ((Math.pow(perPeriodFactor, periods) - 1) / (perPeriodFactor - 1));
  const contributions = contribution * periods;

  return {
    total,
    interest: total - contributions,
  };
}

function canonicalCompoundFactor(ratePerPeriod: number, compoundingPerPeriod: number, periods: number): number {
  if (periods <= 0) {
    return 1;
  }
  const n = Math.max(compoundingPerPeriod, 1);
  const base = 1 + ratePerPeriod / n;
  return Math.pow(base, n * periods);
}
