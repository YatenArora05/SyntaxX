"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { AiEvaluation, Language, Player, Problem, RunResult } from "@/types";
import { judge } from "@/lib/services/judge";
import { connectBattle } from "@/lib/services/socket";
import { decideWinner, ratingChange } from "@/lib/services/scoring";
import { aiJudge } from "@/lib/services/ai";
import { opponentSolutions } from "@/lib/mock-data/problems";

export type Phase = "intro" | "live" | "judging" | "result";
export type ConnStatus = "waiting" | "connected" | "reconnecting" | "disconnected";

export interface YouState {
  language: Language;
  code: string;
  running: boolean;
  submitting: boolean;
  lastRun?: RunResult;
  result?: RunResult;
}

export interface OpponentState {
  code: string;
  language: Language;
  typing: boolean;
  status: ConnStatus;
  running: boolean;
  lastRun?: RunResult;
  result?: RunResult;
  keystrokes: number;
}

export function useBattle(opts: {
  battleId: string;
  problem: Problem;
  me: Player;
  opponent: Player;
  durationSec: number;
  initialLanguage: Language;
}) {
  const { battleId, problem, opponent, durationSec, me } = opts;
  const [phase, setPhase] = useState<Phase>("intro");
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number | null>(null);

  const drafts = useRef<Partial<Record<Language, string>>>({});
  const [you, setYou] = useState<YouState>({
    language: opts.initialLanguage,
    code: problem.starter[opts.initialLanguage],
    running: false,
    submitting: false,
  });
  const [opp, setOpp] = useState<OpponentState>({
    code: "",
    language: "javascript",
    typing: false,
    status: "waiting",
    running: false,
    keystrokes: 0,
  });
  const [ai, setAi] = useState<AiEvaluation | null>(null);

  // Latest values for async callbacks (judge results, socket events, timers).
  const youRef = useRef(you);
  const oppRef = useRef(opp);
  const elapsedRef = useRef(0);
  useEffect(() => {
    youRef.current = you;
    oppRef.current = opp;
    elapsedRef.current = elapsed;
  });

  /** Moves a live battle into judging; safe to call from any callback. */
  const finish = useCallback(() => setPhase((p) => (p === "live" ? "judging" : p)), []);
  const submitRef = useRef<(auto?: boolean) => Promise<void>>(async () => {});

  /* ------------------------------------------------------------ clock */
  const begin = useCallback(() => {
    startedAt.current = Date.now();
    setPhase("live");
  }, []);

  useEffect(() => {
    if (phase !== "live") return;
    const id = setInterval(() => {
      if (!startedAt.current) return;
      const e = Math.min(durationSec, (Date.now() - startedAt.current) / 1000);
      elapsedRef.current = e;
      setElapsed(e);
      if (e >= durationSec) {
        const y = youRef.current;
        if (y.result) finish();
        else if (!y.submitting) void submitRef.current(true);
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase, durationSec, finish]);

  const remaining = Math.max(0, durationSec - elapsed);

  /* ------------------------------------------------------------ opponent channel */
  useEffect(() => {
    if (phase !== "live") return;
    const channel = connectBattle({
      battleId,
      opponentScript: opponentSolutions[problem.id] ?? "",
      language: "javascript",
      pace: { thinkSec: 10, cps: problem.difficulty === "Hard" ? 2.4 : 3 },
    });
    const offs = [
      channel.on("opponent:connected", () => setOpp((o) => ({ ...o, status: "connected" }))),
      channel.on("opponent:status", ({ status }) => setOpp((o) => ({ ...o, status }))),
      channel.on("opponent:typing", ({ typing }) => setOpp((o) => ({ ...o, typing }))),
      channel.on("opponent:code", ({ code, language }) =>
        setOpp((o) => ({ ...o, code, language, keystrokes: o.keystrokes + 1 })),
      ),
      channel.on("opponent:run", async ({ code }) => {
        setOpp((o) => ({ ...o, running: true }));
        const r = await judge(code, problem, "run", "javascript");
        setOpp((o) => ({ ...o, running: false, lastRun: r }));
      }),
      channel.on("opponent:submit", async ({ code, atSec }) => {
        setOpp((o) => ({ ...o, running: true, code }));
        const r = await judge(code, problem, "submit", "javascript");
        r.submittedAtSec = atSec;
        setOpp((o) => ({ ...o, running: false, result: r, typing: false }));
        oppRef.current = { ...oppRef.current, result: r };
        if (youRef.current.result) finish();
        toast(`${opponent.username} submitted`, {
          description: `${r.passed}/${r.total} tests passed · ${r.runtimeMs} ms`,
        });
      }),
    ];
    return () => {
      offs.forEach((off) => off());
      channel.disconnect();
    };
  }, [phase === "live", battleId, problem, opponent.username]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------------------------------------ your actions */
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const setCode = useCallback((code: string) => {
    setYou((y) => ({ ...y, code }));
    setTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 1500);
  }, []);
  useEffect(() => () => clearTimeout(typingTimer.current), []);
  const youTyping = phase === "live" && !you.result && typing;

  const setLanguage = useCallback(
    (language: Language) => {
      setYou((y) => {
        drafts.current[y.language] = y.code;
        return { ...y, language, code: drafts.current[language] ?? problem.starter[language] };
      });
    },
    [problem],
  );

  const resetCode = useCallback(() => {
    setYou((y) => ({ ...y, code: problem.starter[y.language] }));
    toast("Code reset to the starter template");
  }, [problem]);

  const run = useCallback(async () => {
    const y = youRef.current;
    if (y.running || y.submitting || y.result || phase !== "live") return;
    setYou((s) => ({ ...s, running: true }));
    const r = await judge(y.code, problem, "run", y.language);
    setYou((s) => ({ ...s, running: false, lastRun: r }));
  }, [problem, phase]);

  const submit = useCallback(
    async (auto = false) => {
      const y = youRef.current;
      if (y.submitting || y.result) return;
      setYou((s) => ({ ...s, submitting: true }));
      const r = await judge(y.code, problem, "submit", y.language);
      r.submittedAtSec = Math.round(elapsedRef.current);
      setYou((s) => ({ ...s, submitting: false, result: r, lastRun: r }));
      youRef.current = { ...youRef.current, result: r };
      if (oppRef.current.result || elapsedRef.current >= durationSec) finish();
      if (auto) toast("Time's up", { description: "Your current code was submitted automatically." });
      else
        toast(r.verdict === "Accepted" ? "Solution accepted" : r.verdict, {
          description: `${r.passed}/${r.total} tests passed${r.executed ? ` · ${r.runtimeMs} ms` : " · simulated judge"}`,
        });
    },
    [problem, durationSec, finish],
  );
  useEffect(() => {
    submitRef.current = submit;
  }, [submit]);

  /* ------------------------------------------------------------ end of battle */

  useEffect(() => {
    if (phase !== "judging") return;
    const t = setTimeout(() => setPhase("result"), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "judging") return;
    let alive = true;
    aiJudge({
      yourCode: youRef.current.code,
      opponentCode: opp.code,
      you: youRef.current.result,
      opponent: opp.result,
      functionName: problem.functionName,
      opponentName: opponent.username,
    }).then((e) => alive && setAi(e));
    return () => {
      alive = false;
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const verdict = useMemo(
    () => (phase === "result" || phase === "judging" ? decideWinner(you.result, opp.result, durationSec) : null),
    [phase, you.result, opp.result, durationSec],
  );
  const delta = verdict ? ratingChange(verdict.winner, me.rating, opponent.rating) : 0;

  /** Progress estimate for the opponent's code, used by the live momentum bar. */
  const opponentProgress = useMemo(() => {
    const script = opponentSolutions[problem.id] ?? "";
    if (opp.result) return opp.result.passed / opp.result.total;
    return script.length ? Math.min(0.85, (opp.code.length / script.length) * 0.85) : 0;
  }, [opp.code, opp.result, problem.id]);

  const yourProgress = useMemo(() => {
    if (you.result) return you.result.passed / you.result.total;
    if (you.lastRun) return Math.min(0.85, (you.lastRun.passed / Math.max(1, you.lastRun.total)) * 0.6 + 0.2);
    const typed = you.code.length - problem.starter[you.language].length;
    return Math.max(0, Math.min(0.5, typed / 600));
  }, [you, problem]);

  return {
    phase,
    begin,
    elapsed,
    remaining,
    you,
    opp,
    ai,
    verdict,
    delta,
    setCode,
    setLanguage,
    resetCode,
    run,
    submit,
    yourProgress,
    opponentProgress,
    youTyping,
  };
}
