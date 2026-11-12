/**
 * Seeds the database with problems, bot players and a believable history of past battles.
 * Safe to re-run: bots (and everything that belongs to them) are wiped and regenerated,
 * problems are upserted. Real users are never touched.
 *
 *   npm run db:seed
 */
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import { problems as mockProblems, opponentSolutions } from "../lib/mock-data/problems";
import { leaderboard } from "../lib/mock-data/players";
import { seeded } from "../lib/utils";
import type { Language } from "../types";

loadEnvConfig(process.cwd());

const BOT_COUNT = 80; // 25 hand-picked leaderboard names + generated ones
const BATTLE_COUNT = 700;
const HISTORY_DAYS = 30;
const K = 32;

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set (.env / .env.local).");
const client = postgres(url, { prepare: false, max: 3 });
const db = drizzle(client, { schema });
const { users, problems, battles, submissions, ratingHistory } = schema;

function chunk<T>(arr: T[], n: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
}

/* ---------------- problems ---------------- */
async function seedProblems() {
  for (const p of mockProblems) {
    const row = {
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      topics: p.topics,
      statement: p.statement,
      inputFormat: p.inputFormat,
      outputFormat: p.outputFormat,
      constraints: p.constraints,
      samples: p.samples,
      functionName: p.functionName,
      tests: p.tests,
      starter: p.starter,
      referenceSolutions: p.referenceSolutions,
      timeLimitMs: p.timeLimitMs,
      acceptance: p.acceptance,
    };
    await db.insert(problems).values(row).onConflictDoUpdate({ target: problems.id, set: row });
  }
  console.log(`✓ problems: ${mockProblems.length}`);
}

/* ---------------- bots ---------------- */
const first = ["heap", "stack", "graph", "tree", "bit", "byte", "null", "async", "regex", "lambda", "pixel", "quark", "vector", "cache", "mutex", "binary", "hash", "sudo", "kernel", "proxy", "token", "delta", "sigma", "omega"];
const second = ["hawk", "fox", "wolf", "ninja", "sage", "monk", "pilot", "wizard", "rider", "smith", "forge", "pulse", "drift", "spark", "ghost", "storm", "tiger", "raven", "otter", "falcon"];
const countryCodes = ["IN", "US", "JP", "KR", "DE", "BR", "PL", "CN", "CA", "UA", "NG", "FR", "VN", "GB", "EG", "SG"];

type Bot = { id: string; username: string; name: string; country: string; target: number; createdAt: Date };

function makeBots(): Bot[] {
  const r = seeded(2026);
  const now = Date.now();
  const bots: Bot[] = leaderboard.map((e) => ({
    id: randomUUID(),
    username: e.username,
    name: e.username,
    country: e.country.code,
    target: e.rating,
    createdAt: new Date(now - (40 + r() * 80) * 86400_000),
  }));
  const used = new Set(bots.map((b) => b.username));
  while (bots.length < BOT_COUNT) {
    const username = `${first[Math.floor(r() * first.length)]}_${second[Math.floor(r() * second.length)]}${r() > 0.6 ? Math.floor(r() * 99) : ""}`;
    if (used.has(username)) continue;
    used.add(username);
    bots.push({
      id: randomUUID(),
      username,
      name: username,
      country: countryCodes[Math.floor(r() * countryCodes.length)]!,
      target: Math.round(950 + Math.pow(r(), 1.4) * 900),
      createdAt: new Date(now - (10 + r() * 100) * 86400_000),
    });
  }
  return bots;
}

/* ---------------- battle simulation ---------------- */
type Plan = { a: number; b: number; u: number; draw: number; start: number; dur: number; mode: "ranked" | "quick" | "tournament"; problem: number };
type Played = Plan & { aOld: number; aNew: number; bOld: number; bNew: number; result: "player1" | "player2" | "draw" };

const expected = (ra: number, rb: number) => 1 / (1 + 10 ** ((rb - ra) / 400));

function makePlans(bots: Bot[]): Plan[] {
  const r = seeded(7);
  const end = Date.now() - 5 * 60_000;
  const start = end - HISTORY_DAYS * 86400_000;
  const times = Array.from({ length: BATTLE_COUNT }, () => start + r() * (end - start)).sort((x, y) => x - y);
  return times.map((t) => {
    const a = Math.floor(r() * bots.length);
    // pick the closest-rated of a few random candidates, so matches look fair
    let b = -1;
    for (let k = 0; k < 6; k++) {
      const c = Math.floor(r() * bots.length);
      if (c === a) continue;
      if (b < 0 || Math.abs(bots[c]!.target - bots[a]!.target) < Math.abs(bots[b]!.target - bots[a]!.target)) b = c;
    }
    if (b < 0) b = (a + 1) % bots.length;
    const m = r();
    return {
      a,
      b,
      u: r(),
      draw: r(),
      start: t,
      dur: Math.round(300 + r() * 1200),
      mode: m < 0.6 ? "ranked" : m < 0.9 ? "quick" : "tournament",
      problem: Math.floor(r() * mockProblems.length),
    };
  });
}

function simulate(plans: Plan[], start: number[]): { played: Played[]; final: number[] } {
  const rating = [...start];
  const played = plans.map((p): Played => {
    const aOld = rating[p.a]!;
    const bOld = rating[p.b]!;
    const ea = expected(aOld, bOld);
    const result: Played["result"] = p.draw < 0.05 ? "draw" : p.u < ea ? "player1" : "player2";
    const sa = result === "player1" ? 1 : result === "draw" ? 0.5 : 0;
    const aNew = Math.round(aOld + K * (sa - ea));
    const bNew = Math.round(bOld + K * (1 - sa - (1 - ea)));
    rating[p.a] = aNew;
    rating[p.b] = bNew;
    return { ...p, aOld, aNew, bOld, bNew, result };
  });
  return { played, final: rating };
}

/** Back-solve starting ratings so each bot ends up near its intended leaderboard rating. */
function calibrate(plans: Plan[], bots: Bot[]) {
  let start = bots.map((b) => b.target);
  for (let i = 0; i < 12; i++) {
    const { final } = simulate(plans, start);
    start = start.map((s, k) => Math.max(600, Math.min(3000, s + (bots[k]!.target - final[k]!))));
  }
  return simulate(plans, start);
}

const langPick = (u: number): Language => (u < 0.5 ? "javascript" : u < 0.72 ? "python" : u < 0.9 ? "cpp" : "java");

/* ---------------- main ---------------- */
async function main() {
  await seedProblems();

  // wipe previous bots; battles, submissions and rating rows cascade
  await db.delete(users).where(eq(users.isSeed, true));

  const bots = makeBots();
  const plans = makePlans(bots);
  const { played, final } = calibrate(plans, bots);

  for (const part of chunk(bots, 100)) {
    await db.insert(users).values(
      part.map((b) => ({
        id: b.id,
        name: b.name,
        email: `${b.username.replace(/[^a-z0-9_.]/gi, "_")}@bots.devbattle.local`.toLowerCase(),
        username: b.username,
        passwordHash: "!",
        rating: final[bots.indexOf(b)]!,
        country: b.country,
        isSeed: true,
        createdAt: b.createdAt,
      })),
    );
  }
  console.log(`✓ bots: ${bots.length}`);

  const r = seeded(99);
  const battleRows: (typeof battles.$inferInsert)[] = [];
  const subRows: (typeof submissions.$inferInsert)[] = [];
  const histRows: (typeof ratingHistory.$inferInsert)[] = [];

  for (const p of played) {
    const id = randomUUID();
    const A = bots[p.a]!;
    const B = bots[p.b]!;
    const prob = mockProblems[p.problem]!;
    const started = new Date(p.start);
    const ended = new Date(p.start + p.dur * 1000);
    const winnerId = p.result === "player1" ? A.id : p.result === "player2" ? B.id : null;
    battleRows.push({
      id,
      mode: p.mode,
      status: "finished",
      problemId: prob.id,
      player1Id: A.id,
      player2Id: B.id,
      result: p.result,
      winnerId,
      startedAt: started,
      endedAt: ended,
      durationSec: p.dur,
      createdAt: started,
    });

    const total = prob.tests.length;
    for (const [bot, side] of [[A, "player1"], [B, "player2"]] as const) {
      const full = p.result === side || p.result === "draw";
      const passed = full ? total : Math.max(1, total - 1 - Math.floor(r() * 3));
      const lang = langPick(r());
      const ref = opponentSolutions[prob.id];
      subRows.push({
        battleId: id,
        userId: bot.id,
        problemId: prob.id,
        language: lang,
        code: lang === "javascript" && ref ? ref : prob.starter[lang],
        verdict: full ? "Accepted" : r() < 0.85 ? "Wrong Answer" : "Time Limit Exceeded",
        testsPassed: passed,
        testsTotal: total,
        runtimeMs: Math.round(40 + r() * 140),
        memoryMb: Math.round((28 + r() * 30) * 10) / 10,
        submittedAt: new Date(p.start + Math.round(p.dur * (0.6 + r() * 0.4)) * 1000),
      });
    }
    histRows.push(
      { userId: A.id, battleId: id, oldRating: p.aOld, newRating: p.aNew, createdAt: ended },
      { userId: B.id, battleId: id, oldRating: p.bOld, newRating: p.bNew, createdAt: ended },
    );
  }

  for (const c of chunk(battleRows, 200)) await db.insert(battles).values(c);
  for (const c of chunk(subRows, 150)) await db.insert(submissions).values(c);
  for (const c of chunk(histRows, 300)) await db.insert(ratingHistory).values(c);
  console.log(`✓ battles: ${battleRows.length}, submissions: ${subRows.length}, rating rows: ${histRows.length}`);

  await client.end();
}

main().catch(async (e) => {
  console.error(e);
  await client.end();
  process.exit(1);
});
