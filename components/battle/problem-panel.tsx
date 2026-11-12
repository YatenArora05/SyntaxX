import { Badge } from "@/components/ui/badge";
import type { Problem } from "@/types";

/** Renders `inline code` spans in problem text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") ? (
          <code key={i} className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.88em] text-fg">
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function ProblemPanel({ problem }: { problem: Problem }) {
  return (
    <div className="h-full overflow-y-auto px-5 py-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={problem.difficulty === "Hard" ? "solid" : problem.difficulty === "Medium" ? "lime" : "outline"}>
          {problem.difficulty}
        </Badge>
        {problem.topics.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <h1 className="mt-4 text-[22px] font-bold tracking-[-0.025em]">{problem.title}</h1>
      <p className="mt-1 text-[12.5px] text-muted">
        Acceptance {problem.acceptance}% · {problem.tests.filter((t) => t.hidden).length} hidden tests · {problem.timeLimitMs} ms limit
      </p>

      <div className="mt-5 space-y-3 text-[14.5px] leading-[1.7] text-fg/85">
        {problem.statement.map((p, i) => (
          <p key={i}>
            <RichText text={p} />
          </p>
        ))}
      </div>

      <h2 className="mt-7 text-[13px] font-semibold">Input</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-fg/80"><RichText text={problem.inputFormat} /></p>
      <h2 className="mt-5 text-[13px] font-semibold">Output</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-fg/80"><RichText text={problem.outputFormat} /></p>

      <h2 className="mt-7 text-[13px] font-semibold">Examples</h2>
      <div className="mt-2.5 space-y-3">
        {problem.samples.map((s, i) => (
          <div key={i} className="overflow-hidden rounded-[12px] border border-line bg-ink">
            <div className="border-b border-line px-3.5 py-2 text-[12px] text-muted">Example {i + 1}</div>
            <dl className="space-y-1.5 px-3.5 py-3 font-mono text-[12.5px] leading-relaxed">
              <div className="flex gap-3"><dt className="w-14 shrink-0 text-muted">Input</dt><dd className="break-all text-fg">{s.input}</dd></div>
              <div className="flex gap-3"><dt className="w-14 shrink-0 text-muted">Output</dt><dd className="text-lime">{s.output}</dd></div>
            </dl>
            {s.explanation && <p className="border-t border-line px-3.5 py-2.5 text-[13px] text-muted">{s.explanation}</p>}
          </div>
        ))}
      </div>

      <h2 className="mt-7 text-[13px] font-semibold">Constraints</h2>
      <ul className="mt-2.5 space-y-1.5">
        {problem.constraints.map((c) => (
          <li key={c} className="flex gap-2.5 font-mono text-[12.5px] text-fg/80">
            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-lime" />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
