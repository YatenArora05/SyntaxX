"use client";

import { motion } from "motion/react";
import { Activity, BrainCircuit, Globe2, MessageSquareCode, Shield, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function LiveCursors() {
  return (
    <div className="relative mt-6 h-[150px] overflow-hidden rounded-[12px] border border-line bg-ink/80 p-4 font-mono text-[12px]">
      <div className="grid grid-cols-2 gap-6">
        {[
          { n: "you", lines: ["const seen = new Map();", "for (const [i, x] of", "  nums.entries()) {"], w: 0.8 },
          { n: "dp_dimitri", lines: ["seen = {}", "for i, x in enumerate(", "    nums):"], w: 0.55 },
        ].map((p, i) => (
          <div key={p.n} className="space-y-1.5">
            <div className="mb-3 flex items-center gap-2 text-[11px] text-muted">
              <Avatar name={p.n} size={18} /> {p.n}
            </div>
            {p.lines.map((l, j) => (
              <div key={j} className="truncate text-fg/70">
                {l}
                {j === p.lines.length - 1 && (
                  <motion.span
                    className={cn("ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5", i === 0 ? "bg-lime" : "bg-fg")}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div aria-hidden className="seam absolute bottom-0 left-1/2 top-0 w-px" />
    </div>
  );
}

function JudgeBars() {
  const rows = [
    ["Correctness", 100, 78],
    ["Runtime", 92, 61],
    ["Memory", 70, 84],
  ] as const;
  return (
    <div className="mt-6 space-y-3.5 rounded-[12px] border border-line bg-ink/80 p-4">
      {rows.map(([label, a, b]) => (
        <div key={label} className="grid grid-cols-[88px_1fr] items-center gap-3 text-[12px]">
          <span className="text-muted">{label}</span>
          <div className="space-y-1.5">
            <motion.div className="h-1.5 rounded-full bg-lime" initial={{ width: 0 }} whileInView={{ width: `${a}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
            <motion.div className="h-1.5 rounded-full bg-fg/30" initial={{ width: 0 }} whileInView={{ width: `${b}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const small = [
  { icon: Activity, title: "Live Performance Tracking", body: "Tests passed, runtime and memory update for both players the moment code is run." },
  { icon: Globe2, title: "Global Leaderboards", body: "Daily, weekly and all-time rankings, filterable by country and language." },
  { icon: Shield, title: "Ranked Battles", body: "Elo-based ratings with tight matchmaking bands, so every win is earned." },
  { icon: MessageSquareCode, title: "AI Coding Assistant", body: "Ask why you lost, explore alternative approaches and get targeted practice." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 pb-28 sm:px-6">
      <SectionHeading
        title="Built for the head-to-head."
        description="Everything in Dev Battle exists to make two people solving the same problem feel like a match worth watching."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-4">
        <article className="rounded-[18px] border border-line bg-card p-6 md:col-span-2">
          <Users className="size-5 text-lime" />
          <h3 className="mt-4 text-xl font-semibold tracking-tight">Real-Time Multiplayer Coding</h3>
          <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-muted">
            See your opponent&apos;s editor as they type. Keystrokes stream over WebSockets with under 50 ms of latency.
          </p>
          <LiveCursors />
        </article>
        <article className="rounded-[18px] border border-line bg-card p-6 md:col-span-2">
          <BrainCircuit className="size-5 text-lime" />
          <h3 className="mt-4 text-xl font-semibold tracking-tight">AI-Powered Code Evaluation</h3>
          <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-muted">
            Your code is executed and benchmarked to pick the winner. Then the AI reviews both solutions and tells you exactly why.
          </p>
          <JudgeBars />
        </article>
        {small.map((f) => (
          <article key={f.title} className="group rounded-[18px] border border-line bg-card p-6 transition-colors hover:border-line-strong">
            <f.icon className="size-5 text-fg/80 transition-colors group-hover:text-lime" />
            <h3 className="mt-4 text-[16px] font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
