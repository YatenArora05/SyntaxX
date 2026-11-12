import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-3.5 text-sm text-fg placeholder:text-muted/60 transition-[border-color,box-shadow] outline-none",
        "focus-visible:outline-none focus:border-lime-line focus:shadow-[0_0_0_3px_rgb(183_247_0/0.12)]",
        "aria-[invalid=true]:border-white/40 aria-[invalid=true]:shadow-[0_0_0_3px_rgb(255_255_255/0.06)]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-[var(--radius-control)] border border-line-strong bg-surface px-3.5 py-3 text-sm text-fg placeholder:text-muted/60 outline-none transition-[border-color,box-shadow] focus:border-lime-line focus:shadow-[0_0_0_3px_rgb(183_247_0/0.12)]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-[13px] font-medium text-fg/90", className)} {...props} />;
}
