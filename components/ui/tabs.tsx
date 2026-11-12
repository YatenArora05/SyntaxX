"use client";

import { Tabs as T } from "radix-ui";
import { cn } from "@/lib/utils";

export const Tabs = T.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof T.List>) {
  return (
    <T.List
      className={cn("inline-flex items-center gap-1 rounded-[12px] border border-line bg-surface p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-3 text-[13px] font-medium text-muted transition-colors cursor-pointer",
        "hover:text-fg data-[state=active]:bg-white/[0.08] data-[state=active]:text-fg [&_svg]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = T.Content;
