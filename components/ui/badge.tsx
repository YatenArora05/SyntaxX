import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium leading-5 whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-line-strong bg-white/[0.04] text-muted",
        lime: "border-lime-line bg-lime-soft text-lime",
        solid: "border-transparent bg-lime text-ink font-semibold",
        outline: "border-line-strong text-fg",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Pulsing dot for anything that is live right now. */
export function LiveDot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 rounded-full bg-lime animate-live", className)} />;
}
