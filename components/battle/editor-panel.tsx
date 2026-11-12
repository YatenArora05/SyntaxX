"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, Lock, Play, RotateCcw, Send } from "lucide-react";
import type { Language, Problem } from "@/types";
import type { YouState } from "@/hooks/use-battle";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EditorSkeleton } from "@/components/editor/editor-skeleton";
import { EDITOR_THEMES, LANGUAGES, type EditorTheme } from "@/lib/constants";
import { ResultsDock } from "./results-dock";
import { cn } from "@/lib/utils";

export const CodeEditor = dynamic(() => import("@/components/editor/code-editor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export function EditorPanel({
  you,
  problem,
  locked,
  active,
  onCode,
  onLanguage,
  onReset,
  onRun,
  onSubmit,
}: {
  you: YouState;
  problem: Problem;
  locked: boolean;
  active: boolean;
  onCode: (c: string) => void;
  onLanguage: (l: Language) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
}) {
  const [theme, setTheme] = useState<EditorTheme>("devbattle");
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const submitted = !!you.result;
  const lang = LANGUAGES.find((l) => l.value === you.language)!;

  return (
    <section
      aria-label="Your editor"
      className={cn(
        "relative flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] border bg-ink transition-[box-shadow,border-color] duration-500",
        active && !submitted ? "border-lime/45 shadow-glow" : "border-line",
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-2.5 py-2">
        <Select
          size="sm"
          ariaLabel="Language"
          value={you.language}
          onValueChange={(v) => onLanguage(v as Language)}
          options={LANGUAGES.map((l) => ({ value: l.value, label: l.label, hint: l.value === "javascript" ? "executes live" : "simulated" }))}
          className="w-[112px] sm:w-[128px]"
        />
        <Select
          size="sm"
          ariaLabel="Editor theme"
          value={theme}
          onValueChange={(v) => setTheme(v as EditorTheme)}
          options={EDITOR_THEMES}
          className="hidden w-[124px] xl:inline-flex"
        />
        <Tooltip content="Reset to starter code">
          <Button variant="ghost" size="icon-sm" aria-label="Reset code" onClick={() => setConfirmReset(true)} disabled={locked || submitted}>
            <RotateCcw />
          </Button>
        </Tooltip>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip content="Run sample tests · Ctrl/⌘ + Enter">
            <Button variant="secondary" size="sm" onClick={onRun} disabled={locked || submitted || you.running || you.submitting}>
              {you.running ? <Loader2 className="animate-spin" /> : <Play />} <span>Run<span className="max-sm:hidden"> Code</span></span>
            </Button>
          </Tooltip>
          <Tooltip content="Submit against all tests · Ctrl/⌘ + Shift + Enter">
            <Button size="sm" onClick={() => setConfirmSubmit(true)} disabled={locked || submitted || you.submitting}>
              {you.submitting ? <Loader2 className="animate-spin" /> : submitted ? <Lock /> : <Send />}
              <span>{submitted ? "Submitted" : <>Submit<span className="max-sm:hidden"> Solution</span></>}</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <CodeEditor
          value={you.code}
          onChange={onCode}
          language={lang.monaco}
          theme={theme}
          readOnly={locked || submitted}
          onRun={onRun}
          onSubmit={() => setConfirmSubmit(true)}
          ariaLabel="Your solution"
        />
        {submitted && (
          <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-lime-line bg-ink/90 px-3 py-1 text-[12px] text-lime backdrop-blur">
            Locked · waiting for the result
          </div>
        )}
      </div>

      <div className="h-[34%] min-h-[180px] shrink-0 border-t border-line bg-surface/40">
        <ResultsDock
          result={you.lastRun}
          busy={you.running || you.submitting}
          busyLabel={you.submitting ? `Judging against all ${problem.tests.length} tests…` : "Running sample tests…"}
          problem={problem}
        />
      </div>

      <ConfirmDialog
        open={confirmSubmit}
        onOpenChange={setConfirmSubmit}
        title="Submit your solution?"
        description={`Your code runs against all ${problem.tests.length} tests, including hidden ones. You can't edit it after submitting.`}
        confirmLabel="Submit solution"
        cancelLabel="Keep editing"
        onConfirm={onSubmit}
      />
      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset to starter code?"
        description="Your current code in this language will be replaced with the starter template."
        confirmLabel="Reset code"
        onConfirm={onReset}
      />
    </section>
  );
}
