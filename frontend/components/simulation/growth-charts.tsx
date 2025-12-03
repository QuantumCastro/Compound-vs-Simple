"use client";

import { useMemo } from "react";
import type { CurrencyCode } from "@/lib/formatters";
import { formatCurrency, clampToZeroDisplay } from "@/lib/formatters";
import { ComparisonPoint, GapPoint } from "./types";

const VIEWBOX_WIDTH = 255;
const VIEWBOX_HEIGHT = 100;
const PADDING_X = 15;
const PADDING_Y = 8;

type GrowthChartsProps = {
  comparisonData: ComparisonPoint[];
  gapData: GapPoint[];
  currency: CurrencyCode;
  locale: string;
  labels: {
    comparisonTitle: string;
    comparisonDescription: string;
    legendSimple: string;
    legendCompound: string;
    gapTitle: string;
    gapDescription: string;
    gapLegend: string;
  };
  prefersReducedMotion: boolean;
};

export function GrowthCharts({
  comparisonData,
  gapData,
  currency,
  locale,
  labels,
  prefersReducedMotion,
}: GrowthChartsProps) {
  const comparisonMetrics = useMemo(() => computeComparisonMetrics(comparisonData), [comparisonData]);
  const gapMetrics = useMemo(() => computeGapMetrics(gapData), [gapData]);

  return (
    <section className="glass-panel relative flex flex-col gap-6 overflow-hidden rounded-2xl p-6">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-compound via-accent-highlight to-accent-simple" />
      <ChartHeader title={labels.comparisonTitle} description={labels.comparisonDescription} />
      <ComparisonChart
        data={comparisonMetrics.points}
        currency={currency}
        locale={locale}
        maxValue={comparisonMetrics.maxValue}
        labels={labels}
        prefersReducedMotion={prefersReducedMotion}
      />

      <div className="neon-divider" />

      <ChartHeader title={labels.gapTitle} description={labels.gapDescription} />
      <GapChart
        data={gapMetrics.points}
        maxValue={gapMetrics.maxValue}
        currency={currency}
        locale={locale}
        legend={labels.gapLegend}
        prefersReducedMotion={prefersReducedMotion}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent-compound/60" />
        <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-accent-compound/60" />
        <div className="absolute left-3 bottom-3 h-3 w-3 border-l border-b border-accent-simple/60" />
        <div className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-accent-simple/60" />
      </div>
    </section>
  );
}

type ChartHeaderProps = {
  title: string;
  description: string;
};

function ChartHeader({ title, description }: ChartHeaderProps) {
  return (
    <header>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-muted">{description}</p>
    </header>
  );
}

type ComparisonChartProps = {
  data: ComparisonPoint[];
  maxValue: number;
  currency: CurrencyCode;
  locale: string;
  labels: {
    legendSimple: string;
    legendCompound: string;
  };
  prefersReducedMotion: boolean;
};

function ComparisonChart({ data, maxValue, currency, locale, labels, prefersReducedMotion }: ComparisonChartProps) {
  const ticks = getAxisTicks(data);

  return (
    <figure className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border-subtle/70 bg-background/50 p-4 shadow-[0_12px_28px_rgba(5,5,16,0.5)]">
      <div className="absolute right-4 top-4 z-10 flex flex-wrap gap-4 text-xs font-mono">
        <LegendChip color="bg-accent-compound/80" shadow="shadow-[0_0_10px_rgba(239,68,68,0.5)]" label={labels.legendCompound} />
        <LegendChip color="bg-accent-simple/80" shadow="shadow-[0_0_10px_rgba(59,130,246,0.5)]" label={labels.legendSimple} />
      </div>
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={labels.legendCompound}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="min-w-[720px] w-full"
        >
          <defs>
            <linearGradient id="compoundGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="simpleGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <Axis maxValue={maxValue} ticks={ticks} currency={currency} locale={locale} />
          <path
            d={buildLinePath(data, (point) => point.compound, maxValue)}
            fill="none"
            stroke="#fca5a5"
            strokeWidth={2.5}
            pathLength={1}
            className={!prefersReducedMotion ? "motion-safe:animate-draw-line" : undefined}
            style={!prefersReducedMotion ? { strokeDasharray: 1, strokeDashoffset: 1 } : undefined}
          />
          <path
            d={buildAreaPath(data, (point) => point.compound, maxValue)}
            fill="url(#compoundGradient)"
            className={!prefersReducedMotion ? "motion-safe:animate-grow-area" : undefined}
          />
          <path
            d={buildLinePath(data, (point) => point.simple, maxValue)}
            fill="none"
            stroke="#93c5fd"
            strokeWidth={2}
            pathLength={1}
            className={!prefersReducedMotion ? "motion-safe:animate-draw-line" : undefined}
            style={!prefersReducedMotion ? { strokeDasharray: 1, strokeDashoffset: 1, animationDelay: "0.2s" } : undefined}
          />
          <path
            d={buildAreaPath(data, (point) => point.simple, maxValue)}
            fill="url(#simpleGradient)"
            className={!prefersReducedMotion ? "motion-safe:animate-grow-area" : undefined}
            style={!prefersReducedMotion ? { animationDelay: "0.1s" } : undefined}
          />
        </svg>
      </div>
      <figcaption className="flex flex-wrap gap-4 text-xs text-text-muted">
        <LegendDot color="#3b82f6" label={labels.legendSimple} />
        <LegendDot color="#ef4444" label={labels.legendCompound} />
      </figcaption>
    </figure>
  );
}

type GapChartProps = {
  data: GapPoint[];
  maxValue: number;
  currency: CurrencyCode;
  locale: string;
  legend: string;
  prefersReducedMotion: boolean;
};

function GapChart({ data, maxValue, currency, locale, legend, prefersReducedMotion }: GapChartProps) {
  const ticks = getAxisTicks(data);

  return (
    <figure className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border-subtle/70 bg-background/50 p-4 shadow-[0_12px_28px_rgba(5,5,16,0.5)]">
      <div className="absolute right-4 top-4 z-10 text-xs font-mono text-text-muted">
        <LegendChip color="bg-accent-highlight/80" shadow="shadow-[0_0_10px_rgba(168,85,247,0.5)]" label={legend} />
      </div>
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={legend}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="min-w-[720px] w-full"
        >
        <defs>
          <linearGradient id="gapGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Axis maxValue={maxValue} ticks={ticks} currency={currency} locale={locale} />
        <path
          d={buildAreaPathGap(data, maxValue)}
          fill="url(#gapGradient)"
          className={!prefersReducedMotion ? "motion-safe:animate-grow-area" : undefined}
        />
        <path
          d={buildLinePathGap(data, maxValue)}
          fill="none"
          stroke="#c084fc"
          strokeWidth={2}
          pathLength={1}
          className={!prefersReducedMotion ? "motion-safe:animate-draw-line" : undefined}
          style={!prefersReducedMotion ? { strokeDasharray: 1, strokeDashoffset: 1 } : undefined}
        />
      </svg>
      </div>
      <figcaption className="text-xs text-text-muted">{legend}</figcaption>
    </figure>
  );
}

type AxisProps = {
  maxValue: number;
  ticks: number[];
  currency: CurrencyCode;
  locale: string;
};

function Axis({ maxValue, ticks, currency, locale }: AxisProps) {
  const clampedMax = maxValue <= 0 ? 1 : maxValue;
  return (
    <>
      <line
        x1={PADDING_X}
        y1={VIEWBOX_HEIGHT - PADDING_Y}
        x2={VIEWBOX_WIDTH - PADDING_X}
        y2={VIEWBOX_HEIGHT - PADDING_Y}
        stroke="#16233f"
        strokeWidth={0.8}
      />
      <line
        x1={PADDING_X}
        y1={PADDING_Y}
        x2={PADDING_X}
        y2={VIEWBOX_HEIGHT - PADDING_Y}
        stroke="#16233f"
        strokeWidth={0.8}
      />
      {ticks.map((tick) => {
        const position = getXPosition(tick, ticks[ticks.length - 1] || 1);
        return (
          <text
            key={`tick-x-${tick}`}
            x={position}
            y={VIEWBOX_HEIGHT - PADDING_Y + 5}
            textAnchor="middle"
            className="fill-text-muted text-[4px]"
          >
            {tick}
          </text>
        );
      })}
      <text
        x={PADDING_X}
        y={PADDING_Y - 2}
        textAnchor="middle"
        alignmentBaseline="baseline"
        className="fill-text-muted text-[4px]"
      >
        {formatCurrency(clampedMax, currency, locale)}
      </text>
    </>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </span>
  );
}

function LegendChip({ color, shadow, label }: { color: string; shadow: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${color} ${shadow} border border-white/10`} />
      <span className="text-text-muted">{label}</span>
    </span>
  );
}

function computeComparisonMetrics(points: ComparisonPoint[]) {
  const sanitized = points.map((point) => ({
    period: point.period,
    simple: clampToZeroDisplay(point.simple),
    compound: clampToZeroDisplay(point.compound),
  }));
  const maxValue =
    sanitized.reduce((acc, point) => Math.max(acc, point.simple, point.compound), 0) || 1;

  return { points: sanitized, maxValue };
}

function computeGapMetrics(points: GapPoint[]) {
  const sanitized = points.map((point) => ({
    period: point.period,
    value: clampToZeroDisplay(point.value),
  }));
  const maxValue = sanitized.reduce((acc, point) => Math.max(acc, point.value), 0) || 1;
  return { points: sanitized, maxValue };
}

function buildLinePath(
  points: ComparisonPoint[],
  selector: (point: ComparisonPoint) => number,
  maxValue: number,
): string {
  if (points.length === 0) {
    return "";
  }
  if (points.length === 1) {
    return `M ${PADDING_X} ${VIEWBOX_HEIGHT - PADDING_Y}`;
  }
  const lastPeriod = points[points.length - 1]?.period ?? 1;
  const commands = points.map((point, index) => {
    const x = getXPosition(point.period, lastPeriod);
    const y = getYPosition(selector(point), maxValue);
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });
  return commands.join(" ");
}

function buildAreaPath(
  points: ComparisonPoint[],
  selector: (point: ComparisonPoint) => number,
  maxValue: number,
): string {
  if (points.length === 0) {
    return "";
  }
  const lastPeriod = points[points.length - 1]?.period ?? 1;
  const pathCommands = points.map((point, index) => {
    const x = getXPosition(point.period, lastPeriod);
    const y = getYPosition(selector(point), maxValue);
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });
  const closingLine = `L ${getXPosition(lastPeriod, lastPeriod)} ${VIEWBOX_HEIGHT - PADDING_Y} L ${PADDING_X} ${
    VIEWBOX_HEIGHT - PADDING_Y
  } Z`;

  return `${pathCommands.join(" ")} ${closingLine}`;
}

function buildAreaPathGap(points: GapPoint[], maxValue: number): string {
  if (points.length === 0) {
    return "";
  }
  const lastPeriod = points[points.length - 1]?.period ?? 1;
  const pathCommands = points.map((point, index) => {
    const x = getXPosition(point.period, lastPeriod);
    const y = getYPosition(point.value, maxValue);
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });
  const closingLine = `L ${getXPosition(lastPeriod, lastPeriod)} ${VIEWBOX_HEIGHT - PADDING_Y} L ${PADDING_X} ${
    VIEWBOX_HEIGHT - PADDING_Y
  } Z`;
  return `${pathCommands.join(" ")} ${closingLine}`;
}

function buildLinePathGap(points: GapPoint[], maxValue: number): string {
  if (points.length === 0) {
    return "";
  }
  const lastPeriod = points[points.length - 1]?.period ?? 1;
  const commands = points.map((point, index) => {
    const x = getXPosition(point.period, lastPeriod);
    const y = getYPosition(point.value, maxValue);
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });
  return commands.join(" ");
}

function getXPosition(period: number, lastPeriod: number): number {
  const progress = lastPeriod === 0 ? 0 : period / lastPeriod;
  return PADDING_X + progress * (VIEWBOX_WIDTH - PADDING_X * 2);
}

function getYPosition(value: number, maxValue: number): number {
  if (maxValue === 0) {
    return VIEWBOX_HEIGHT - PADDING_Y;
  }
  const ratio = value / maxValue;
  return VIEWBOX_HEIGHT - PADDING_Y - ratio * (VIEWBOX_HEIGHT - PADDING_Y * 2);
}

function getAxisTicks(points: Array<{ period: number }>): number[] {
  if (points.length === 0) {
    return [0, 1];
  }
  const maxPeriod = points[points.length - 1]?.period ?? 1;
  if (maxPeriod <= 2) {
    return Array.from({ length: maxPeriod + 1 }, (_, index) => index);
  }
  const mid = Math.round(maxPeriod / 2);
  return [0, mid, maxPeriod];
}
