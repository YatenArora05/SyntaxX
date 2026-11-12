// Copies Monaco's AMD build into /public so the editor loads from our own
// origin instead of a CDN (works offline and behind strict firewalls).
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const pkg = join(process.cwd(), "node_modules", "monaco-editor");
const src = join(pkg, "min", "vs");
const dest = join(process.cwd(), "public", "monaco", "vs");

if (!existsSync(src)) {
  console.warn("[copy-monaco] monaco-editor/min/vs not found, skipping");
  process.exit(0);
}
mkdirSync(dirname(dest), { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("[copy-monaco] copied Monaco to public/monaco/vs");
