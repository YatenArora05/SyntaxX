"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BrainCircuit, Equal, History, RotateCcw, Sparkles, Trophy } from "lucide-react";
import type { AiEvaluation, Player, RunResult, ScoreBreakdown } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WEIGHTS } from "@/lib/services/scoring";
import { Confetti } from "./particles";
import { cn, formatClock } from "@/lib/utils";

type Verdict = { winner: "you" | "opponent" | "draw"; you: ScoreBreakdown; opponent: ScoreBreakdown; reason: string };

function MetricRow({ label, you, them, better }: { label: string; you: string; them: string; better: "you" | "opponent" | "even" }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-line py-3 text-[14px] first:border-t-0">
      <span className={cn("text-right font-mono tabular", better === "you" ? "font-semibold text-lime" : "text-fg/80")}>{you}</span>
      <span className="w-36 text-center text-[12px] text-muted">{label}</span>
      <span className={cn("font-mono tabular", better === "opponent" ? "font-semibold text-fg" : "text-fg/80")}>
        {them}
        {better === "opponent" && <span className="ml-2 text-[10px] text-muted">better</span>}
      </span>
    </div>
  );
}

/** Lower is better; differences inside `noise` (absolute, or 15%) are shown as even, matching the scorer. */
const cmpLow = (a?: number, b?: number, noise = 0): "you" | "opponent" | "even" => {
  if (a === undefined || b === undefined) return a !== undefined ? "you" : b !== undefined ? "opponent" : "even";
  if (Math.abs(a - b) <= (noise ? Math.max(noise, Math.min(a, b) * 0.15) : 0)) return "even";
  return a < b ? "you" : "opponent";
};
const cmpHigh = (a = 0, b = 0): "you" | "opponent" | "even" => (a === b ? "even" : a > b ? "you" : "opponent");

function ScoreBars({ s, lime }: { s: ScoreBreakdown; lime?: boolean }) {
  const rows: [string, number, number][] = [
    ["Correctness", s.correctness, WEIGHTS.correctness],
    ["Runtime", s.runtime, WEIGHTS.runtime],
    ["Memory", s.memory, WEIGHTS.memory],
    ["Speed", s.speed, WEIGHTS.speed],
  ];
  return (
    <div className="space-y-2">
      {rows.map(([label, v, max]) => (
        <div key={label} className="grid grid-cols-[84px_1fr_40px] items-center gap-2 text-[12px]">
          <span className="text-muted">{label}</span>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div className={cn("h-full rounded-full", lime ? "bg-lime" : "bg-fg/70")} initial={{ width: 0 }} animate={{ width: `${(v / max) * 100}%` }} transition={{ duration: 0.9, delay: 0.4 }} />
          </div>
          <span className="text-right font-mono tabular text-fg/80">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function AiJudgePanel({ ai, opponentName }: { ai: AiEvaluation | null; opponentName: string }) {
  return (
    <div className="rounded-[18px] border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <span className="flex items-center gap-2 text-[14px] font-semibold"><Sparkles className="size-4 text-lime" /> AI judge evaluation</span>
        <span className="text-[11.5px] text-muted">Commentary only · the winner is decided by execution</span>
      </div>
      {!ai ? (
        <div className="space-y-3 p-5" aria-live="polite" aria-label="AI evaluation loading">
          <p className="flex items-center gap-2 text-[13px] text-muted"><BrainCircuit className="size-4 animate-pulse text-lime" /> Reading both solutions…</p>
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-24 w-full rounded-[12px]" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
          <p className="text-[14.5px] leading-relaxed text-fg/90">{ai.summary}</p>
          <div className="mt-5 overflow-x-auto rounded-[12px] border border-line">
            <table className="w-full min-w-[480px] text-[13px]">
              <thead className="bg-surface text-[11.5px] text-muted">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Criterion</th>
                  <th className="px-4 py-2.5 text-left font-medium">You</th>
                  <th className="px-4 py-2.5 text-left font-medium">{opponentName}</th>
                </tr>
              </thead>
              <tbody>
                {ai.criteria.map((c) => (
                  <tr key={c.key} className="border-t border-line">
                    <td className="px-4 py-2.5 text-muted">{c.label}</td>
                    <td className={cn("px-4 py-2.5 font-mono text-[12.5px]", c.edge === "you" && "font-semibold text-lime")}>{c.you}</td>
                    <td className={cn("px-4 py-2.5 font-mono text-[12.5px]", c.edge === "opponent" && "font-semibold text-fg underline decoration-fg/40 underline-offset-4")}>{c.opponent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4 className="mt-5 text-[13px] font-semibold">How to improve</h4>
          <ul className="mt-2 space-y-2">
            {ai.suggestions.map((s) => (
              <li key={s} className="flex gap-2.5 text-[13.5px] leading-relaxed text-fg/80">
                <ArrowRight className="mt-1 size-3.5 shrink-0 text-lime" /> {s}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

export function BattleResult({
  me,
  opponent,
  you,
  them,
  verdict,
  delta,
  ai,
  onRematch,
}: {
  me: Player;
  opponent: Player;
  you?: RunResult;
  them?: RunResult;
  verdict: Verdict;
  delta: number;
  ai: AiEvaluation | null;
  onRematch: () => void;
}) {
  const won = verdict.winner === "you";
  const draw = verdict.winner === "draw";
  const winner = won ? me : opponent;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-label="Battle result"
    >
      <Confetti active={won} />
      <div aria-hidden className="bg-grid mask-radial pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-14 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14 }}>
            {draw ? (
              <Equal className="size-10 text-fg" />
            ) : (
              <div className="relative">
                <Avatar name={winner.username} size={96} ring />
                <span className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-full bg-lime text-ink">
                  <Trophy className="size-4" />
                </span>
              </div>
            )}
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0, letterSpacing: "0.1em" }}
            animate={{ y: 0, opacity: 1, letterSpacing: "-0.05em" }}
            transition={{ delay: 0.15, type: "spring", stiffness: 120, damping: 16 }}
            className={cn("mt-7 text-[clamp(48px,9vw,96px)] font-extrabold leading-none", won && "text-lime")}
          >
            {draw ? "DRAW" : won ? "VICTORY" : "DEFEAT"}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-4 text-[16px] text-fg/85">
            {draw ? "Dead even." : `${winner.username} wins the battle.`} <span className="text-muted">{verdict.reason}</span>
          </motion.p>
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn("mt-4 rounded-full px-3 py-1 font-mono text-[13px] font-semibold", delta >= 0 ? "bg-lime text-ink" : "bg-white/[0.08] text-fg")}
          >
            {delta >= 0 ? "+" : ""}{delta} rating → {me.rating + delta}
          </motion.span>
        </div>

        {/* comparison */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 rounded-[18px] border border-line bg-card p-5 sm:p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pb-4">
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <div className="text-[12px] text-muted">You</div>
                <div className="font-semibold">{me.username}</div>
              </div>
              <Avatar name={me.username} size={36} ring={won} />
            </div>
            <span className="w-36 text-center text-[12px] font-black italic text-lime">VS</span>
            <div className="flex items-center gap-3">
              <Avatar name={opponent.username} size={36} ring={verdict.winner === "opponent"} />
              <div>
                <div className="text-[12px] text-muted">Opponent</div>
                <div className="font-semibold">{opponent.username}</div>
              </div>
            </div>
          </div>
          <MetricRow label="Test cases passed" you={you ? `${you.passed}/${you.total}` : "—"} them={them ? `${them.passed}/${them.total}` : "No submission"} better={cmpHigh(you?.passed, them?.passed)} />
          <MetricRow label="Execution time" you={you ? `${you.runtimeMs} ms` : "—"} them={them ? `${them.runtimeMs} ms` : "—"} better={cmpLow(you?.runtimeMs, them?.runtimeMs, 1)} />
          <MetricRow label="Memory" you={you ? `${you.memoryMb} MB` : "—"} them={them ? `${them.memoryMb} MB` : "—"} better={cmpLow(you?.memoryMb, them?.memoryMb, 1)} />
          <MetricRow label="Submitted at" you={you?.submittedAtSec !== undefined ? formatClock(you.submittedAtSec) : "—"} them={them?.submittedAtSec !== undefined ? formatClock(them.submittedAtSec) : "—"} better={cmpLow(you?.submittedAtSec, them?.submittedAtSec)} />
          <MetricRow label="Battle score" you={`${verdict.you.total}`} them={`${verdict.opponent.total}`} better={cmpHigh(verdict.you.total, verdict.opponent.total)} />
          <div className="mt-5 grid gap-6 border-t border-line pt-5 sm:grid-cols-2">
            <ScoreBars s={verdict.you} lime />
            <ScoreBars s={verdict.opponent} />
          </div>
          {you && !you.executed && (
            <p className="mt-4 text-[12px] text-muted">Your submission used the simulated judge. Connect the backend judge for real Python, C++ and Java benchmarks.</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-5">
          <AiJudgePanel ai={ai} opponentName={opponent.username} />
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={onRematch}><RotateCcw /> Rematch</Button>
          <Button size="lg" variant="secondary" asChild><Link href="/find-battle">Find a new opponent</Link></Button>
          <Button size="lg" variant="ghost" asChild><Link href="/ai-coach?topic=last-battle"><BrainCircuit /> Review with AI Coach</Link></Button>
          <Button size="lg" variant="ghost" asChild><Link href="/history"><History /> Battle history</Link></Button>
        </div>
      </div>
    </motion.div>
  );
}
