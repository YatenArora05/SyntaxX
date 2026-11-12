/**
 * Deterministic battle scoring. The winner is decided here from execution results only;
 * the AI judge adds explanation on top and never changes the outcome.
 *
 * Weights: correctness 55, runtime 15, memory 10, submission speed 20.
 * Runtime and memory differences inside a noise floor (1 ms / 1 MB or 15%) count as ties.
 */
import type { RunResult, ScoreBreakdown } from "@/types";

export const WEIGHTS = { correctness: 55, runtime: 15, memory: 10, speed: 20 } as const;

/**
 * Lower is better. Returns 1 for the better (or statistically tied) side and a
 * proportional fraction otherwise. Differences below the noise floor count as a tie,
 * so sub-millisecond timer jitter can never decide a battle.
 */
function relative(mine: number, theirs: number, floor: number) {
  if (!mine && !theirs) return 1;
  if (!mine) return 0;
  if (!theirs || Math.abs(mine - theirs) <= Math.max(floor, Math.min(mine, theirs) * 0.15)) return 1;
  return Math.min(mine, theirs) / mine;
}

export function scoreSide(me: RunResult | undefined, them: RunResult | undefined, durationSec: number): ScoreBreakdown {
  if (!me) return { correctness: 0, runtime: 0, memory: 0, speed: 0, total: 0 };
  const ratio = me.total ? me.passed / me.total : 0;
  const correctness = WEIGHTS.correctness * ratio;
  // Performance points only count for solutions that actually pass something.
  const runtime = ratio ? WEIGHTS.runtime * relative(me.runtimeMs, them?.runtimeMs ?? me.runtimeMs, 1) * ratio : 0;
  const memory = ratio ? WEIGHTS.memory * relative(me.memoryMb, them?.memoryMb ?? me.memoryMb, 1) * ratio : 0;
  const t = me.submittedAtSec ?? durationSec;
  const speed = ratio ? WEIGHTS.speed * Math.max(0, 1 - t / durationSec) * ratio : 0;
  const round = (n: number) => Math.round(n * 10) / 10;
  const total = round(correctness + runtime + memory + Math.min(WEIGHTS.speed, speed));
  return {
    correctness: round(correctness),
    runtime: round(runtime),
    memory: round(memory),
    speed: round(Math.min(WEIGHTS.speed, speed)),
    total,
  };
}

export function decideWinner(
  you: RunResult | undefined,
  opponent: RunResult | undefined,
  durationSec: number,
): { winner: "you" | "opponent" | "draw"; you: ScoreBreakdown; opponent: ScoreBreakdown; reason: string } {
  const a = scoreSide(you, opponent, durationSec);
  const b = scoreSide(opponent, you, durationSec);
  const yp = you?.passed ?? 0;
  const op = opponent?.passed ?? 0;

  let winner: "you" | "opponent" | "draw";
  let reason: string;
  if (yp !== op) {
    winner = yp > op ? "you" : "opponent";
    reason = `More test cases passed (${Math.max(yp, op)} vs ${Math.min(yp, op)}).`;
  } else if (Math.abs(a.total - b.total) < 0.5) {
    winner = "draw";
    reason = "Identical correctness and near-identical performance.";
  } else {
    winner = a.total > b.total ? "you" : "opponent";
    reason = "Equal correctness — decided on runtime, memory and submission time.";
  }
  return { winner, you: a, opponent: b, reason };
}

export function ratingChange(winner: "you" | "opponent" | "draw", myRating: number, theirRating: number) {
  const expected = 1 / (1 + 10 ** ((theirRating - myRating) / 400));
  const actual = winner === "you" ? 1 : winner === "draw" ? 0.5 : 0;
  return Math.round(32 * (actual - expected));
}
