"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Player, RunResult } from "@/types";
import type { ConnStatus } from "@/hooks/use-battle";
import { Particles } from "./particles";
import { cn } from "@/lib/utils";

function statusLabel(s: { typing: boolean; running: boolean; result?: RunResult; conn: ConnStatus }) {
  if (s.conn === "waiting") return { text: "Connecting…", spin: true };
  if (s.conn === "reconnecting") return { text: "Reconnecting…", spin: true };
  if (s.result) return { text: `Submitted · ${s.result.passed}/${s.result.total}`, lime: s.result.verdict === "Accepted" };
  if (s.running) return { text: "Running tests", spin: true };
  if (s.typing) return { text: "Typing", dots: true };
  return { text: "Thinking" };
}

function PlayerCard({
  player,
  side,
  label,
  conn,
  typing,
  running,
  result,
  tests,
}: {
  player: Player;
  side: "left" | "right";
  label: string;
  conn: ConnStatus;
  typing: boolean;
  running: boolean;
  result?: RunResult;
  tests: string;
}) {
  const s = statusLabel({ typing, running, result, conn });
  const right = side === "right";
  return (
    <div className={cn("flex min-w-0 items-center gap-3", right && "flex-row-reverse text-right")}>
      <Avatar name={player.username} size={36} ring={side === "left"} online={conn === "connected"} />
      <div className="min-w-0">
        <div className={cn("flex items-center gap-2 text-[11.5px] text-muted", right && "justify-end")}>
          <span>{label}</span>
          <span className="font-mono">{player.country.code}</span>
          <span className="hidden xl:inline">{player.country.name}</span>
        </div>
        <div className={cn("flex items-baseline gap-2", right && "flex-row-reverse")}>
          <span className="truncate text-[15px] font-semibold tracking-tight">{player.username}</span>
          <span className="font-mono text-[12.5px] text-lime tabular">{player.rating}</span>
        </div>
      </div>
      <div className={cn("hidden min-w-0 items-center gap-2 text-[12px] md:flex", right ? "mr-auto flex-row-reverse" : "ml-auto")}>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
            s.lime ? "border-lime-line bg-lime-soft text-lime" : "border-line-strong text-fg/80",
          )}
          aria-live="polite"
        >
          {s.spin && <Loader2 className="size-3 animate-spin" />}
          {s.text}
          {s.dots && (
            <span className="flex gap-0.5">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-1 animate-pulse rounded-full bg-current" style={{ animationDelay: `${d * 150}ms` }} />
              ))}
            </span>
          )}
        </span>
        <span className="font-mono text-muted tabular">{tests}</span>
      </div>
    </div>
  );
}

export function PlayerBar(props: {
  me: Player;
  opponent: Player;
  youTyping: boolean;
  youRunning: boolean;
  youResult?: RunResult;
  youTests: string;
  oppConn: ConnStatus;
  oppTyping: boolean;
  oppRunning: boolean;
  oppResult?: RunResult;
  oppTests: string;
  yourProgress: number;
  opponentProgress: number;
}) {
  // a small floor on both sides keeps the bar readable before anyone has progress
  const a = props.yourProgress + 0.08;
  const b = props.opponentProgress + 0.08;
  const share = (a / (a + b)) * 100;
  return (
    <div className="relative z-10 shrink-0 overflow-hidden border-b border-line bg-surface">
      <Particles count={22} />
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-2.5 sm:gap-6 sm:px-4">
        <PlayerCard
          player={props.me}
          side="left"
          label="You"
          conn="connected"
          typing={props.youTyping}
          running={props.youRunning}
          result={props.youResult}
          tests={props.youTests}
        />
        <div className="flex w-[72px] flex-col items-center gap-1.5 sm:w-[200px]">
          <span className="text-[13px] font-black italic tracking-tight text-lime">VS</span>
          <div className="relative flex h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]" role="img" aria-label={`Momentum: you ${Math.round(share)}%`}>
            <motion.div className="h-full bg-lime" animate={{ width: `${share}%` }} transition={{ type: "spring", stiffness: 80, damping: 20 }} />
            <motion.div className="h-full flex-1 bg-fg/70" />
            <span className="absolute inset-y-0 left-1/2 w-px bg-ink" aria-hidden />
          </div>
          <span className="text-[10.5px] text-muted">Momentum</span>
        </div>
        <PlayerCard
          player={props.opponent}
          side="right"
          label="Opponent"
          conn={props.oppConn}
          typing={props.oppTyping}
          running={props.oppRunning}
          result={props.oppResult}
          tests={props.oppTests}
        />
      </div>
    </div>
  );
}
