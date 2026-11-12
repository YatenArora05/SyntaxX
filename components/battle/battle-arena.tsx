"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BrainCircuit } from "lucide-react";
import type { BattleMode, Language } from "@/types";
import { useBattle } from "@/hooks/use-battle";
import { getProblem } from "@/lib/mock-data/problems";
import { currentUser, leaderboard } from "@/lib/mock-data/players";
import { randomId } from "@/lib/utils";
import { ArenaHeader } from "./arena-header";
import { PlayerBar } from "./player-bar";
import { ProblemPanel } from "./problem-panel";
import { EditorPanel } from "./editor-panel";
import { OpponentPanel } from "./opponent-panel";
import { BattleIntro } from "./battle-intro";
import { BattleResult } from "./battle-result";
import { useSession } from "@/lib/services/auth";
import { cn } from "@/lib/utils";

type MobileTab = "problem" | "you" | "opponent";

/** Stable id derived from the query so server and client render the same value. */
function config_seed(q: string) {
  let h = 7;
  for (const c of q) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return h.toString(36).toUpperCase().slice(0, 4).padEnd(4, "X");
}

/** Keyed by the query string so a rematch (new battle id) starts from a clean state. */
export function BattleArena() {
  const params = useSearchParams();
  return <Arena key={params.toString()} />;
}

function Arena() {
  const params = useSearchParams();
  const router = useRouter();
  const session = useSession();

  const config = useMemo(() => {
    const problem = getProblem(params.get("problem"));
    const opponent = leaderboard.find((p) => p.username === params.get("opponent")) ?? leaderboard[6]!;
    const mode = (params.get("mode") as BattleMode) || "ranked";
    const lang = (params.get("lang") as Language) || "javascript";
    const durationMin = Math.min(60, Math.max(3, Number(params.get("d")) || (mode === "quick" ? 10 : 15)));
    const battleId = params.get("id") || `BTL-${config_seed(params.toString())}`;
    return { problem, opponent, mode, lang, durationMin, battleId };
  }, [params]);

  const me = useMemo(() => ({ ...currentUser, username: session?.username ?? currentUser.username }), [session]);

  const b = useBattle({
    battleId: config.battleId,
    problem: config.problem,
    me,
    opponent: config.opponent,
    durationSec: config.durationMin * 60,
    initialLanguage: config.lang,
  });

  const [problemOpen, setProblemOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("you");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setProblemOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rematch = useCallback(() => {
    const q = new URLSearchParams(params.toString());
    q.set("id", randomId("BTL-", 4));
    router.replace(`/battle?${q.toString()}`);
  }, [params, router]);

  const yourTests = b.you.lastRun ? `${b.you.lastRun.passed}/${b.you.lastRun.total}` : `0/${config.problem.tests.filter((t) => !t.hidden).length}`;
  const latestOpp = b.opp.result ?? b.opp.lastRun;
  const oppTests = latestOpp ? `${latestOpp.passed}/${latestOpp.total}` : "—";
  const locked = b.phase !== "live";
  const youActive = b.yourProgress >= b.opponentProgress;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ink">
      <ArenaHeader
        battleId={config.battleId}
        phase={b.phase}
        remaining={b.remaining}
        duration={config.durationMin * 60}
        problemOpen={problemOpen}
        onToggleProblem={() => setProblemOpen((o) => !o)}
        ranked={config.mode === "ranked"}
      />
      <PlayerBar
        me={me}
        opponent={config.opponent}
        youTyping={b.youTyping}
        youRunning={b.you.running || b.you.submitting}
        youResult={b.you.result}
        youTests={yourTests}
        oppConn={b.opp.status}
        oppTyping={b.opp.typing}
        oppRunning={b.opp.running}
        oppResult={b.opp.result}
        oppTests={oppTests}
        yourProgress={b.yourProgress}
        opponentProgress={b.opponentProgress}
      />

      {/* mobile tabs */}
      <div className="flex shrink-0 gap-1 border-b border-line p-1.5 lg:hidden" role="tablist" aria-label="Arena panels">
        {(["problem", "you", "opponent"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={mobileTab === t}
            onClick={() => setMobileTab(t)}
            className={cn(
              "min-w-0 flex-1 truncate rounded-[8px] px-2 py-2 text-[13px] font-medium transition-colors cursor-pointer",
              mobileTab === t ? "bg-white/[0.08] text-fg" : "text-muted",
            )}
          >
            {t === "you" ? "Your code" : t === "opponent" ? config.opponent.username : "Problem"}
          </button>
        ))}
      </div>

      <main className="relative flex min-h-0 flex-1 gap-2 p-2">
        {/* problem panel */}
        <AnimatePresence initial={false}>
          {problemOpen && (
            <motion.aside
              key="problem"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="hidden shrink-0 overflow-hidden rounded-[14px] border border-line bg-surface lg:block"
              aria-label="Problem description"
            >
              <div className="h-full w-[380px]">
                <ProblemPanel problem={config.problem} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        <div className={cn("min-w-0 flex-1 overflow-hidden rounded-[14px] border border-line bg-surface lg:hidden", mobileTab !== "problem" && "hidden")}>
          <ProblemPanel problem={config.problem} />
        </div>

        <div className={cn("relative min-w-0 flex-1 gap-2 lg:grid lg:grid-cols-2", mobileTab === "problem" ? "hidden lg:grid" : "flex")}>
          <div className={cn("min-w-0 flex-1", mobileTab !== "you" && "max-lg:hidden")}>
            <EditorPanel
              you={b.you}
              problem={config.problem}
              locked={locked}
              active={youActive}
              onCode={b.setCode}
              onLanguage={b.setLanguage}
              onReset={b.resetCode}
              onRun={b.run}
              onSubmit={() => b.submit()}
            />
          </div>
          <div aria-hidden className="seam seam-animated pointer-events-none absolute inset-y-6 left-1/2 hidden w-px opacity-60 lg:block" />
          <div className={cn("min-w-0 flex-1", mobileTab !== "opponent" && "max-lg:hidden")}>
            <OpponentPanel opp={b.opp} opponent={config.opponent} problem={config.problem} active={!youActive} />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {b.phase === "intro" && (
          <BattleIntro me={me} opponent={config.opponent} problem={config.problem} durationMin={config.durationMin} onDone={b.begin} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {b.phase === "judging" && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative grid size-20 place-items-center">
                <span className="absolute inset-0 rounded-full border border-lime animate-scan" />
                <span className="absolute inset-0 rounded-full border border-lime animate-scan [animation-delay:0.8s]" />
                <BrainCircuit className="size-7 text-lime" />
              </div>
              <p className="text-lg font-semibold">Comparing solutions</p>
              <p className="text-[13px] text-muted">Tallying tests, runtime, memory and submit time…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {b.phase === "result" && b.verdict && (
        <BattleResult
          me={me}
          opponent={config.opponent}
          you={b.you.result}
          them={b.opp.result}
          verdict={b.verdict}
          delta={config.mode === "ranked" ? b.delta : 0}
          ai={b.ai}
          onRematch={rematch}
        />
      )}
    </div>
  );
}

export function ArenaSkeleton() {
  return (
    <div className="flex h-dvh flex-col bg-ink">
      <div className="h-14 border-b border-line" />
      <div className="h-[62px] border-b border-line bg-surface" />
      <div className="flex flex-1 gap-2 p-2">
        <div className="skeleton hidden w-[380px] rounded-[14px] lg:block" />
        <div className="skeleton flex-1 rounded-[14px]" />
        <div className="skeleton hidden flex-1 rounded-[14px] lg:block" />
      </div>
    </div>
  );
}
