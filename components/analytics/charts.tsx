"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSyncExternalStore } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LIME = "#B7F700";
const WHITE = "#FFFFFF";
const MUTED = "#A1A1AA";
const GRID = "rgba(255,255,255,0.06)";
const axis = { stroke: "transparent", tick: { fill: MUTED, fontSize: 11.5 }, tickLine: false } as const;

/** Recharts measures the DOM, so render a skeleton until mounted on the client. */
const noop = () => () => {};
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-line-strong bg-card px-3 py-2 shadow-xl">
      <div className="mb-1 text-[11.5px] text-muted">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[12.5px]">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted">{p.name}</span>
          <span className="ml-auto pl-4 font-mono font-medium tabular">
            {p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

function Frame({ height, children }: { height: number; children: React.ReactElement }) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton className="w-full rounded-[12px]" style={{ height }} />;
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function RatingChart({ data, height = 240 }: { data: { week: string; rating: number }[]; height?: number }) {
  return (
    <Frame height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="ratingFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LIME} stopOpacity={0.28} />
            <stop offset="100%" stopColor={LIME} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="week" {...axis} />
        <YAxis {...axis} domain={["dataMin - 40", "dataMax + 30"]} width={48} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
        <Area type="monotone" dataKey="rating" name="Rating" stroke={LIME} strokeWidth={2} fill="url(#ratingFill)" activeDot={{ r: 4, fill: LIME, stroke: "#080A08", strokeWidth: 2 }} />
      </AreaChart>
    </Frame>
  );
}

export function WinLossChart({ data, height = 220 }: { data: { day: string; wins: number; losses: number }[]; height?: number }) {
  return (
    <Frame height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barGap={2}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" {...axis} interval={1} />
        <YAxis {...axis} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="wins" name="Wins" fill={LIME} radius={[4, 4, 0, 0]} maxBarSize={14} />
        <Bar dataKey="losses" name="Losses" fill="rgba(255,255,255,0.35)" radius={[4, 4, 0, 0]} maxBarSize={14} />
      </BarChart>
    </Frame>
  );
}

export function AccuracyChart({ data, height = 220 }: { data: { week: string; accuracy: number; firstTry: number }[]; height?: number }) {
  return (
    <Frame height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="week" {...axis} />
        <YAxis {...axis} domain={[30, 100]} unit="%" />
        <Tooltip content={<ChartTooltip unit="%" />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
        <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke={LIME} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="firstTry" name="First-try accepts" stroke={WHITE} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 4" dot={false} />
      </LineChart>
    </Frame>
  );
}

export function SolveTimeChart({ data, height = 220 }: { data: { difficulty: string; you: number; average: number }[]; height?: number }) {
  const fmt = data.map((d) => ({ ...d, you: Math.round(d.you / 6) / 10, average: Math.round(d.average / 6) / 10 }));
  return (
    <Frame height={height}>
      <BarChart data={fmt} margin={{ top: 8, right: 4, left: -18, bottom: 0 }} barGap={4}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="difficulty" {...axis} />
        <YAxis {...axis} unit="m" />
        <Tooltip content={<ChartTooltip unit=" min" />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="you" name="You" fill={LIME} radius={[5, 5, 0, 0]} maxBarSize={28} />
        <Bar dataKey="average" name="Platform average" fill="rgba(255,255,255,0.3)" radius={[5, 5, 0, 0]} maxBarSize={28} />
      </BarChart>
    </Frame>
  );
}

const SHORT: Record<string, string> = { "Dynamic Programming": "DP", "Sliding Window": "Window", "Two Pointers": "2 Pointers", "Segment Trees": "Seg Trees" };

export function TopicRadar({ data, height = 300 }: { data: { topic: string; score: number }[]; height?: number }) {
  return (
    <Frame height={height}>
      <RadarChart data={data.map((d) => ({ ...d, topic: SHORT[d.topic] ?? d.topic }))} outerRadius="68%">
        <PolarGrid stroke="rgba(255,255,255,0.09)" />
        <PolarAngleAxis dataKey="topic" tick={{ fill: MUTED, fontSize: 11 }} />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <Radar dataKey="score" name="Mastery" stroke={LIME} fill={LIME} fillOpacity={0.18} strokeWidth={2} />
      </RadarChart>
    </Frame>
  );
}
