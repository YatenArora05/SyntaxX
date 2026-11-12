"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Field({
  id,
  label,
  error,
  children,
  aside,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {aside}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[12.5px] text-fg/80"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? "text" : "password"} className="pr-11" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted transition-colors hover:text-fg cursor-pointer"
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function GoogleButton({ onClick, loading, label = "Continue with Google" }: { onClick: () => void; loading?: boolean; label?: string }) {
  return (
    <Button type="button" variant="secondary" size="lg" className="w-full" onClick={onClick} disabled={loading}>
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden className="size-4">
          <path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.6 4.1-5.35 4.1a6.2 6.2 0 0 1 0-12.4c1.76 0 2.94.75 3.62 1.4l2.47-2.38C16.5 3.6 14.47 2.7 12 2.7a9.3 9.3 0 1 0 0 18.6c5.37 0 8.93-3.77 8.93-9.08 0-.61-.07-1.08-.16-1.54Z" />
        </svg>
      )}
      {label}
    </Button>
  );
}

export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-[12px] text-muted">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export const validateEmail = (v: string) =>
  !v.trim() ? "Enter your email address." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email, like name@example.com." : undefined;

export const validatePassword = (v: string) =>
  !v ? "Enter your password." : v.length < 8 ? "Passwords are at least 8 characters." : undefined;

export function passwordStrength(v: string) {
  let s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return Math.min(4, s);
}
