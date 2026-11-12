"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronDown, CircleSlash, Clock, Lock, Terminal, TriangleAlert, XCircle } from "lucide-react";
import type { CaseResult, Problem, RunResult } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const caseIcon = {
  passed: <CheckCircle2 className="size-3.5 text-lime" />,
  failed: <XCircle className="size-3.5 text-fg" />,
  error: <TriangleAlert className="size-3.5 text-fg" />,
  timeout: <Clock className="size-3.5 text-fg" />,
};

function CaseRow({ c }: { c: CaseResult }) {
  const [open, setOpen] = useState(c.status !== "passed" && !c.hidden);
  return (
    <li className="rounded-[10px] border border-line bg-surface/60">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12.5px] cursor-pointer"
        aria-expanded={open}
      >
        {caseIcon[c.status]}
        <span className="font-medium">
          {c.hidden ? "Hidden test" : "Test"} {c.index + 1}
        </span>
        <span className={cn("text-[12px]", c.status === "passed" ? "text-lime" : "text-fg/70 line-through decoration-fg/30")}>
          {c.status === "passed" ? "Passed" : c.status === "failed" ? "Wrong answer" : c.status === "error" ? "Runtime error" : "Timed out"}
        </span>
        <span className="ml-auto font-mono text-[11.5px] text-muted tabular">{c.timeMs.toFixed(2)} ms</span>
        <ChevronDown className={cn("size-3.5 text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-1.5 border-t border-line px-3 py-2.5 font-mono text-[12px]">
          {c.hidden ? (
            <p className="flex items-center gap-2 font-sans text-muted"><Lock className="size-3" /> Hidden test inputs are revealed after the battle.</p>
          ) : (
            <>
              <div className="flex gap-3"><span className="w-16 shrink-0 text-muted">Input</span><span className="break-all">{c.input}</span></div>
              <div className="flex gap-3"><span className="w-16 shrink-0 text-muted">Expected</span><span className="text-lime">{c.expected}</span></div>
              <div className="flex gap-3"><span className="w-16 shrink-0 text-muted">Output</span><span className={c.status === "passed" ? "" : "underline decoration-dotted underline-offset-4"}>{c.received}</span></div>
            </>
          )}
        </div>
      )}
    </li>
  );
}

export function ResultsDock({
  result,
  busy,
  busyLabel,
  problem,
}: {
  result?: RunResult;
  busy: boolean;
  busyLabel: string;
  problem: Problem;
}) {
  const [tab, setTab] = useState<"tests" | "console">("tests");
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-line px-2" role="tablist">
        {(["tests", "console"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-medium transition-colors cursor-pointer",
              tab === t ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t === "tests" ? <CheckCircle2 className="size-3.5" /> : <Terminal className="size-3.5" />}
            {t === "tests" ? "Test results" : "Console"}
            {t === "console" && !!result?.console.length && (
              <span className="rounded-full bg-white/[0.08] px-1.5 font-mono text-[10px]">{result.console.length}</span>
            )}
            {tab === t && <motion.span layoutId="dock-tab" className="absolute inset-x-2 bottom-0 h-[2px] bg-lime" />}
          </button>
        ))}
        {result && !busy && (
          <div className="ml-auto flex items-center gap-3 pr-2 text-[12px]">
            <span className={cn("font-semibold", result.verdict === "Accepted" ? "text-lime" : "text-fg")}>{result.verdict}</span>
            <span className="font-mono text-muted tabular">
              {result.passed}/{result.total} · {result.runtimeMs} ms · {result.memoryMb} MB
            </span>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {busy ? (
          <div className="space-y-2" aria-live="polite">
            <p className="mb-3 flex items-center gap-2 text-[12.5px] text-muted">
              <span className="size-1.5 animate-pulse rounded-full bg-lime" /> {busyLabel}
            </p>
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-9 rounded-[10px]" />)}
          </div>
        ) : tab === "console" ? (
          <pre className="min-h-full rounded-[10px] bg-ink p-3 font-mono text-[12px] leading-relaxed text-fg/80">
            {result?.error && <div className="mb-2 text-fg">✕ {result.error}</div>}
            {result?.console.length ? result.console.map((l, i) => <div key={i}><span className="text-muted/60">› </span>{l}</div>) : !result?.error && (
              <span className="text-muted">No output yet. console.log() from your code shows up here.</span>
            )}
          </pre>
        ) : !result ? (
          <div className="grid h-full place-items-center text-center">
            <div>
              <CircleSlash className="mx-auto size-5 text-muted/60" />
              <p className="mt-2 text-[13px] text-fg/80">No runs yet</p>
              <p className="mt-1 text-[12.5px] text-muted">
                Run checks the {problem.tests.filter((t) => !t.hidden).length} sample tests. Submit runs all {problem.tests.length}, including hidden ones.
              </p>
            </div>
          </div>
        ) : result.verdict === "Compilation Error" ? (
          <div className="rounded-[10px] border border-line-strong bg-surface p-3.5">
            <p className="flex items-center gap-2 text-[13px] font-semibold"><TriangleAlert className="size-4" /> Compilation error</p>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px] text-fg/80">{result.error}</pre>
          </div>
        ) : (
          <>
            {!result.executed && (
              <p className="mb-2.5 rounded-[10px] border border-line bg-surface px-3 py-2 text-[12px] text-muted">
                Simulated result. JavaScript runs for real in your browser; other languages need the backend judge.
              </p>
            )}
            {result.error && <p className="mb-2.5 text-[12.5px] text-fg">{result.error}</p>}
            <ul className="space-y-1.5">
              {result.cases.map((c) => <CaseRow key={`${result.mode}-${c.index}-${c.received}`} c={c} />)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
