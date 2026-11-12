"use client";

/**
 * Client-side auth. The session itself lives in an httpOnly cookie managed by the
 * server actions in app/actions/auth.ts; the root layout reads it and passes it to
 * <SessionProvider>, so useSession() is correct on first paint with no flicker.
 */
import { createContext, createElement, useContext } from "react";
import { requestResetStub } from "./auth-reset";
import { signInAction, signOutAction, signUpAction } from "@/app/actions/auth";

export interface Session {
  id?: string;
  name: string;
  email: string;
  username: string;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ session, children }: { session: Session | null; children: React.ReactNode }) {
  return createElement(SessionContext.Provider, { value: session }, children);
}

export function useSession() {
  return useContext(SessionContext);
}

export class AuthError extends Error {
  constructor(
    message: string,
    public field?: "email" | "password" | "name",
  ) {
    super(message);
  }
}

export async function signIn(email: string, password: string) {
  const r = await signInAction({ email, password });
  if (!r.ok) throw new AuthError(r.message, r.field);
}

export async function signUp(name: string, email: string, password: string) {
  const r = await signUpAction({ name, email, password });
  if (!r.ok) throw new AuthError(r.message, r.field);
}

export async function signOut() {
  await signOutAction();
}

export const requestPasswordReset = requestResetStub;
