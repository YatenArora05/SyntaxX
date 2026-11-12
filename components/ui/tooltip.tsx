"use client";

import { Tooltip as T } from "radix-ui";
import { cn } from "@/lib/utils";

export const TooltipProvider = T.Provider;

export function Tooltip({
  content,
  children,
  side = "top",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <T.Root>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-50 rounded-md border border-line-strong bg-card px-2.5 py-1.5 text-[12px] text-fg shadow-xl",
            "data-[state=delayed-open]:animate-in",
          )}
        >
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}
