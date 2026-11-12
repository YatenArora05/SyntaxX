"use client";

import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 32 }}>
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "!bg-card !border !border-line-strong !text-fg !rounded-[12px] !font-sans",
              description: "!text-muted",
              actionButton: "!bg-lime !text-ink",
              icon: "!text-lime",
            },
          }}
        />
      </TooltipProvider>
    </MotionConfig>
  );
}
