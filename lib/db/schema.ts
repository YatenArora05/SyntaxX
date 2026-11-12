import { boolean, index, integer, jsonb, pgEnum, pgTable, real, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { Language, SampleCase, TestCase } from "@/types";

/* ---------- enums ---------- */
export const difficultyEnum = pgEnum("difficulty", ["Easy", "Medium", "Hard"]);
export const languageEnum = pgEnum("language", ["javascript", "python", "cpp", "java"]);
export const battleModeEnum = pgEnum("battle_mode", ["quick", "ranked", "private", "tournament", "practice"]);
export const battleStatusEnum = pgEnum("battle_status", ["waiting", "active", "finished", "abandoned"]);
export const battleResultEnum = pgEnum("battle_result", ["player1", "player2", "draw"]);
export const verdictEnum = pgEnum("verdict", ["Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit Exceeded"]);

/* ---------- users ---------- */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    /** always stored lower-cased */
    email: text("email").notNull(),
    username: text("username").notNull(),
    /** bots get "!" which can never match a bcrypt hash, so they cannot log in */
    passwordHash: text("password_hash").notNull(),
    rating: integer("rating").notNull().default(1200),
    /** ISO 3166 alpha-2 code, e.g. "IN" */
    country: text("country"),
    /** seeded (bot) players, shown with a "Bot" badge in the UI that keep the arena and leaderboard populated */
    isSeed: boolean("is_seed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    uniqueIndex("users_username_idx").on(t.username),
    index("users_rating_idx").on(t.rating),
  ],
);

/* ---------- problems ---------- */
export const problems = pgTable("problems", {
  /** slug, e.g. "pair-sum" (keeps existing /battle?problem=pair-sum links working) */
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  topics: text("topics").array().notNull().default([]),
  statement: text("statement").array().notNull(),
  inputFormat: text("input_format").notNull(),
  outputFormat: text("output_format").notNull(),
  constraints: text("constraints").array().notNull().default([]),
  samples: jsonb("samples").$type<SampleCase[]>().notNull(),
  functionName: text("function_name").notNull(),
  /** includes hidden cases: never send hidden tests to the browser in a real deployment */
  tests: jsonb("tests").$type<TestCase[]>().notNull(),
  starter: jsonb("starter").$type<Record<Language, string>>().notNull(),
  /** reference solution (JavaScript), used by bots and for verifying the tests */
  referenceSolution: text("reference_solution"),
  timeLimitMs: integer("time_limit_ms").notNull().default(1000),
  acceptance: real("acceptance").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ---------- battles ---------- */
export const battles = pgTable(
  "battles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mode: battleModeEnum("mode").notNull(),
    status: battleStatusEnum("status").notNull().default("waiting"),
    problemId: text("problem_id").notNull().references(() => problems.id),
    player1Id: uuid("player1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    /** null while waiting for an opponent */
    player2Id: uuid("player2_id").references(() => users.id, { onDelete: "cascade" }),
    result: battleResultEnum("result"),
    winnerId: uuid("winner_id").references(() => users.id, { onDelete: "set null" }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    durationSec: integer("duration_sec"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("battles_p1_idx").on(t.player1Id),
    index("battles_p2_idx").on(t.player2Id),
    index("battles_ended_idx").on(t.endedAt),
  ],
);

/* ---------- submissions ---------- */
export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** null for practice submissions made outside a battle */
    battleId: uuid("battle_id").references(() => battles.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    problemId: text("problem_id").notNull().references(() => problems.id),
    language: languageEnum("language").notNull(),
    code: text("code").notNull(),
    verdict: verdictEnum("verdict").notNull(),
    testsPassed: integer("tests_passed").notNull().default(0),
    testsTotal: integer("tests_total").notNull().default(0),
    runtimeMs: integer("runtime_ms"),
    memoryMb: real("memory_mb"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("submissions_user_idx").on(t.userId), index("submissions_battle_idx").on(t.battleId)],
);

/* ---------- rating history ---------- */
export const ratingHistory = pgTable(
  "rating_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    battleId: uuid("battle_id").references(() => battles.id, { onDelete: "cascade" }),
    oldRating: integer("old_rating").notNull(),
    newRating: integer("new_rating").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rating_history_user_idx").on(t.userId, t.createdAt)],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Problem = typeof problems.$inferSelect;
export type Battle = typeof battles.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type RatingHistoryRow = typeof ratingHistory.$inferSelect;
