"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/services/auth";
import { Field, validateEmail } from "./auth-form";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setState("loading");
    await requestPasswordReset(email);
    setState("sent");
  };

  return (
    <AnimatePresence mode="wait">
      {state === "sent" ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <span className="grid size-12 place-items-center rounded-full bg-lime-soft text-lime"><MailCheck className="size-5" /></span>
          <h1 className="mt-6 text-[32px] font-bold tracking-[-0.035em]">Check your inbox</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            If an account exists for <span className="text-fg">{email}</span>, a reset link is on its way. It expires in 30 minutes.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" asChild><Link href="/login">Back to log in</Link></Button>
            <Button size="lg" variant="ghost" onClick={() => setState("idle")}>Use a different email</Button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-fg"><ArrowLeft className="size-3.5" /> Log in</Link>
          <h1 className="mt-6 text-[32px] font-bold tracking-[-0.035em]">Reset your password</h1>
          <p className="mt-2 text-[15px] text-muted">Enter the email on your account and we&apos;ll send a reset link.</p>
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
            <Field id="email" label="Email" error={error}>
              <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
            </Field>
            <Button type="submit" size="lg" className="w-full" disabled={state === "loading"}>
              {state === "loading" && <Loader2 className="animate-spin" />} Send reset link
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
