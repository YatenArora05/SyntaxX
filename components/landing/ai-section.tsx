"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { CodeView } from "@/components/shared/code-view";
import { cn } from "@/lib/utils";

const dims = [
  {
    key: "time",
    label: "Time Complexity",
    a: "O(n)",
    b: "O(n²)",
    note: "Solution A walks the terrace once with two pointers. Solution B rescans left and right for every bar — at 20,000 bars that's 400 million comparisons.",
  },
  {
    key: "space",
    label: "Space Complexity",
    a: "O(1)",
    b: "O(1)",
    note: "Both keep only a handful of counters. Neither allocates arrays proportional to the input, so memory is a tie.",
  },
  {
    key: "quality",
    label: "Code Quality",
    a: "8/10",
    b: "6/10",
    note: "A names its pointers and maxima clearly. B's single-letter loop variables inside nested loops make the invariant harder to verify.",
  },
  {
    key: "opt",
    label: "Optimization Opportunities",
    a: "None left",
    b: "Precompute maxima",
    note: "B can drop to O(n) by computing prefix and suffix maxima once, or go further with the two-pointer trick A uses.",
  },
  {
    key: "algo",
    label: "Algorithmic Efficiency",
    a: "Two pointers",
    b: "Brute force",
    note: "A moves whichever side has the lower wall, because that side's water level is already decided. It's the optimal approach.",
  },
];

const A = `let l = 0, r = h.length - 1;
let lMax = 0, rMax = 0, water = 0;
while (l < r) {
  if (h[l] < h[r]) {
    lMax = Math.max(lMax, h[l]);
    water += lMax - h[l++];
  } else {
    rMax = Math.max(rMax, h[r]);
    water += rMax - h[r--];
  }
}`;

const B = `let water = 0;
for (let i = 1; i < h.length - 1; i++) {
  let a = 0, b = 0;
  for (let j = i; j >= 0; j--)
    a = Math.max(a, h[j]);
  for (let j = i; j < h.length; j++)
    b = Math.max(b, h[j]);
  water += Math.min(a, b) - h[i];
}`;

export function AiSection() {
  const [active, setActive] = useState(0);
  const d = dims[active]!;
  return (
    <section id="ai-arena" className="relative scroll-mt-20 border-y border-line bg-surface/50 py-28">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 className="text-[clamp(32px,4.6vw,54px)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            YOUR AI JUDGE.
            <br />
            YOUR COMPETITIVE EDGE.
          </h2>
          <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-muted">
            Winners are decided by running your code, never by a model&apos;s opinion. The AI judge reads both solutions afterwards and explains what separated them.
          </p>
          <ul className="mt-10 space-y-1" role="tablist" aria-label="AI analysis dimensions">
            {dims.map((x, i) => (
              <li key={x.key}>
                <button
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[10px] px-4 py-3 text-left text-[15px] transition-colors cursor-pointer",
                    active === i ? "bg-card text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn("h-4 w-[2px] rounded-full transition-colors", active === i ? "bg-lime" : "bg-line-strong")} />
                    {x.label}
                  </span>
                  <span className="font-mono text-[12.5px] tabular">
                    <span className={active === i ? "text-lime" : ""}>{x.a}</span>
                    <span className="text-muted/50"> vs </span>
                    {x.b}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[20px] border border-line-strong bg-ink p-2">
          <div className="flex items-center justify-between px-4 py-3 text-[13px]">
            <span className="flex items-center gap-2 font-medium"><Sparkles className="size-4 text-lime" /> Judge report · Rain Over Terraces</span>
            <span className="font-mono text-[12px] text-muted">BTL-4KZ9</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { name: "Solution A · lambda_lena", code: A, winner: true, val: d.a },
              { name: "Solution B · greedy_gus", code: B, winner: false, val: d.b },
            ].map((s) => (
              <div key={s.name} className={cn("rounded-[14px] border bg-surface p-3", s.winner ? "border-lime/40" : "border-line")}>
                <div className="mb-2 flex items-center justify-between px-1 text-[12px]">
                  <span className="text-muted">{s.name}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={s.val}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className={cn("rounded-md px-2 py-0.5 font-mono text-[12px]", s.winner ? "bg-lime text-ink font-semibold" : "bg-white/[0.07] text-fg")}
                    >
                      {s.val}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="overflow-x-auto">
                  <CodeView code={s.code} className="text-[11.5px]" minLines={11} />
                </div>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={d.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="m-2 rounded-[12px] border border-line bg-card px-4 py-3.5 text-[14px] leading-relaxed text-fg/85"
            >
              <span className="font-semibold text-fg">{d.label}: </span>
              {d.note}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
