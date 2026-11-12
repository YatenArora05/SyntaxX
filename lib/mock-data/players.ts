import type { Achievement, BattleRecord, Country, LeaderboardEntry, Player, Tier } from "@/types";
import { seeded } from "@/lib/utils";
import { problems } from "./problems";

export const countries: Record<string, Country> = {
  IN: { code: "IN", name: "India" },
  US: { code: "US", name: "United States" },
  JP: { code: "JP", name: "Japan" },
  KR: { code: "KR", name: "South Korea" },
  DE: { code: "DE", name: "Germany" },
  BR: { code: "BR", name: "Brazil" },
  PL: { code: "PL", name: "Poland" },
  CN: { code: "CN", name: "China" },
  CA: { code: "CA", name: "Canada" },
  UA: { code: "UA", name: "Ukraine" },
  NG: { code: "NG", name: "Nigeria" },
  FR: { code: "FR", name: "France" },
  VN: { code: "VN", name: "Vietnam" },
  GB: { code: "GB", name: "United Kingdom" },
  EG: { code: "EG", name: "Egypt" },
  SG: { code: "SG", name: "Singapore" },
};

export function tierFor(rating: number): Tier {
  if (rating >= 2600) return "Grandmaster";
  if (rating >= 2200) return "Diamond";
  if (rating >= 1900) return "Platinum";
  if (rating >= 1600) return "Gold";
  if (rating >= 1300) return "Silver";
  return "Bronze";
}

const roster: [string, number, string][] = [
  ["heapqueen", 2874, "KR"],
  ["o1_hiro", 2811, "JP"],
  ["segfault_sara", 2766, "PL"],
  ["lambda_lena", 2702, "DE"],
  ["recursion_raj", 2655, "IN"],
  ["bitwise_bea", 2590, "US"],
  ["dp_dimitri", 2544, "UA"],
  ["kodama", 2498, "JP"],
  ["memo_mateo", 2461, "BR"],
  ["xor_xin", 2433, "CN"],
  ["greedy_gus", 2390, "CA"],
  ["tarjan_tolu", 2352, "NG"],
  ["ayaan.dev", 2318, "IN"],
  ["fenwick_fleur", 2287, "FR"],
  ["minh_mod", 2249, "VN"],
  ["trie_harder", 2210, "GB"],
  ["nour_null", 2176, "EG"],
  ["sieve_sam", 2144, "SG"],
  ["quick_qadir", 2101, "IN"],
  ["dijkstra_dee", 2067, "US"],
  ["prefix_priya", 2031, "IN"],
  ["bfs_benji", 1998, "GB"],
  ["union_ulla", 1962, "DE"],
  ["stack_stef", 1925, "PL"],
  ["loop_lucas", 1893, "BR"],
];

export const leaderboard: LeaderboardEntry[] = roster.map(([username, rating, cc], i) => {
  const r = seeded(i + 11);
  const total = Math.round(180 + r() * 520);
  const winRate = Math.round((78 - i * 0.9 - r() * 6) * 10) / 10;
  const wins = Math.round((total * winRate) / 100);
  return {
    id: `u_${username}`,
    rank: i + 1,
    username,
    rating,
    tier: tierFor(rating),
    country: countries[cc]!,
    online: r() > 0.4,
    wins,
    losses: total - wins,
    winRate,
    streak: Math.round(r() * 9),
    change: Math.round((r() - 0.35) * 6),
  };
});

/** Rating-period specific leaderboards are re-ordered slices so filters visibly change results. */
export function leaderboardFor(period: "daily" | "weekly" | "monthly" | "all") {
  if (period === "all") return leaderboard;
  const seed = { daily: 3, weekly: 7, monthly: 13 }[period];
  const r = seeded(seed);
  const shuffled = [...leaderboard]
    .map((e) => ({ e, k: e.rating + (r() - 0.5) * 420 }))
    .sort((a, b) => b.k - a.k)
    .map(({ e }, i) => {
      const scale = period === "daily" ? 0.02 : period === "weekly" ? 0.08 : 0.3;
      const wins = Math.max(1, Math.round(e.wins * scale));
      const losses = Math.max(0, Math.round(e.losses * scale));
      return {
        ...e,
        rank: i + 1,
        wins,
        losses,
        winRate: Math.round((wins / (wins + losses || 1)) * 1000) / 10,
        change: Math.round((r() - 0.4) * 8),
      };
    });
  return shuffled;
}

export const currentUser: Player & {
  displayName: string;
  rank: number;
  joined: string;
  bio: string;
  favouriteLanguage: string;
} = {
  id: "u_me",
  username: "kernel_panic",
  displayName: "Developer",
  rating: 1847,
  tier: tierFor(1847),
  country: countries.IN!,
  online: true,
  rank: 1284,
  joined: "2025-08-14",
  bio: "Systems programmer by day, competitive coder by night. Partial to graphs and anything with a monotonic stack.",
  favouriteLanguage: "JavaScript",
};

export const userStats = {
  totalBattles: 186,
  wins: 112,
  losses: 68,
  draws: 6,
  winRate: 60.2,
  streak: 4,
  bestStreak: 11,
  problemsSolved: 341,
  avgSolveSec: 612,
  accuracy: 78.4,
};

export const onlinePlayers: Player[] = leaderboard.slice(4, 22).map((e, i) => ({
  ...e,
  online: true,
  status: (["idle", "in-battle", "searching", "idle"] as const)[i % 4],
}));

export const friends: Player[] = [
  { ...leaderboard[12]!, online: true, status: "idle" },
  { ...leaderboard[18]!, online: true, status: "in-battle" },
  { ...leaderboard[20]!, online: true, status: "searching" },
  { ...leaderboard[23]!, online: false },
  { ...leaderboard[9]!, online: true, status: "idle" },
  { ...leaderboard[15]!, online: false },
];

const langs = ["javascript", "python", "cpp", "javascript", "java"] as const;
const modes = ["ranked", "quick", "ranked", "private", "tournament"] as const;

export const battleHistory: BattleRecord[] = Array.from({ length: 24 }, (_, i) => {
  const r = seeded(i * 7 + 3);
  const opp = leaderboard[Math.floor(r() * 20) + 3]!;
  const problem = problems[i % problems.length]!;
  const total = problem.tests.length;
  const roll = r();
  const result: BattleRecord["result"] = roll > 0.4 ? "win" : roll > 0.06 ? "loss" : "draw";
  const yourPassed = result === "win" ? total : Math.max(1, total - Math.ceil(r() * 3));
  const oppPassed = result === "loss" ? total : Math.max(1, total - Math.ceil(r() * 3));
  const date = new Date(Date.UTC(2026, 10, 10, 14) - i * (r() * 30 + 9) * 3600_000).toISOString();
  return {
    id: `BTL-${(48210 - i * 37).toString(36).toUpperCase()}`,
    opponent: opp,
    problem: problem.title,
    difficulty: problem.difficulty,
    result,
    ratingDelta: result === "win" ? Math.round(8 + r() * 18) : result === "loss" ? -Math.round(6 + r() * 15) : 0,
    date,
    language: langs[i % langs.length]!,
    mode: modes[i % modes.length]!,
    yourTests: [yourPassed, total],
    opponentTests: [oppPassed, total],
    runtimeMs: Math.round(40 + r() * 140),
    opponentRuntimeMs: Math.round(40 + r() * 140),
    durationSec: Math.round(300 + r() * 1200),
  };
});

export const achievements: Achievement[] = [
  { id: "a1", title: "First Blood", description: "Win your first ranked battle", unlocked: true, icon: "swords" },
  { id: "a2", title: "On Fire", description: "Win 10 battles in a row", unlocked: true, icon: "flame" },
  { id: "a3", title: "Speed Demon", description: "Solve a Medium in under 4 minutes", unlocked: true, icon: "zap" },
  { id: "a4", title: "Clean Sweep", description: "Pass every hidden test on 50 submissions", unlocked: true, icon: "target" },
  { id: "a5", title: "Platinum Mind", description: "Reach a rating of 1900", unlocked: false, progress: 72, icon: "brain" },
  { id: "a6", title: "Marathoner", description: "Finish 250 battles", unlocked: false, progress: 74, icon: "timer" },
  { id: "a7", title: "Tournament Victor", description: "Win a weekly tournament", unlocked: false, progress: 0, icon: "trophy" },
  { id: "a8", title: "Crowned", description: "Enter the global top 100", unlocked: false, progress: 12, icon: "crown" },
];

export const platformStats = {
  totalBattles: 2_418_903,
  activeDevelopers: 186_240,
  problemsSolved: 9_872_115,
  countries: 142,
  online: 1284,
};
