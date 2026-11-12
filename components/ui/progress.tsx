"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]", className)}
    >
      <motion.div
        className={cn("h-full rounded-full bg-lime", barClassName)}
        initial={false}
        animate={{ width: `${v}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />
    </div>
  );
}
