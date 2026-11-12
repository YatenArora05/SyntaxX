"use client";

import { motion } from "motion/react";
import { Search, Swords, Code2, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    icon: Search,
    title: "Find an Opponent",
    body: "Queue for a quick match or a ranked game. We pair you with someone within your rating band, usually in under ten seconds.",
    chip: "Matched in 4.2s",
  },
  {
    icon: Swords,
    title: "Enter the Arena",
    body: "Both editors open side by side with the same problem, the same clock and the same hidden tests.",
    chip: "15:00 on the clock",
  },
  {
    icon: Code2,
    title: "Solve the Challenge",
    body: "Write, run against the samples, and watch your opponent's progress in real time while you work.",
    chip: "9/9 tests passing",
  },
  {
    icon: Trophy,
    title: "Win the Battle",
    body: "Execution decides the winner: tests passed, runtime, memory and submit time. The AI judge explains the result.",
    chip: "+18 rating",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1240px] scroll-mt-20 px-4 py-28 sm:px-6">
      <SectionHeading
        title="From queue to victory in four moves."
        description="No setup, no installs. Open the arena in your browser and the battle starts the moment both players are in."
      />
      <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        <div aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-lime/60 via-line-strong to-transparent md:block" />
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-3">
              <span className="relative grid size-11 place-items-center rounded-full border border-line-strong bg-ink text-fg">
                <s.icon className="size-[18px]" />
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-lime font-mono text-[10px] font-bold text-ink">
                  {i + 1}
                </span>
              </span>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.body}</p>
            <span className="mt-5 inline-flex rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[12px] text-fg/80">
              {s.chip}
            </span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
