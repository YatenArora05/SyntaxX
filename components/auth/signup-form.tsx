"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthError, signUp } from "@/lib/services/auth";
import { cn } from "@/lib/utils";
import { Field, PasswordInput, passwordStrength, validateEmail, validatePassword } from "./auth-form";

const strengthLabel = ["Too short", "Weak", "Fair", "Strong", "Very strong"];

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; agree?: string }>({});
  const [loading, setLoading] = useState<"form" | null>(null);
  const strength = passwordStrength(form.password);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = {
      name: form.name.trim().length < 2 ? "Enter your name." : undefined,
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      agree: agree ? undefined : "Accept the fair-play rules to continue.",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setLoading("form");
    try {
      await signUp(form.name, form.email, form.password);
      toast("Account created", { description: "Your starting rating is 1200. Go win some battles." });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof AuthError) setErrors({ [err.field ?? "email"]: err.message });
      setLoading(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[32px] font-bold tracking-[-0.035em]">Create your account</h1>
      <p className="mt-2 text-[15px] text-muted">Start at 1200 rating. Your first battle is a minute away.</p>
      <div className="mt-8 space-y-5">
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Field id="name" label="Name" error={errors.name}>
            <Input id="name" autoComplete="name" placeholder="Ada Lovelace" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} />
          </Field>
          <Field id="password" label="Password" error={errors.password}>
            <PasswordInput id="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={set("password")} aria-invalid={!!errors.password} />
            {form.password && (
              <div className="flex items-center gap-3 pt-1" aria-live="polite">
                <div className="flex flex-1 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < strength ? "bg-lime" : "bg-white/[0.08]")} />
                  ))}
                </div>
                <span className="w-20 text-right text-[12px] text-muted">{strengthLabel[strength]}</span>
              </div>
            )}
          </Field>
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-[13.5px] text-muted">
              <button
                type="button"
                role="checkbox"
                aria-checked={agree}
                onClick={() => setAgree((a) => !a)}
                className={cn(
                  "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors cursor-pointer",
                  agree ? "border-lime bg-lime text-ink" : "border-line-strong",
                )}
              >
                {agree && <Check className="size-3" strokeWidth={3} />}
              </button>
              <span>I agree to the fair-play rules: no AI autocompletion or copy-paste from outside the arena during ranked battles.</span>
            </label>
            {errors.agree && <p className="mt-1.5 pl-[30px] text-[12.5px] text-fg/80" role="alert">{errors.agree}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={!!loading}>
            {loading === "form" && <Loader2 className="animate-spin" />} Create account
          </Button>
        </form>
      </div>
      <p className="mt-8 text-center text-[14px] text-muted">
        Already have an account? <Link href="/login" className="font-medium text-fg hover:text-lime">Log in</Link>
      </p>
    </motion.div>
  );
}
