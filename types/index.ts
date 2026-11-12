export type Language = "javascript" | "python" | "cpp" | "java";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type BattleMode = "quick" | "ranked" | "private" | "tournament" | "practice";
export type Tier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Grandmaster";

export interface Country {
  code: string;
  name: string;
}

export interface Player {
  id: string;
  username: string;
  rating: number;
  tier: Tier;
  country: Country;
  online: boolean;
  status?: "idle" | "in-battle" | "searching";
}

export interface TestCase {
  args: unknown[];
  expected: unknown;
  hidden?: boolean;
}

export interface SampleCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  statement: string[];
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  samples: SampleCase[];
  functionName: string;
  tests: TestCase[];
  starter: Record<Language, string>;
  /** Reference runtimes used to give mock judges realistic numbers */
  timeLimitMs: number;
  acceptance: number;
}

export type CaseStatus = "passed" | "failed" | "error" | "timeout";

export interface CaseResult {
  index: number;
  hidden: boolean;
  status: CaseStatus;
  input: string;
  expected: string;
  received: string;
  timeMs: number;
}

export type RunVerdict =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Compilation Error"
  | "Time Limit Exceeded";

export interface RunResult {
  verdict: RunVerdict;
  mode: "run" | "submit";
  cases: CaseResult[];
  passed: number;
  total: number;
  runtimeMs: number;
  memoryMb: number;
  /** true when the result came from the in-browser JS engine rather than a simulated judge */
  executed: boolean;
  console: string[];
  error?: string;
  submittedAtSec?: number;
}

export interface BattleSide {
  player: Player;
  language: Language;
  code: string;
  result?: RunResult;
}

export interface ScoreBreakdown {
  correctness: number;
  runtime: number;
  memory: number;
  speed: number;
  total: number;
}

export interface AiCriterion {
  key: string;
  label: string;
  you: string;
  opponent: string;
  edge: "you" | "opponent" | "even";
}

export interface AiEvaluation {
  summary: string;
  criteria: AiCriterion[];
  youComplexity: { time: string; space: string };
  opponentComplexity: { time: string; space: string };
  suggestions: string[];
}

export interface BattleRecord {
  id: string;
  opponent: Player;
  problem: string;
  difficulty: Difficulty;
  result: "win" | "loss" | "draw";
  ratingDelta: number;
  date: string;
  language: Language;
  mode: BattleMode;
  yourTests: [number, number];
  opponentTests: [number, number];
  runtimeMs: number;
  opponentRuntimeMs: number;
  durationSec: number;
}

export interface LeaderboardEntry extends Player {
  rank: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
  change: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  icon: "flame" | "zap" | "trophy" | "target" | "brain" | "swords" | "timer" | "crown";
}
