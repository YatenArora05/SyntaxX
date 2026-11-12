"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LiveDot } from "@/components/ui/badge";
import { Counter } from "@/components/shared/counter";
import { HeroBattle } from "./hero-battle";
import { platformStats } from "@/lib/mock-data/players";

const words = ["CODE.", "COMPETE.", "CONQUER."];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-12 sm:pt-14">
      {/* grid backdrop, faded at the edges */}
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10" />
      {/* the seam that runs from the headline into the arena's VS badge */}
      <div aria-hidden className="seam absolute left-1/2 top-0 -z-10 hidden h-[56%] w-px opacity-40 md:block" />

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.a
            href="#modes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/80 py-1.5 pl-3 pr-3.5 text-[13px] text-muted backdrop-blur transition-colors hover:border-lime-line hover:text-fg"
          >
            <LiveDot />
            <span>
              <Counter value={platformStats.online} className="font-mono text-fg tabular" /> Developers Online
            </span>
          </motion.a>

          <h1 className="mt-6 text-[clamp(44px,8vw,100px)] font-extrabold leading-[0.9] tracking-[-0.055em]">
            {words.map((w, i) => (
              <motion.span
                key={w}
                className="inline-block pr-[0.22em] last:pr-0"
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.08 + i * 0.12, type: "spring", stiffness: 200, damping: 22 }}
              >
                {w}
              </motion.span>
            ))}
            <span aria-hidden className="ml-[0.06em] inline-block h-[0.78em] w-[0.12em] translate-y-[0.06em] bg-lime animate-caret" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-7 max-w-xl text-[clamp(16px,1.6vw,19px)] leading-relaxed text-muted"
          >
            Challenge developers worldwide. Solve problems in real time. Let your code decide who wins.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/find-battle">Start a Battle →</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#modes">Explore Battles</a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 70, damping: 18 }}
          className="relative mt-12 sm:mt-14"
        >
          <div aria-hidden className="absolute -inset-x-10 -top-10 bottom-1/2 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(183_247_0/0.09),transparent_65%)]" />
          <HeroBattle />
        </motion.div>
      </div>
    </section>
  );
}
