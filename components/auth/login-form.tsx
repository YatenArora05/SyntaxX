"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthError, signIn } from "@/lib/services/auth";
import { Field, PasswordInput, validateEmail, validatePassword } from "./auth-form";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<"form" | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(next);
    if (next.email || next.password) return;
    setLoading("form");
    try {
      await signIn(email, password);
      toast("Logged in", { description: "Welcome back to the arena." });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof AuthError) setErrors({ [err.field ?? "email"]: err.message });
      setLoading(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[32px] font-bold tracking-[-0.035em]">Log in</h1>
      <p className="mt-2 text-[15px] text-muted">Pick up where your rating left off.</p>

      <div className="mt-8 space-y-5">
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Field id="email" label="Email" error={errors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => email && setErrors((er) => ({ ...er, email: validateEmail(email) }))}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>
          <Field
            id="password"
            label="Password"
            error={errors.password}
            aside={<Link href="/forgot-password" className="text-[12.5px] text-muted hover:text-lime">Forgot password?</Link>}
          >
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" disabled={!!loading}>
            {loading === "form" && <Loader2 className="animate-spin" />} Log in
          </Button>
        </form>
      </div>
      <p className="mt-8 text-center text-[14px] text-muted">
        New to Dev Battle? <Link href="/signup" className="font-medium text-fg hover:text-lime">Create an account</Link>
      </p>
    </motion.div>
  );
}
