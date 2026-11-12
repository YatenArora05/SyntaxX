/**
 * Judge service.
 *
 * JavaScript submissions are genuinely executed: the code runs inside a sandboxed
 * Web Worker against the problem's test cases, with a hard timeout. Correctness and
 * runtime therefore come from real execution, never from the AI layer.
 *
 * Python, C++ and Java need a server-side judge (e.g. Judge0 or isolated containers).
 * Until `NEXT_PUBLIC_JUDGE_URL` is configured those languages use `simulateRun`, which
 * is clearly flagged with `executed: false` so the UI can label the numbers.
 */
import type { CaseResult, Language, Problem, RunResult, RunVerdict } from "@/types";
import { sleep } from "@/lib/utils";

const WORKER_SOURCE = `
const fmt = (v) => {
  try { return typeof v === "string" ? v : JSON.stringify(v); } catch { return String(v); }
};
self.onmessage = (e) => {
  const { code, fn, tests } = e.data;
  const logs = [];
  const sandboxConsole = {
    log: (...a) => logs.push(a.map(fmt).join(" ")),
    info: (...a) => logs.push(a.map(fmt).join(" ")),
    warn: (...a) => logs.push("warn: " + a.map(fmt).join(" ")),
    error: (...a) => logs.push("error: " + a.map(fmt).join(" ")),
  };
  let solve;
  try {
    solve = new Function("console", code + "\\n;return typeof " + fn + " === 'function' ? " + fn + " : undefined;")(sandboxConsole);
  } catch (err) {
    self.postMessage({ kind: "compile", error: String(err && err.message || err), logs });
    return;
  }
  if (typeof solve !== "function") {
    self.postMessage({ kind: "compile", error: "Function " + fn + "() is not defined. Keep the function name from the starter code.", logs });
    return;
  }
  const results = [];
  for (const t of tests) {
    const args = structuredClone(t.args);
    const t0 = performance.now();
    let out, status = "passed", err;
    try {
      out = solve(...args);
      if (fmt(out) !== fmt(t.expected)) status = "failed";
    } catch (ex) {
      status = "error";
      err = String(ex && ex.message || ex);
    }
    const timeMs = performance.now() - t0;
    results.push({ status, received: status === "error" ? err : fmt(out), timeMs });
  }
  self.postMessage({ kind: "done", results, logs });
};
`;

let workerUrl: string | null = null;
function getWorkerUrl() {
  if (!workerUrl) workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  return workerUrl;
}

const fmt = (v: unknown) => JSON.stringify(v);
const describeArgs = (args: unknown[], problem: Problem) => {
  const names = problem.starter.javascript.match(/function \w+\(([^)]*)\)/)?.[1]?.split(",").map((s) => s.trim()) ?? [];
  return args.map((a, i) => `${names[i] ?? `arg${i}`} = ${fmt(a)}`).join(", ");
};

/** Browsers don't expose per-worker heap usage, so memory is a stable estimate from code + input size. */
function estimateMemory(code: string, problem: Problem) {
  const inputBytes = JSON.stringify(problem.tests.map((t) => t.args)).length;
  const structures = (code.match(/new (Map|Set|Array)|\[\]|\{\}/g) ?? []).length;
  return Math.round((38.6 + structures * 0.35 + inputBytes / 2048 + (code.length % 97) / 120) * 10) / 10;
}

function verdictFor(cases: CaseResult[]): RunVerdict {
  if (cases.some((c) => c.status === "timeout")) return "Time Limit Exceeded";
  if (cases.some((c) => c.status === "error")) return "Runtime Error";
  if (cases.some((c) => c.status === "failed")) return "Wrong Answer";
  return "Accepted";
}

export async function runJavaScript(code: string, problem: Problem, mode: "run" | "submit"): Promise<RunResult> {
  const tests = mode === "run" ? problem.tests.filter((t) => !t.hidden) : problem.tests;
  const started = performance.now();

  const payload = await new Promise<
    | { kind: "done"; results: { status: "passed" | "failed" | "error"; received: string; timeMs: number }[]; logs: string[] }
    | { kind: "compile"; error: string; logs: string[] }
    | { kind: "timeout" }
  >((resolve) => {
    const worker = new Worker(getWorkerUrl());
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ kind: "timeout" });
    }, Math.max(2000, problem.timeLimitMs * 2));
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ kind: "compile", error: e.message, logs: [] });
    };
    worker.postMessage({ code, fn: problem.functionName, tests: tests.map((t) => ({ args: t.args, expected: t.expected })) });
  });

  // Keep a minimum perceptible "judging" time so the UI state is readable.
  const elapsed = performance.now() - started;
  if (elapsed < 450) await sleep(450 - elapsed);

  if (payload.kind === "compile") {
    return {
      verdict: "Compilation Error",
      mode,
      cases: [],
      passed: 0,
      total: tests.length,
      runtimeMs: 0,
      memoryMb: 0,
      executed: true,
      console: payload.logs,
      error: payload.error,
    };
  }

  const cases: CaseResult[] = tests.map((t, i) => {
    const r = payload.kind === "done" ? payload.results[i] : undefined;
    return {
      index: i,
      hidden: !!t.hidden,
      status: r ? r.status : "timeout",
      input: describeArgs(t.args, problem),
      expected: fmt(t.expected),
      received: r ? r.received : "—",
      timeMs: r ? r.timeMs : problem.timeLimitMs,
    };
  });

  const passed = cases.filter((c) => c.status === "passed").length;
  const runtime = cases.reduce((s, c) => s + c.timeMs, 0);
  return {
    verdict: verdictFor(cases),
    mode,
    cases,
    passed,
    total: tests.length,
    // Wall-clock time of the whole suite inside the worker (not including worker start-up).
    runtimeMs: Math.max(0.01, Math.round(runtime * 100) / 100),
    memoryMb: estimateMemory(code, problem),
    executed: true,
    console: payload.kind === "done" ? payload.logs : [],
    error: payload.kind === "timeout" ? `Execution exceeded ${Math.max(2000, problem.timeLimitMs * 2)} ms. Look for an infinite loop.` : undefined,
  };
}

/** Placeholder judge for non-JS languages until a backend judge is connected. */
export async function simulateRun(code: string, problem: Problem, mode: "run" | "submit", language: Language): Promise<RunResult> {
  await sleep(900 + Math.random() * 500);
  const tests = mode === "run" ? problem.tests.filter((t) => !t.hidden) : problem.tests;
  const body = code.replace(/\s+/g, "");
  const looksEmpty = body.length < 140 || /pass$|\{\}\};?$/.test(body);
  const cases: CaseResult[] = tests.map((t, i) => {
    const ok = !looksEmpty && (i < 2 || Math.random() > 0.12);
    return {
      index: i,
      hidden: !!t.hidden,
      status: ok ? "passed" : "failed",
      input: describeArgs(t.args, problem),
      expected: fmt(t.expected),
      received: ok ? fmt(t.expected) : looksEmpty ? "null" : "—",
      timeMs: 2 + Math.random() * 6,
    };
  });
  const passed = cases.filter((c) => c.status === "passed").length;
  const base = { cpp: 12, java: 64, python: 88, javascript: 40 }[language];
  return {
    verdict: verdictFor(cases),
    mode,
    cases,
    passed,
    total: tests.length,
    runtimeMs: Math.round((base + Math.random() * 30) * 100) / 100,
    memoryMb: Math.round(({ cpp: 9, java: 44, python: 17, javascript: 39 }[language] + Math.random() * 4) * 10) / 10,
    executed: false,
    console: [`[simulated] ${language} requires the backend judge. Results below are illustrative.`],
  };
}

export async function judge(code: string, problem: Problem, mode: "run" | "submit", language: Language) {
  return language === "javascript" ? runJavaScript(code, problem, mode) : simulateRun(code, problem, mode, language);
}
