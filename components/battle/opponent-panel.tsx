"use client";

import { Cpu, Eye, Keyboard, MemoryStick, Send, Timer } from "lucide-react";
import type { Player, Problem } from "@/types";
import type { OpponentState } from "@/hooks/use-battle";
import { Progress } from "@/components/ui/progress";
import { LANGUAGES } from "@/lib/constants";
import { CodeEditor } from "./editor-panel";
import { cn, formatClock } from "@/lib/utils";

function Stat({ icon: Icon, label, value, lime }: { icon: typeof Cpu; label: string; value: string; lime?: boolean }) {
  return (
    <div className="rounded-[10px] border border-line bg-surface/60 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11.5px] text-muted"><Icon className="size-3" />{label}</div>
      <div className={cn("mt-1 font-mono text-[14px] font-medium tabular", lime && "text-lime")}>{value}</div>
    </div>
  );
}

export function OpponentPanel({ opp, opponent, problem, active }: { opp: OpponentState; opponent: Player; problem: Problem; active: boolean }) {
  const lang = LANGUAGES.find((l) => l.value === opp.language)!;
  const latest = opp.result ?? opp.lastRun;
  const status = opp.result
    ? opp.result.verdict
    : opp.running
      ? "Judging…"
      : opp.lastRun
        ? `Ran samples · ${opp.lastRun.verdict}`
        : opp.code
          ? "Writing solution"
          : "Reading the problem";

  return (
    <section
      aria-label={`${opponent.username}'s editor (live view)`}
      className={cn(
        "relative flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border bg-ink transition-[box-shadow,border-color] duration-500",
        active ? "border-white/30 shadow-[0_0_0_1px_rgb(255_255_255/0.12),0_0_32px_-8px_rgb(255_255_255/0.15)]" : "border-line",
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-2.5 text-[12.5px]">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1 text-fg/90"><Eye className="size-3.5" /> Live view</span>
        <span className="text-muted">{lang.label}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-muted">
          <Keyboard className="size-3.5" />
          {opp.typing ? (
            <span className="text-fg">typing<span className="animate-pulse">…</span></span>
          ) : (
            <span>{opp.keystrokes} edits</span>
          )}
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        {opp.code ? (
          <CodeEditor value={opp.code} language={lang.monaco} readOnly followTail ariaLabel={`${opponent.username}'s code`} />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center">
            <div>
              <div className="mx-auto flex w-fit gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${d * 200}ms` }} />
                ))}
              </div>
              <p className="mt-3 text-[13px] text-fg/80">{opponent.username} is reading the problem</p>
              <p className="mt-1 text-[12.5px] text-muted">Their code streams here as they type.</p>
            </div>
          </div>
        )}
      </div>

      <div className="h-[34%] min-h-[180px] shrink-0 space-y-3 overflow-y-auto border-t border-line bg-surface/40 p-3">
        <div className="flex items-center justify-between text-[12.5px]">
          <span className="text-muted">Submission status</span>
          <span className={cn("font-medium", opp.result?.verdict === "Accepted" ? "text-lime" : "text-fg")} aria-live="polite">{status}</span>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-[12px]">
            <span className="text-muted">Test cases passed</span>
            <span className="font-mono tabular">{latest ? `${latest.passed}/${latest.total}` : `0/${problem.tests.length}`}</span>
          </div>
          <Progress value={latest ? (latest.passed / latest.total) * 100 : 0} barClassName="bg-fg/80" label="Opponent tests passed" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={Cpu} label="Exec time" value={latest ? `${latest.runtimeMs} ms` : "—"} />
          <Stat icon={MemoryStick} label="Memory" value={latest ? `${latest.memoryMb} MB` : "—"} />
          <Stat icon={opp.result ? Send : Timer} label="Submitted" value={opp.result?.submittedAtSec !== undefined ? formatClock(opp.result.submittedAtSec) : "—"} />
        </div>
      </div>
    </section>
  );
}
