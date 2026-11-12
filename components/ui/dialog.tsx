"use client";

import { Dialog as D } from "radix-ui";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <D.Portal forceMount>
            <D.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </D.Overlay>
            <D.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-lg rounded-[18px] border border-line-strong bg-surface p-6 shadow-2xl focus:outline-none",
                  className,
                )}
                initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-46%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.97, x: "-50%", y: "-48%" }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              >
                <div className="mb-5 pr-8">
                  <D.Title className="text-lg font-semibold tracking-tight">{title}</D.Title>
                  {description ? (
                    <D.Description className="mt-1 text-sm text-muted">{description}</D.Description>
                  ) : (
                    <D.Description className="sr-only">{title}</D.Description>
                  )}
                </div>
                {children}
                <D.Close
                  aria-label="Close"
                  className="absolute right-4 top-4 rounded-md p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-fg cursor-pointer"
                >
                  <X className="size-4" />
                </D.Close>
              </motion.div>
            </D.Content>
          </D.Portal>
        )}
      </AnimatePresence>
    </D.Root>
  );
}

/** Confirmation dialog for destructive or irreversible actions. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onOpenChange(false)}
          className="h-10 rounded-[var(--radius-control)] border border-line-strong px-4 text-sm font-medium text-fg hover:bg-white/[0.06] cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
          className="h-10 rounded-[var(--radius-control)] bg-fg px-4 text-sm font-semibold text-ink hover:bg-white/85 cursor-pointer"
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
