/**
 * Real-time battle channel.
 *
 * `connectBattle()` returns a socket.io connection when NEXT_PUBLIC_SOCKET_URL is set,
 * and otherwise a local simulation that streams a scripted opponent. Both implement the
 * same `BattleChannel` interface, so the arena never knows which one it is talking to.
 */
import { io, type Socket } from "socket.io-client";
import type { Language } from "@/types";

export interface BattleEvents {
  "opponent:connected": { at: number };
  "opponent:typing": { typing: boolean };
  "opponent:code": { code: string; language: Language };
  "opponent:run": { code: string };
  "opponent:submit": { code: string; atSec: number };
  "opponent:status": { status: "connected" | "reconnecting" | "disconnected" };
}

export interface ClientEvents {
  "player:code": { code: string; language: Language };
  "player:run": Record<string, never>;
  "player:submit": { atSec: number };
}

type Handler<T> = (payload: T) => void;

export interface BattleChannel {
  on<K extends keyof BattleEvents>(event: K, handler: Handler<BattleEvents[K]>): () => void;
  emit<K extends keyof ClientEvents>(event: K, payload: ClientEvents[K]): void;
  disconnect(): void;
  readonly simulated: boolean;
}

class Emitter {
  private handlers = new Map<string, Set<Handler<unknown>>>();
  on(event: string, h: Handler<unknown>) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(h);
    return () => void this.handlers.get(event)?.delete(h);
  }
  fire(event: string, payload: unknown) {
    this.handlers.get(event)?.forEach((h) => h(payload));
  }
}

/** Local simulation of an opponent typing a solution like a person would. */
function createSimulatedChannel(opts: {
  script: string;
  language: Language;
  /** seconds of "reading the problem" before typing starts */
  thinkSec?: number;
  /** characters per second while actively typing */
  cps?: number;
}): BattleChannel {
  const emitter = new Emitter();
  const timers: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;
  const startedAt = Date.now();
  const at = (ms: number, fn: () => void) => timers.push(setTimeout(() => !cancelled && fn(), ms));

  at(600, () => emitter.fire("opponent:connected", { at: Date.now() }));

  const think = (opts.thinkSec ?? 14) * 1000;
  const cps = opts.cps ?? 3.2;
  const script = opts.script;
  let typed = 0;
  let typing = false;

  const tick = () => {
    if (cancelled) return;
    if (typed >= script.length) {
      emitter.fire("opponent:typing", { typing: false });
      at(4500, () => emitter.fire("opponent:run", { code: script }));
      at(14000, () =>
        emitter.fire("opponent:submit", { code: script, atSec: Math.round((Date.now() - startedAt) / 1000) }),
      );
      return;
    }
    // Type a short burst (a token or two), then pause like a human.
    const burst = 2 + Math.floor(Math.random() * 6);
    typed = Math.min(script.length, typed + burst);
    if (!typing) {
      typing = true;
      emitter.fire("opponent:typing", { typing: true });
    }
    emitter.fire("opponent:code", { code: script.slice(0, typed), language: opts.language });

    const atLineEnd = script[typed - 1] === "\n";
    let delay = (burst / cps) * 1000;
    if (atLineEnd && Math.random() < 0.35) {
      delay += 1500 + Math.random() * 3500; // thinking between lines
      typing = false;
      at(250, () => emitter.fire("opponent:typing", { typing: false }));
    }
    at(delay, tick);
  };
  at(think, tick);

  // A brief connection wobble mid-battle makes the status indicator meaningful.
  at(think + 38000, () => emitter.fire("opponent:status", { status: "reconnecting" }));
  at(think + 40500, () => emitter.fire("opponent:status", { status: "connected" }));

  return {
    simulated: true,
    on: (event, handler) => emitter.on(event, handler as Handler<unknown>),
    emit: () => {
      /* the simulation doesn't need the player's events */
    },
    disconnect: () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    },
  };
}

function createSocketChannel(url: string, battleId: string, token?: string): BattleChannel {
  const socket: Socket = io(url, { query: { battleId }, auth: token ? { token } : undefined, transports: ["websocket"] });
  return {
    simulated: false,
    on: (event, handler) => {
      socket.on(event as string, handler as (...args: unknown[]) => void);
      return () => void socket.off(event as string, handler as (...args: unknown[]) => void);
    },
    emit: (event, payload) => void socket.emit(event, payload),
    disconnect: () => void socket.disconnect(),
  };
}

export function connectBattle(opts: {
  battleId: string;
  opponentScript: string;
  language: Language;
  pace?: { thinkSec?: number; cps?: number };
}): BattleChannel {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (url) return createSocketChannel(url, opts.battleId);
  return createSimulatedChannel({ script: opts.opponentScript, language: opts.language, ...opts.pace });
}
