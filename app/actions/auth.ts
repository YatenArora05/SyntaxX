"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession, destroySession } from "@/lib/auth/session";

export type AuthResult = { ok: true } | { ok: false; field: "email" | "password" | "name"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function usernameFrom(email: string) {
  return email.split("@")[0]!.replace(/[^a-z0-9_.]/gi, "_").slice(0, 18).toLowerCase() || "player";
}

async function signUpImpl(input: { name: string; email: string; password: string }): Promise<AuthResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2) return { ok: false, field: "name", message: "Enter your name." };
  if (!EMAIL.test(email)) return { ok: false, field: "email", message: "Enter a valid email address." };
  if (input.password.length < 8) return { ok: false, field: "password", message: "Use at least 8 characters." };

  const d = db();
  const [existing] = await d.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { ok: false, field: "email", message: "An account with this email already exists. Log in instead." };

  const passwordHash = await bcrypt.hash(input.password, 12);
  // make the username unique by retrying with a numeric suffix
  const base = usernameFrom(email);
  for (let i = 0; i < 5; i++) {
    const username = i === 0 ? base : `${base.slice(0, 14)}${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const [u] = await d.insert(users).values({ name, email, username, passwordHash }).returning();
      await createSession({ id: u!.id, name: u!.name, email: u!.email, username: u!.username });
      return { ok: true };
    } catch (e) {
      const msg = String((e as { message?: string; cause?: { message?: string } }).cause?.message ?? (e as Error).message);
      if (msg.includes("users_email_idx")) return { ok: false, field: "email", message: "An account with this email already exists. Log in instead." };
      if (!msg.includes("users_username_idx")) throw e;
    }
  }
  return { ok: false, field: "email", message: "Couldn't create your account. Try again." };
}

async function signInImpl(input: { email: string; password: string }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const [u] = await db().select().from(users).where(eq(users.email, email)).limit(1);
  // same message for unknown email and wrong password: don't reveal which accounts exist
  const valid = u ? await bcrypt.compare(input.password, u.passwordHash) : await bcrypt.compare(input.password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  if (!u || !valid) return { ok: false, field: "password", message: "Incorrect email or password." };
  await createSession({ id: u.id, name: u.name, email: u.email, username: u.username });
  return { ok: true };
}

export async function signOutAction() {
  await destroySession();
}

const FAILED: AuthResult = { ok: false, field: "email", message: "We couldn't reach the server. Please try again in a moment." };

// Unexpected failures (database down, bad config) are logged server-side and shown as a friendly message.
export async function signUpAction(input: { name: string; email: string; password: string }): Promise<AuthResult> {
  try {
    return await signUpImpl(input);
  } catch (e) {
    console.error("[auth] signUp failed:", e);
    return FAILED;
  }
}

export async function signInAction(input: { email: string; password: string }): Promise<AuthResult> {
  try {
    return await signInImpl(input);
  } catch (e) {
    console.error("[auth] signIn failed:", e);
    return FAILED;
  }
}
