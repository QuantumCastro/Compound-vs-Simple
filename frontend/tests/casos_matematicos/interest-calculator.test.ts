import { describe, expect, it } from "vitest";
import { simulateInterest } from "@/lib/interest-calculator";

describe("simulateInterest", () => {
  it("matches reference values for 10% rate over 12 periods without contributions", () => {
    const result = simulateInterest({
      principal: 1000,
      ratePercent: 10,
      periods: 12,
      compoundFrequency: 1,
      contribution: 0,
      contributionsEnabled: false,
    });

    const finalSimple = result.summary.finalSimple;
    const finalCompound = result.summary.finalCompound;

    expect(finalSimple).toBeCloseTo(2200, 2);
    expect(finalCompound).toBeCloseTo(3138.43, 2);
  });

  it("keeps capital flat when rate is zero", () => {
    const result = simulateInterest({
      principal: 1500,
      ratePercent: 0,
      periods: 24,
      compoundFrequency: 4,
      contribution: 0,
      contributionsEnabled: false,
    });

    expect(result.summary.finalSimple).toBeCloseTo(1500, 5);
    expect(result.summary.finalCompound).toBeCloseTo(1500, 5);
  });

  it("handles negative rates without producing NaN", () => {
    const result = simulateInterest({
      principal: 5000,
      ratePercent: -5,
      periods: 6,
      compoundFrequency: 2,
      contribution: 0,
      contributionsEnabled: false,
    });

    expect(Number.isFinite(result.summary.finalSimple)).toBeTruthy();
    expect(Number.isFinite(result.summary.finalCompound)).toBeTruthy();
    expect(result.summary.finalCompound).toBeLessThan(5000);
  });

  it("applies contributions equally to both regimes", () => {
    const result = simulateInterest({
      principal: 2000,
      ratePercent: 4,
      periods: 10,
      compoundFrequency: 2,
      contribution: 100,
      contributionsEnabled: true,
    });

    const totalContributions = result.summary.totalContributions;

    expect(totalContributions).toBe(1000);
    expect(result.summary.finalSimple).toBeGreaterThan(2000 + totalContributions);
    expect(result.summary.finalCompound).toBeGreaterThan(result.summary.finalSimple);
  });
});
