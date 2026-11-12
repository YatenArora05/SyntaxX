import type { Problem } from "@/types";

const starter = (
  fn: string,
  params: string,
  pyParams: string,
  cppSig: string,
  javaSig: string,
): Problem["starter"] => ({
  javascript: `/**\n * Write your solution below.\n * Use console.log() to debug — output appears in the console.\n */\nfunction ${fn}(${params}) {\n  \n}\n`,
  python: `class Solution:\n    def ${fn}(self, ${pyParams}):\n        pass\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${cppSig} {\n        \n    }\n};\n`,
  java: `import java.util.*;\n\nclass Solution {\n    public ${javaSig} {\n        \n    }\n}\n`,
});

export const problems: Problem[] = [
  {
    id: "pair-sum",
    title: "Pair With Target Sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Map"],
    statement: [
      "You are given an array of integers `nums` and an integer `target`.",
      "Return the indices of the two numbers that add up to `target`, as an array `[i, j]` with `i < j`.",
      "Exactly one valid answer exists, and you may not use the same element twice.",
    ],
    inputFormat: "An integer array `nums` and an integer `target`.",
    outputFormat: "An array of two indices `[i, j]` where `i < j`.",
    constraints: ["2 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹", "Exactly one valid answer exists"],
    samples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
    ],
    functionName: "pairSum",
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1], hidden: true },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], hidden: true },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3], hidden: true },
      { args: [[1, 5, 9, 14, 20, 33], 47], expected: [3, 5], hidden: true },
      { args: [[1000000000, -999999999, 7], 1], expected: [0, 1], hidden: true },
      { args: [[5, 75, 25], 100], expected: [1, 2], hidden: true },
    ],
    starter: starter("pairSum", "nums, target", "nums: list[int], target: int", "vector<int> pairSum(vector<int>& nums, int target)", "int[] pairSum(int[] nums, int target)"),
    timeLimitMs: 1000,
    acceptance: 61.4,
  },
  {
    id: "longest-unique-run",
    title: "Longest Unique Run",
    difficulty: "Medium",
    topics: ["Strings", "Sliding Window"],
    statement: [
      "Given a string `s`, find the length of the longest contiguous substring in which no character repeats.",
      "A substring is a contiguous block of characters — `\"pwke\"` is a subsequence of `\"pwwkew\"`, not a substring.",
    ],
    inputFormat: "A single string `s` consisting of printable ASCII characters.",
    outputFormat: "An integer: the length of the longest substring without repeated characters.",
    constraints: ["0 ≤ s.length ≤ 5 × 10⁴", "s consists of letters, digits, symbols and spaces"],
    samples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke".' },
    ],
    functionName: "longestUniqueRun",
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["pwwkew"], expected: 3 },
      { args: ["bbbbb"], expected: 1, hidden: true },
      { args: [""], expected: 0, hidden: true },
      { args: [" "], expected: 1, hidden: true },
      { args: ["dvdf"], expected: 3, hidden: true },
      { args: ["abba"], expected: 2, hidden: true },
      { args: ["tmmzuxt"], expected: 5, hidden: true },
      { args: ["abcdefghijklmnopqrstuvwxyzabc"], expected: 26, hidden: true },
    ],
    starter: starter("longestUniqueRun", "s", "s: str", "int longestUniqueRun(string s)", "int longestUniqueRun(String s)"),
    timeLimitMs: 1000,
    acceptance: 38.9,
  },
  {
    id: "merge-windows",
    title: "Merge Booking Windows",
    difficulty: "Medium",
    topics: ["Arrays", "Sorting"],
    statement: [
      "A meeting room's bookings are given as `intervals`, where `intervals[i] = [start, end]`.",
      "Merge every pair of overlapping or touching windows and return the resulting list sorted by start time.",
      "Two windows touch when one ends exactly where the next begins, e.g. `[1, 4]` and `[4, 5]` merge into `[1, 5]`.",
    ],
    inputFormat: "A 2D integer array `intervals` of `[start, end]` pairs, in any order.",
    outputFormat: "A 2D array of merged, non-overlapping windows sorted by start.",
    constraints: ["1 ≤ intervals.length ≤ 10⁴", "0 ≤ start ≤ end ≤ 10⁴"],
    samples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap and merge into [1,6]." },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    functionName: "mergeWindows",
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]], hidden: true },
      { args: [[[1, 4], [2, 3]]], expected: [[1, 4]], hidden: true },
      { args: [[[5, 7]]], expected: [[5, 7]], hidden: true },
      { args: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], expected: [[1, 10]], hidden: true },
      { args: [[[9, 12], [1, 2], [3, 5], [4, 8]]], expected: [[1, 2], [3, 8], [9, 12]], hidden: true },
    ],
    starter: starter("mergeWindows", "intervals", "intervals: list[list[int]]", "vector<vector<int>> mergeWindows(vector<vector<int>>& intervals)", "int[][] mergeWindows(int[][] intervals)"),
    timeLimitMs: 1500,
    acceptance: 47.2,
  },
  {
    id: "rain-terrace",
    title: "Rain Over Terraces",
    difficulty: "Hard",
    topics: ["Two Pointers", "Arrays", "Monotonic Stack"],
    statement: [
      "An elevation map is given as an array `heights` of non-negative integers, where each bar has width 1.",
      "After a heavy rain, water settles between the bars. Compute how many units of water are trapped.",
    ],
    inputFormat: "An integer array `heights`.",
    outputFormat: "A single integer: the total units of trapped water.",
    constraints: ["1 ≤ heights.length ≤ 2 × 10⁴", "0 ≤ heights[i] ≤ 10⁵"],
    samples: [
      { input: "heights = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Six units settle in the four dips of the map." },
      { input: "heights = [4,2,0,3,2,5]", output: "9x" },
    ],
    functionName: "trappedWater",
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[1]], expected: 0, hidden: true },
      { args: [[5, 4, 3, 2, 1]], expected: 0, hidden: true },
      { args: [[2, 0, 2]], expected: 2, hidden: true },
      { args: [[3, 0, 0, 2, 0, 4]], expected: 10, hidden: true },
      { args: [[0, 7, 1, 4, 6]], expected: 7, hidden: true },
    ],
    starter: starter("trappedWater", "heights", "heights: list[int]", "int trappedWater(vector<int>& heights)", "int trappedWater(int[] heights)"),
    timeLimitMs: 1500,
    acceptance: 29.6,
  },
];

/** Reference solutions the simulated opponent "types" during a battle. They are real code and are executed by the same judge as yours. */
export const opponentSolutions: Record<string, string> = {
  "pair-sum": `function pairSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) {
      return [seen.get(need), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}
`,
  "longest-unique-run": `function longestUniqueRun(s) {
  const last = new Map();
  let best = 0;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
`,
  "merge-windows": `function mergeWindows(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      out.push([start, end]);
    }
  }
  return out;
}
`,
  "rain-terrace": `function trappedWater(heights) {
  let total = 0;
  for (let i = 1; i < heights.length - 1; i++) {
    let leftMax = 0, rightMax = 0;
    for (let l = i; l >= 0; l--) leftMax = Math.max(leftMax, heights[l]);
    for (let r = i; r < heights.length; r++) rightMax = Math.max(rightMax, heights[r]);
    total += Math.min(leftMax, rightMax) - heights[i];
  }
  return total;
}
`,
};

export const getProblem = (id?: string | null) => problems.find((p) => p.id === id) ?? problems[1]!;
