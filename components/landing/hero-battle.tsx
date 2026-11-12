"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cpu, MemoryStick, RotateCcw, Timer, Trophy, Wifi } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LiveDot } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CodeView } from "@/components/shared/code-view";
import { cn, formatClock } from "@/lib/utils";

const LEFT = `function longestUniqueRun(s) {
  const last = new Map();
  let best = 0, left = 0;
  for (let r = 0; r < s.length; r++) {
    if (last.get(s[r]) >= left) {
      left = last.get(s[r]) + 1;
    }
    last.set(s[r], r);
    best = Math.max(best, r - left + 1);
  }
  return best;
}`;

const RIGHT = `class Solution:
    def longestUniqueRun(self, s):
        seen = {}
        best = start = 0
        for i, ch in enumerate(s):
            if seen.get(ch, -1) >= start:
                start = seen[ch] + 1
            seen[ch] = i
            best = max(best, i - start + 1)
        return best`;

const TOTAL_TESTS = 9;

interface Side {
  name: string;
  rating: number;
  country: string;
  lang: string;
  file: string;
  script: string;
  cps: number;
  runtime: string;
  memory: string;
}

const players: [Side, Side] = [
  { name: "heapqueen", rating: 2874, country: "KR", lang: "JavaScript", file: "solution.js", script: LEFT, cps: 22, runtime: "1.84 ms", memory: "41.2 MB" },
  { name: "o1_hiro", rating: 2811, country: "JP", lang: "Python 3", file: "solution.py", script: RIGHT, cps: 18, runtime: "3.10 ms", memory: "16.8 MB" },
];

export function HeroBattle() {
  const reduce = useReducedMotion();
  const [anim, setAnim] = useState<{ typed: [number, number]; clock: number; done: boolean }>({ typed: [0, 0], clock: 15 * 60, done: false });
  const [focus, setFocus] = useState<0 | 1 | null>(null);
  const [round, setRound] = useState(0);
  const frame = useRef<HTMLDivElement>(null);

  // Reduced motion: show the finished state without animating.
  const typed: [number, number] = reduce ? [LEFT.length, RIGHT.length] : anim.typed;
  const clock = anim.clock;
  const done = reduce ? true : anim.done;

  const replay = () => {
    setAnim({ typed: [0, 0], clock: 15 * 60, done: false });
    setRound((r) => r + 1);
  };

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const acc: [number, number] = [0, 0];
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      // humans type in bursts: modulate speed with a slow wave per player
      acc[0] += dt * players[0].cps * (0.6 + Math.abs(Math.sin(now / 900)));
      acc[1] += dt * players[1].cps * (0.6 + Math.abs(Math.cos(now / 1100)));
      const next: [number, number] = [Math.min(LEFT.length, acc[0]), Math.min(RIGHT.length, acc[1])];
      const finished = next[0] >= LEFT.length && next[1] >= RIGHT.length;
      setAnim((a) => ({ typed: [Math.floor(next[0]), Math.floor(next[1])], clock: Math.max(0, a.clock - dt * 7), done: a.done }));
      if (finished) {
        timer = setTimeout(() => setAnim((a) => ({ ...a, done: true })), 500);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [reduce, round]);

  useEffect(() => {
    if (!anim.done || reduce) return;
    const t = setTimeout(replay, 5200);
    return () => clearTimeout(t);
  }, [anim.done, reduce]);

  const progress = [typed[0] / LEFT.length, typed[1] / RIGHT.length];
  const tests = progress.map((p) => (p < 0.55 ? 0 : p < 0.85 ? 2 : p < 1 ? 6 : TOTAL_TESTS));
  const leader = progress[0] >= progress[1] ? 0 : 1;
  const highlighted = focus ?? leader;

  const onMove = (e: React.PointerEvent) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={frame}
      onPointerMove={onMove}
      className="group/frame relative overflow-hidden rounded-[20px] border border-line-strong bg-surface/90 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] backdrop-blur"
    >
      {/* cursor-following glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/frame:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgb(183 247 0 / 0.06), transparent 60%)" }}
      />

      {/* arena top bar */}
      <div className="relative flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3 text-[12.5px] text-muted">
          <span className="font-mono text-fg/80">BTL-7Q2K</span>
          <span className="hidden truncate sm:inline">Longest Unique Run</span>
          <span className="hidden rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-fg/80 md:inline">Medium</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-soft px-2 py-0.5 text-[11px] font-semibold text-lime">
            <LiveDot className="size-1.5" /> Live
          </span>
          <span className="font-mono text-[18px] font-semibold tabular tracking-tight" aria-label="Time remaining">
            {formatClock(clock)}
          </span>
        </div>
        <div className="hidden items-center gap-1.5 text-[12px] text-muted sm:flex">
          <Wifi className="size-3.5 text-lime" /> 18 ms
        </div>
      </div>

      {/* editors */}
      <div className="relative grid grid-cols-1 md:grid-cols-2">
        <div aria-hidden className="seam seam-animated absolute inset-y-0 left-1/2 hidden w-px md:block" />
        {players.map((p, i) => {
          const active = highlighted === i;
          const finished = progress[i]! >= 1;
          return (
            <div
              key={p.name}
              onPointerEnter={() => setFocus(i as 0 | 1)}
              onPointerLeave={() => setFocus(null)}
              className={cn("relative p-3 sm:p-4", i === 1 && "max-md:hidden")}
            >
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-[14px] border bg-ink/70 transition-[box-shadow,border-color,opacity] duration-500",
                  active ? "border-lime/50 shadow-glow" : "border-line opacity-80",
                )}
              >
                {/* player strip */}
                <div className={cn("flex items-center gap-3 border-b border-line px-3.5 py-3", i === 1 && "flex-row-reverse text-right")}>
                  <Avatar name={p.name} size={34} ring={active} />
                  <div className="min-w-0 flex-1">
                    <div className={cn("flex items-center gap-2", i === 1 && "justify-end")}>
                      <span className="text-[11px] font-medium text-muted">Player 0{i + 1}</span>
                      <span className="font-mono text-[11px] text-muted/80">{p.country}</span>
                    </div>
                    <div className="truncate text-[14px] font-semibold tracking-tight">
                      {p.name} <span className="font-mono text-[12px] font-normal text-lime">{p.rating}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "hidden shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] sm:inline-flex",
                      finished ? "border-lime-line text-lime" : "border-line-strong text-muted",
                    )}
                  >
                    {finished ? "Submitted" : (
                      <>
                        typing
                        <span className="flex gap-0.5">
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="size-1 animate-pulse rounded-full bg-current" style={{ animationDelay: `${d * 150}ms` }} />
                          ))}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {/* file tab */}
                <div className="flex items-center justify-between border-b border-line px-3.5 py-1.5 text-[11.5px]">
                  <span className="font-mono text-fg/80">{p.file}</span>
                  <span className="text-muted">{p.lang}</span>
                </div>

                {/* code */}
                <div className="h-[268px] overflow-hidden px-1 py-3">
                  <CodeView code={p.script.slice(0, typed[i])} caret={!finished} minLines={12} />
                </div>

                {/* stats */}
                <div className="mt-auto space-y-2.5 border-t border-line px-3.5 py-3">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="text-muted">Test cases</span>
                    <span className="font-mono tabular text-fg">
                      <span className={tests[i] === TOTAL_TESTS ? "text-lime" : ""}>{tests[i]}</span>/{TOTAL_TESTS}
                    </span>
                  </div>
                  <Progress value={(tests[i]! / TOTAL_TESTS) * 100} label={`${p.name} tests passed`} />
                  <div className="flex items-center gap-4 pt-0.5 font-mono text-[11.5px] text-muted tabular">
                    <span className="inline-flex items-center gap-1.5"><Cpu className="size-3" />{finished ? p.runtime : "—"}</span>
                    <span className="inline-flex items-center gap-1.5"><MemoryStick className="size-3" />{finished ? p.memory : "—"}</span>
                    <span className="ml-auto inline-flex items-center gap-1.5"><Timer className="size-3" />{Math.round(progress[i]! * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* VS badge */}
        <div className="pointer-events-none absolute left-1/2 top-[38px] z-10 hidden -translate-x-1/2 md:block">
          <motion.div
            key={round}
            initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.2 }}
            className="grid size-11 place-items-center rounded-full border border-lime/60 bg-ink text-[13px] font-black italic tracking-tight text-lime shadow-glow-sm"
          >
            VS
          </motion.div>
        </div>

        {/* result overlay */}
        <AnimatePresence>
          {done && !reduce && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 grid place-items-center bg-ink/70 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ y: 16, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                className="flex flex-col items-center gap-3 rounded-[16px] border border-lime/40 bg-surface px-7 py-5 text-center shadow-glow"
              >
                <Trophy className="size-6 text-lime" />
                <div className="text-[13px] text-muted">Winner · 9/9 tests · 1.84 ms</div>
                <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
                  <Avatar name={players[0].name} size={28} ring /> {players[0].name}
                </div>
                <button
                  onClick={replay}
                  className="pointer-events-auto mt-1 inline-flex items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-lime cursor-pointer"
                >
                  <RotateCcw className="size-3" /> Replay battle
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
