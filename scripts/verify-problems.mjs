// Sanity-check: every reference solution passes its problem's tests.
import { readFileSync } from "node:fs";
const src = readFileSync("lib/mock-data/problems.ts", "utf8");
const js = src
  .replace(/import type[^\n]*\n/g, "")
  .replace(/: Problem\[\]/g, "")
  .replace(/: Record<string, string>/g, "")
  .replace(/\(\s*fn: string,[\s\S]*?\): Problem\["starter"\] =>/, "(fn, params, pyParams, cppSig, javaSig) =>")
  .replace(/export const getProblem[\s\S]*$/, "")
  .replace(/export /g, "");
const { problems, opponentSolutions } = new Function(js + "; return { problems, opponentSolutions };")();
for (const p of problems) {
  const fn = new Function(opponentSolutions[p.id] + `; return ${p.functionName};`)();
  const fails = p.tests.filter((t) => JSON.stringify(fn(...structuredClone(t.args))) !== JSON.stringify(t.expected));
  console.log(p.id, fails.length ? `FAIL ${JSON.stringify(fails)}` : `ok (${p.tests.length})`);
}
