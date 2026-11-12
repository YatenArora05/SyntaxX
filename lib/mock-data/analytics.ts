import { seeded } from "@/lib/utils";

const r = seeded(42);

/** Weekly rating for the last 16 weeks. */
export const ratingHistory = Array.from({ length: 16 }, (_, i) => {
  const base = 1520 + i * 21 + Math.round((r() - 0.4) * 60);
  return { week: `W${i + 1}`, rating: i === 15 ? 1847 : base, battles: Math.round(6 + r() * 12) };
});

/** Last 14 days of results (wins vs losses). */
export const dailyResults = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 10, 10) - (13 - i) * 86400_000);
  return {
    day: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    wins: Math.round(r() * 6),
    losses: Math.round(r() * 4),
  };
});

export const topicMastery = [
  { topic: "Hash Map", score: 91, solved: 58, avgSec: 284 },
  { topic: "Two Pointers", score: 86, solved: 41, avgSec: 352 },
  { topic: "Sliding Window", score: 82, solved: 37, avgSec: 401 },
  { topic: "Sorting", score: 79, solved: 33, avgSec: 366 },
  { topic: "Graphs", score: 68, solved: 29, avgSec: 744 },
  { topic: "Trees", score: 64, solved: 31, avgSec: 690 },
  { topic: "Greedy", score: 58, solved: 22, avgSec: 612 },
  { topic: "Dynamic Programming", score: 44, solved: 26, avgSec: 1082 },
  { topic: "Segment Trees", score: 31, solved: 7, avgSec: 1420 },
];

export const solveTimeByDifficulty = [
  { difficulty: "Easy", you: 248, average: 331 },
  { difficulty: "Medium", you: 602, average: 688 },
  { difficulty: "Hard", you: 1284, average: 1190 },
];

export const languageSplit = [
  { language: "JavaScript", battles: 92, winRate: 63 },
  { language: "C++", battles: 51, winRate: 61 },
  { language: "Python", battles: 31, winRate: 52 },
  { language: "Java", battles: 12, winRate: 50 },
];

export const accuracyTrend = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 5}`,
  accuracy: Math.round(64 + i * 1.3 + (r() - 0.5) * 6),
  firstTry: Math.round(41 + i * 1.6 + (r() - 0.5) * 8),
}));

export const recommendations = [
  {
    title: "Close the DP gap",
    detail:
      "Dynamic programming is your weakest topic at 44% mastery and costs you ~8 minutes per battle versus your average. Five 1D DP problems this week would move it fastest.",
    topic: "Dynamic Programming",
    impact: "High",
  },
  {
    title: "Submit earlier on Easy problems",
    detail:
      "You solve Easy problems 25% faster than average but re-run samples 3.2 times before submitting. Trusting the first green run would bank 40–60 seconds per battle.",
    topic: "Battle habits",
    impact: "Medium",
  },
  {
    title: "Watch edge cases on interval problems",
    detail:
      "4 of your last 6 Wrong Answers on sorting problems came from touching boundaries (end == start). Add that case to your mental checklist.",
    topic: "Sorting",
    impact: "Medium",
  },
];
