import { cn } from "@/lib/utils";

const KEYWORDS = new Set([
  "function", "const", "let", "var", "return", "for", "while", "if", "else", "of", "in", "new", "class",
  "def", "self", "pass", "import", "from", "public", "int", "vector", "auto", "using", "namespace", "true", "false", "null",
]);

type Tok = { t: string; k: "kw" | "str" | "num" | "com" | "fn" | "txt" };

export function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  const re = /(\/\/.*$|#.*$|"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|`[^`]*`?|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b(?=\s*\()|\b[A-Za-z_]\w*\b|\s+|.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const t = m[0];
    let k: Tok["k"] = "txt";
    if (t.startsWith("//") || (t.startsWith("#") && !t.startsWith("#include"))) k = "com";
    else if (/^["'`]/.test(t)) k = "str";
    else if (/^\d/.test(t)) k = "num";
    else if (KEYWORDS.has(t)) k = "kw";
    else if (/^[A-Za-z_]\w*$/.test(t) && line.slice(m.index + t.length).trimStart().startsWith("(")) k = "fn";
    out.push({ t, k });
  }
  return out;
}

const tone: Record<Tok["k"], string> = {
  kw: "text-lime",
  str: "text-fg/50",
  num: "text-lime/75",
  com: "text-muted/60 italic",
  fn: "text-fg font-medium",
  txt: "text-fg/75",
};

/** Lightweight read-only code renderer (used where a full Monaco instance would be overkill). */
export function CodeView({
  code,
  caret,
  className,
  startLine = 1,
  minLines = 0,
}: {
  code: string;
  caret?: boolean;
  className?: string;
  startLine?: number;
  minLines?: number;
}) {
  const lines = code.split("\n");
  while (lines.length < minLines) lines.push("");
  return (
    <pre className={cn("font-mono text-[12.5px] leading-[1.7] tabular", className)}>
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="w-8 shrink-0 select-none pr-3 text-right text-muted/35">{startLine + i}</span>
          <code className="whitespace-pre">
            {tokenize(line).map((tk, j) => (
              <span key={j} className={tone[tk.k]}>
                {tk.t}
              </span>
            ))}
            {caret && i === code.split("\n").length - 1 && (
              <span aria-hidden className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-lime animate-caret" />
            )}
          </code>
        </div>
      ))}
    </pre>
  );
}
