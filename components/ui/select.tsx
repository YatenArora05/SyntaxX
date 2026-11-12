"use client";

import { Select as S } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  className,
  size = "md",
  ariaLabel,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: SelectOption[];
  className?: string;
  size?: "sm" | "md";
  ariaLabel?: string;
}) {
  return (
    <S.Root value={value} onValueChange={onValueChange}>
      <S.Trigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-[var(--radius-control)] border border-line-strong bg-surface text-fg transition-colors hover:border-white/25 cursor-pointer data-[state=open]:border-lime-line",
          size === "sm" ? "h-8 px-2.5 text-[12px]" : "h-10 px-3 text-sm",
          className,
        )}
      >
        <S.Value />
        <S.Icon>
          <ChevronDown className="size-3.5 text-muted" />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[12px] border border-line-strong bg-card p-1 shadow-2xl"
        >
          <S.Viewport>
            {options.map((o) => (
              <S.Item
                key={o.value}
                value={o.value}
                className="relative flex cursor-pointer select-none items-center justify-between gap-6 rounded-[8px] py-2 pl-2.5 pr-8 text-[13px] text-fg outline-none data-[highlighted]:bg-white/[0.07]"
              >
                <S.ItemText>{o.label}</S.ItemText>
                {o.hint && <span className="text-[11px] text-muted">{o.hint}</span>}
                <S.ItemIndicator className="absolute right-2.5">
                  <Check className="size-3.5 text-lime" />
                </S.ItemIndicator>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}
