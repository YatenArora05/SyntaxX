"use client";

import { Switch as S } from "radix-ui";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof S.Root>) {
  return (
    <S.Root
      className={cn(
        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-line-strong bg-white/[0.06] transition-colors data-[state=checked]:border-lime data-[state=checked]:bg-lime",
        className,
      )}
      {...props}
    >
      <S.Thumb className="block size-[18px] translate-x-[2px] rounded-full bg-fg shadow transition-transform data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-ink" />
    </S.Root>
  );
}
