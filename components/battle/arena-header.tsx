"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Copy, DoorOpen, Keyboard, PanelLeftClose, PanelLeftOpen, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { LiveDot } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, formatClock } from "@/lib/utils";
import type { Phase } from "@/hooks/use-battle";

export function ArenaHeader({
  battleId,
  phase,
  remaining,
  duration,
  problemOpen,
  onToggleProblem,
  ranked,
}: {
  battleId: string;
  phase: Phase;
  remaining: number;
  duration: number;
  problemOpen: boolean;
  onToggleProblem: () => void;
  ranked: boolean;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const urgent = remaining <= 60 && phase === "live";
  const live = phase === "live";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(battleId);
    } catch {
      /* clipboard can be blocked; still confirm visually */
    }
    setCopied(true);
    toast("Battle ID copied", { description: battleId });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-ink px-3 sm:px-4">
      <Logo href="/dashboard" compact />
      <div className="hidden h-5 w-px bg-line-strong sm:block" />
      <Tooltip content={problemOpen ? "Hide problem (Ctrl+B)" : "Show problem (Ctrl+B)"}>
        <Button variant="ghost" size="icon-sm" onClick={onToggleProblem} aria-label="Toggle problem panel" className="hidden lg:inline-flex">
          {problemOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </Tooltip>
      <button
        onClick={copy}
        className="hidden items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[12.5px] text-muted transition-colors hover:bg-white/[0.05] hover:text-fg sm:inline-flex cursor-pointer"
        aria-label={`Copy battle ID ${battleId}`}
      >
        {battleId}
        {copied ? <Check className="size-3 text-lime" /> : <Copy className="size-3" />}
      </button>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
          live ? "bg-lime-soft text-lime" : "bg-white/[0.06] text-muted",
        )}
      >
        {live ? <LiveDot className="size-1.5" /> : <span className="size-1.5 rounded-full bg-muted" />}
        {phase === "intro" ? "Starting" : live ? "Live" : phase === "judging" ? "Judging" : "Finished"}
      </span>
      {ranked && <span className="hidden rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-fg/80 md:inline">Ranked</span>}

      {/* countdown */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <motion.span
          key={urgent ? "u" : "n"}
          animate={urgent ? { scale: [1, 1.06, 1] } : {}}
          transition={urgent ? { repeat: Infinity, duration: 1 } : {}}
          className={cn("font-mono text-[22px] font-semibold leading-none tracking-tight tabular", urgent && "text-lime")}
          role="timer"
          aria-label={`${Math.ceil(remaining)} seconds remaining`}
        >
          {formatClock(Math.ceil(remaining))}
        </motion.span>
        <div className="mt-1.5 h-[2px] w-24 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full bg-lime transition-[width] duration-300" style={{ width: `${(remaining / duration) * 100}%` }} />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden items-center gap-1.5 text-[12px] text-muted md:inline-flex">
          <Wifi className="size-3.5 text-lime" /> 21 ms
        </span>
        <Tooltip
          content={
            <div className="space-y-1 font-mono text-[11.5px]">
              <div>Ctrl/⌘ + Enter — run samples</div>
              <div>Ctrl/⌘ + Shift + Enter — submit</div>
              <div>Ctrl/⌘ + B — toggle problem</div>
            </div>
          }
        >
          <Button variant="ghost" size="icon-sm" aria-label="Keyboard shortcuts" className="hidden md:inline-flex">
            <Keyboard />
          </Button>
        </Tooltip>
        <Button variant="outline" size="sm" onClick={() => (phase === "result" ? router.push("/dashboard") : setConfirm(true))}>
          <DoorOpen /> <span className="hidden sm:inline">Exit Battle</span>
        </Button>
      </div>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Leave this battle?"
        description={
          ranked
            ? "The battle is still live. Leaving now counts as a forfeit and your opponent wins the rating points."
            : "The battle is still live. Your progress in this battle will be lost."
        }
        confirmLabel="Leave battle"
        cancelLabel="Keep fighting"
        onConfirm={() => {
          toast("You left the battle");
          router.push("/dashboard");
        }}
      />
    </header>
  );
}
