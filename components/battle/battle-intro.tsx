"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Player, Problem } from "@/types";

/** The VS transition: players slam in from both sides, then a 3-2-1 count. */
export function BattleIntro({ me, opponent, problem, durationMin, onDone }: { me: Player; opponent: Player; problem: Problem; durationMin: number; onDone: () => void }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setCount(3), 1500);
    const t1 = setTimeout(() => setCount(2), 2300);
    const t2 = setTimeout(() => setCount(1), 3100);
    const t3 = setTimeout(() => setCount(0), 3900);
    const t4 = setTimeout(onDone, 4500);
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  const side = (p: Player, dir: -1 | 1, label: string) => (
    <motion.div
      initial={{ x: dir * 280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
      className={`flex min-w-0 flex-col items-center gap-3 ${dir === 1 ? "sm:items-start" : "sm:items-end"}`}
    >
      <div className="max-sm:scale-[0.7]"><Avatar name={p.username} size={84} ring={dir === -1} /></div>
      <div className={`text-center ${dir === 1 ? "sm:text-left" : "sm:text-right"}`}>
        <div className="text-[12px] text-muted">{label}</div>
        <div className="truncate text-base font-bold tracking-tight sm:text-3xl">{p.username}</div>
        <div className="mt-1 font-mono text-[11px] text-muted sm:text-[13px]">
          <span className="text-lime">{p.rating}</span><span className="max-sm:hidden"> · {p.tier} · {p.country.name}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-ink"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.35 }}
    >
      <div aria-hidden className="bg-grid mask-radial absolute inset-0" />
      <motion.div
        aria-hidden
        className="seam seam-animated absolute inset-y-0 left-1/2 w-px"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6 }}
      />
      <div className="relative grid w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:gap-10 sm:px-6">
        {side(me, -1, "You")}
        <motion.div
          initial={{ scale: 3, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 }}
          className="mx-auto grid size-14 place-items-center rounded-full border-2 border-lime bg-ink text-xl font-black italic text-lime shadow-glow sm:size-24 sm:text-3xl"
        >
          VS
        </motion.div>
        {side(opponent, 1, "Opponent")}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-[14%] flex flex-col items-center gap-3 bg-ink px-8 py-4 text-center"
      >
        <div className="flex items-center gap-2">
          <Badge variant="lime">{problem.difficulty}</Badge>
          <Badge>{durationMin} minutes</Badge>
        </div>
        <div className="text-lg font-semibold">{problem.title}</div>
        <div className="h-16">
          <AnimatePresence mode="popLayout">
            {count !== null && (
              <motion.div
                key={count}
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="font-mono text-5xl font-bold text-lime"
              >
                {count === 0 ? "GO" : count}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={onDone} className="text-[12px] text-muted hover:text-fg cursor-pointer">Skip intro</button>
      </motion.div>
    </motion.div>
  );
}
