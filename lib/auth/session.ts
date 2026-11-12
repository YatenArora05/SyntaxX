import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export interface Session {
  id: string;
  name: string;
  email: string;
  username: string;
}

const COOKIE = "devbattle.session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set (32+ chars). Generate one with: openssl rand -base64 32");
  return new TextEncoder().encode(secret);
}

export async function createSession(s: Session) {
  const token = await new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    const { id, name, email, username } = payload as unknown as Session;
    return { id, name, email, username };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
