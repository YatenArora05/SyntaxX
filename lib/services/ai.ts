/**
 * AI services (mock implementations).
 *
 * Each function has the same signature a real LLM-backed endpoint would have, so swapping
 * in `fetch("/api/ai/...")` later touches only this file. The judge analysis below uses a
 * small static analyser over the submitted code, so its comments reflect the actual code.
 */
import type { AiEvaluation, Difficulty, Language, RunResult } from "@/types";
import { sleep } from "@/lib/utils";

/* ---------------------------------------------------------------- analysis */

export interface CodeProfile {
  time: string;
  space: string;
  loopDepth: number;
  usesHash: boolean;
  sorts: boolean;
  recursion: boolean;
  lines: number;
  longestLine: number;
  comments: number;
  descriptiveNames: number;
  guards: number;
}

export function profileCode(code: string, fnName = ""): CodeProfile {
  const lines = code.split("\n").filter((l) => l.trim().length);
  let depth = 0;
  let maxDepth = 0;
  const loopStack: number[] = [];
  let braces = 0;
  for (const line of lines) {
    const isLoop = /\b(for|while)\s*\(/.test(line) || /\bfor\b.*\bin\b/.test(line);
    if (isLoop) {
      depth++;
      maxDepth = Math.max(maxDepth, depth);
      loopStack.push(braces);
    }
    braces += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
    // single-line loop bodies (no braces) close immediately
    if (isLoop && !line.includes("{")) {
      depth--;
      loopStack.pop();
    }
    while (loopStack.length && braces <= loopStack[loopStack.length - 1]!) {
      loopStack.pop();
      depth--;
    }
  }
  const usesHash = /new (Map|Set)|\{\}|dict\(|unordered_map|HashMap|set\(/.test(code);
  const sorts = /\.sort\(|sorted\(|sort\(/.test(code);
  const recursion = fnName ? new RegExp(`\\b${fnName}\\s*\\(`, "g").test(code.split("\n").slice(1).join("\n")) : false;

  let time = "O(1)";
  if (maxDepth >= 3) time = "O(n³)";
  else if (maxDepth === 2) time = "O(n²)";
  else if (sorts) time = "O(n log n)";
  else if (maxDepth === 1) time = "O(n)";

  const space = usesHash || /\[\.\.\.|\.slice\(|\.map\(|push\(/.test(code) ? "O(n)" : "O(1)";
  const names = code.match(/\b(const|let|var)\s+([A-Za-z_]\w*)/g) ?? [];
  const descriptive = names.filter((n) => (n.split(/\s+/)[1] ?? "").length > 2).length;

  return {
    time,
    space,
    loopDepth: maxDepth,
    usesHash,
    sorts,
    recursion,
    lines: lines.length,
    longestLine: Math.max(0, ...lines.map((l) => l.length)),
    comments: (code.match(/\/\/|\/\*|#\s/g) ?? []).length,
    descriptiveNames: names.length ? descriptive / names.length : 1,
    guards: (code.match(/if\s*\(\s*!|\.length\s*(===|<|<=)\s*[01]|=== undefined|== null|\?\?/g) ?? []).length,
  };
}

const rank: Record<string, number> = { "O(1)": 0, "O(log n)": 1, "O(n)": 2, "O(n log n)": 3, "O(n²)": 4, "O(n³)": 5 };

export async function aiJudge(input: {
  yourCode: string;
  opponentCode: string;
  you?: RunResult;
  opponent?: RunResult;
  functionName: string;
  opponentName: string;
}): Promise<AiEvaluation> {
  await sleep(1400);
  const a = profileCode(input.yourCode, input.functionName);
  const b = profileCode(input.opponentCode, input.functionName);
  const cmp = (x: number, y: number, lowerIsBetter = true): "you" | "opponent" | "even" =>
    x === y ? "even" : (x < y) === lowerIsBetter ? "you" : "opponent";

  const yp = input.you?.passed ?? 0;
  const op = input.opponent?.passed ?? 0;
  const total = input.you?.total ?? input.opponent?.total ?? 0;

  const readA = Math.round(a.descriptiveNames * 6 + Math.min(2, a.comments) + (a.longestLine < 90 ? 2 : 0));
  const readB = Math.round(b.descriptiveNames * 6 + Math.min(2, b.comments) + (b.longestLine < 90 ? 2 : 0));

  const technique = (p: CodeProfile) =>
    p.usesHash && p.loopDepth <= 1
      ? "Single pass with a hash lookup"
      : p.sorts
        ? "Sort, then linear sweep"
        : p.loopDepth >= 2
          ? "Nested brute-force scan"
          : p.recursion
            ? "Recursive decomposition"
            : p.lines < 3
              ? "No meaningful attempt"
              : "Linear scan";

  const criteria: AiEvaluation["criteria"] = [
    {
      key: "efficiency",
      label: "Algorithmic efficiency",
      you: technique(a),
      opponent: technique(b),
      edge: cmp(rank[a.time] ?? 9, rank[b.time] ?? 9),
    },
    { key: "time", label: "Time complexity", you: a.time, opponent: b.time, edge: cmp(rank[a.time] ?? 9, rank[b.time] ?? 9) },
    { key: "space", label: "Space complexity", you: a.space, opponent: b.space, edge: cmp(rank[a.space] ?? 9, rank[b.space] ?? 9) },
    { key: "readability", label: "Readability", you: `${readA}/10`, opponent: `${readB}/10`, edge: cmp(readA, readB, false) },
    {
      key: "optimisation",
      label: "Optimisation techniques",
      you: a.usesHash ? "Memoised lookups" : a.sorts ? "Pre-sorting" : "None detected",
      opponent: b.usesHash ? "Memoised lookups" : b.sorts ? "Pre-sorting" : "None detected",
      edge: cmp(Number(a.usesHash || a.sorts), Number(b.usesHash || b.sorts), false),
    },
    {
      key: "edges",
      label: "Edge-case handling",
      you: `${yp}/${total} tests incl. hidden`,
      opponent: `${op}/${total} tests incl. hidden`,
      edge: cmp(yp, op, false),
    },
  ];

  const better = rank[a.time]! < rank[b.time]! ? "you" : rank[a.time]! > rank[b.time]! ? "opponent" : null;
  const summary =
    yp !== op
      ? `${yp > op ? "Your" : `${input.opponentName}'s`} solution passed more test cases, which decides the battle on its own. ` +
        (better
          ? `It also ${better === (yp > op ? "you" : "opponent") ? "has" : "lacks"} the better asymptotic profile (${a.time} vs ${b.time}).`
          : `Both approaches run in ${a.time}, so the gap came from correctness on edge cases rather than the algorithm.`)
      : better
        ? `Both solutions are correct on every executed test. The difference is scalability: ${better === "you" ? "yours" : `${input.opponentName}'s`} runs in ${better === "you" ? a.time : b.time} while the other runs in ${better === "you" ? b.time : a.time}. On the full 10⁵-element constraint that is the difference between milliseconds and seconds.`
        : `Both solutions are correct and share the same ${a.time} time / ${a.space} space profile. The result was decided by measured runtime and how early each player submitted.`;

  const suggestions: string[] = [];
  if (a.loopDepth >= 2) suggestions.push("Your nested loops make this quadratic. Track what you've already seen in a Map or precompute prefix/suffix maxima to drop to O(n).");
  if (!a.usesHash && b.usesHash) suggestions.push("A hash map lookup replaces the inner scan entirely — it's the key idea in your opponent's solution.");
  if (a.comments === 0 && a.lines > 8) suggestions.push("A one-line comment explaining the invariant (what the window or pointer represents) makes the solution easier to verify under time pressure.");
  if (yp < total) suggestions.push("Some hidden tests failed. Re-check empty input, duplicates and touching boundaries before submitting.");
  if (!suggestions.length) suggestions.push("This is already optimal. To shave milliseconds, avoid creating intermediate arrays inside the loop.");

  return {
    summary,
    criteria,
    youComplexity: { time: a.time, space: a.space },
    opponentComplexity: { time: b.time, space: b.space },
    suggestions,
  };
}

/* ---------------------------------------------------------------- coach */

const coachLibrary: { match: RegExp; reply: string }[] = [
  {
    match: /complex|big ?o|o\(n|time|space/i,
    reply: `Here's a quick way to read complexity off your code:

**Time** — count how many times the innermost line runs.
- One loop over \`n\` items → **O(n)**
- A loop inside a loop over the same data → **O(n²)**
- Sorting first → **O(n log n)**, and that usually dominates whatever comes after

**Space** — count what you allocate that grows with the input.
- A \`Map\` or \`Set\` holding up to \`n\` entries → **O(n)**
- A few pointers or counters → **O(1)**

For *Longest Unique Run*, the sliding window touches each character at most twice (once when \`right\` passes it, once when \`left\` does), so it's **O(n)** time. The \`Map\` of last-seen positions holds at most one entry per distinct character, so space is **O(min(n, alphabet))**.

Want me to look at a specific solution of yours?`,
  },
  {
    match: /optimi[sz]e|faster|slow|tle|time limit/i,
    reply: `When a solution is too slow, check these in order:

1. **Remove the inner scan.** Most O(n²) → O(n) wins come from replacing "search the array again" with a hash lookup.
2. **Sort once, then sweep.** If order matters, sorting gives you O(n log n) and lets a single pass do the rest.
3. **Precompute.** Prefix sums, prefix maxima and suffix maxima turn repeated range work into O(1) reads.
4. **Avoid hidden copies.** \`slice\`, spread and \`concat\` inside a loop quietly add another factor of n.

Paste your code and I'll point at the exact line that's costing you.`,
  },
  {
    match: /mistake|wrong|fail|bug|why.*(lose|lost)/i,
    reply: `Looking at your last battle against **segfault_sara** (Merge Booking Windows):

- You passed **5/7** tests. Both failures were touching windows like \`[1,4]\` and \`[4,5]\`.
- Your merge condition used \`start < last[1]\`. It needs \`start <= last[1]\` so windows that touch also merge.
- Your runtime was fine — **0.9 ms** against her **0.7 ms** — so correctness alone cost you the round.

A habit that helps: before submitting, run one test where two items share a boundary value. It catches this whole class of off-by-one errors.`,
  },
  {
    match: /approach|altern|another way|different/i,
    reply: `For *Rain Over Terraces* there are three standard approaches, each a step up:

**1. Brute force — O(n²) time, O(1) space**
For every bar, scan left and right for the tallest walls. Simple, but times out at 2 × 10⁴ bars.

**2. Prefix and suffix maxima — O(n) time, O(n) space**
Precompute \`leftMax[i]\` and \`rightMax[i]\` in two passes. Water at \`i\` is \`min(leftMax[i], rightMax[i]) - h[i]\`.

**3. Two pointers — O(n) time, O(1) space**
Walk inward from both ends, always moving the side with the lower wall. That side's water level is already decided by its own max, so no arrays are needed.

\`\`\`js
let l = 0, r = h.length - 1, lm = 0, rm = 0, water = 0;
while (l < r) {
  if (h[l] < h[r]) { lm = Math.max(lm, h[l]); water += lm - h[l++]; }
  else             { rm = Math.max(rm, h[r]); water += rm - h[r--]; }
}
\`\`\`

The two-pointer version is the one to reach for in a battle.`,
  },
];

const fallbackReply = `Good question. Let me break it down the way I'd approach it in a battle:

1. **Restate the problem** in one sentence and write down the input size from the constraints — it tells you which complexities are allowed (10⁵ means O(n log n) or better).
2. **Solve a tiny example by hand** and notice what you keep recomputing.
3. **Pick the structure that removes the recomputation** — a hash map, a sorted order, a window, or a stack.
4. **List edge cases before coding**: empty input, a single element, duplicates, negatives, touching boundaries.

Tell me which problem you're working on, or paste your code, and I'll get specific.`;

export async function* coachReply(prompt: string, signal?: AbortSignal): AsyncGenerator<string> {
  const reply = coachLibrary.find((c) => c.match.test(prompt))?.reply ?? fallbackReply;
  await sleep(500);
  const tokens = reply.match(/\S+\s*|\s+/g) ?? [reply];
  for (const t of tokens) {
    if (signal?.aborted) return;
    yield t;
    await sleep(t.includes("\n") ? 30 : 12 + Math.random() * 18);
  }
}

/* ---------------------------------------------------------------- generator */

export interface GeneratedProblem {
  title: string;
  difficulty: Difficulty;
  topic: string;
  language: Language;
  timeLimitMin: number;
  statement: string;
  examples: { input: string; output: string }[];
  constraints: string[];
  hints: string[];
  expectedComplexity: string;
}

const bank: Record<string, Omit<GeneratedProblem, "difficulty" | "topic" | "language" | "timeLimitMin">[]> = {
  "Arrays": [
    {
      title: "Quiet Hours",
      statement: "A server logs request counts per minute in `load`. Find the length of the longest stretch of consecutive minutes whose total load is at most `budget`.",
      examples: [{ input: "load = [3,1,2,7,1,1], budget = 6", output: "3" }],
      constraints: ["1 ≤ load.length ≤ 10⁵", "0 ≤ load[i] ≤ 10⁴", "0 ≤ budget ≤ 10⁹"],
      hints: ["All loads are non-negative, so a window's sum only grows as it widens.", "Shrink from the left whenever the sum exceeds the budget."],
      expectedComplexity: "O(n) time, O(1) space",
    },
  ],
  "Graphs": [
    {
      title: "Relay Stations",
      statement: "There are `n` relay stations and a list of bidirectional `links`. A message starts at station 0. Return the minimum number of hops to reach every station, or -1 for unreachable stations.",
      examples: [{ input: "n = 4, links = [[0,1],[1,2],[0,3]]", output: "[0,1,2,1]" }],
      constraints: ["1 ≤ n ≤ 10⁵", "0 ≤ links.length ≤ 2 × 10⁵"],
      hints: ["Every link has the same cost.", "Breadth-first search visits stations in order of distance."],
      expectedComplexity: "O(n + m) time, O(n + m) space",
    },
  ],
  "Dynamic Programming": [
    {
      title: "Staircase Tokens",
      statement: "You climb a staircase of `n` steps, taking 1, 2 or 3 steps at a time. Step `i` holds `tokens[i]` tokens, collected when you land on it. Return the maximum tokens you can collect reaching the top.",
      examples: [{ input: "tokens = [5,-2,4,-10,3]", output: "12" }],
      constraints: ["1 ≤ n ≤ 10⁵", "−10⁴ ≤ tokens[i] ≤ 10⁴"],
      hints: ["The best total at step i depends only on the best totals at i-1, i-2 and i-3.", "Three rolling variables are enough."],
      expectedComplexity: "O(n) time, O(1) space",
    },
  ],
  "Strings": [
    {
      title: "Anagram Windows",
      statement: "Given strings `text` and `pattern`, return every starting index in `text` where a substring is an anagram of `pattern`.",
      examples: [{ input: 'text = "cbaebabacd", pattern = "abc"', output: "[0,6]" }],
      constraints: ["1 ≤ pattern.length ≤ text.length ≤ 3 × 10⁴", "Lowercase English letters only"],
      hints: ["A fixed-size window slides across text.", "Compare 26-letter counts incrementally instead of re-counting."],
      expectedComplexity: "O(n) time, O(1) space",
    },
  ],
  "Trees": [
    {
      title: "Widest Floor",
      statement: "Given the root of a binary tree, return the level with the greatest width, where width counts positions between the leftmost and rightmost non-null nodes, including nulls between them.",
      examples: [{ input: "root = [1,3,2,5,3,null,9]", output: "4" }],
      constraints: ["1 ≤ nodes ≤ 3000"],
      hints: ["Index nodes like a heap: children of i are 2i and 2i+1.", "Re-base indices per level to avoid overflow."],
      expectedComplexity: "O(n) time, O(w) space",
    },
  ],
};

export const generatorTopics = Object.keys(bank);

export async function generateProblem(opts: {
  difficulty: Difficulty;
  topic: string;
  language: Language;
  timeLimitMin: number;
}): Promise<GeneratedProblem> {
  await sleep(1300);
  const options = bank[opts.topic] ?? bank.Arrays!;
  const pick = options[Math.floor(Math.random() * options.length)]!;
  const scale = opts.difficulty === "Hard" ? ["Follow-up: answer q independent queries efficiently."] : [];
  return {
    ...pick,
    ...opts,
    constraints: [...pick.constraints, ...scale],
  };
}
