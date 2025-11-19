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
    <section className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-background-raised/70 p-6 shadow-panel-soft backdrop-blur">
      <ChartHeader title={labels.comparisonTitle} description={labels.comparisonDescription} />
      <ComparisonChart
        data={comparisonMetrics.points}
        currency={currency}
        locale={locale}
        maxValue={comparisonMetrics.maxValue}
        labels={labels}
        prefersReducedMotion={prefersReducedMotion}
      />

      <div className="h-px w-full bg-border-subtle/60" />

      <ChartHeader title={labels.gapTitle} description={labels.gapDescription} />
      <GapChart
        data={gapMetrics.points}
        maxValue={gapMetrics.maxValue}
        currency={currency}
        locale={locale}
        legend={labels.gapLegend}
        prefersReducedMotion={prefersReducedMotion}
      />
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
    <figure className="relative flex flex-col gap-4">
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={labels.legendCompound}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="min-w-[640px] w-full"
        >
          <defs>
            <linearGradient id="compoundGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="simpleGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
            </linearGradient>
          </defs>
          <Axis maxValue={maxValue} ticks={ticks} currency={currency} locale={locale} />
          <path
            d={buildLinePath(data, (point) => point.compound, maxValue)}
            fill="none"
            stroke="#38BDF8"
            strokeWidth={1}
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
            stroke="#34D399"
            strokeWidth={1}
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
        <LegendDot color="#34D399" label={labels.legendSimple} />
        <LegendDot color="#38BDF8" label={labels.legendCompound} />
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
    <figure className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={legend}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="min-w-[640px] w-full"
        >
        <defs>
          <linearGradient id="gapGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FACC15" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
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
          stroke="#FACC15"
          strokeWidth={1}
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
        stroke="#334266"
        strokeWidth={0.5}
      />
      <line
        x1={PADDING_X}
        y1={PADDING_Y}
        x2={PADDING_X}
        y2={VIEWBOX_HEIGHT - PADDING_Y}
        stroke="#334266"
        strokeWidth={0.5}
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
