import { Fragment } from "react";
import { CodeView } from "@/components/shared/code-view";

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**")) return <strong key={i} className="font-semibold text-fg">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`")) return <code key={i} className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.86em] text-fg">{p.slice(1, -1)}</code>;
    if (p.startsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

/** Minimal markdown for chat replies: paragraphs, lists, bold, inline code and fenced code. */
export function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.startsWith("```")) code.push(lines[i++]!);
      i++;
      blocks.push(
        <div key={blocks.length} className="overflow-x-auto rounded-[12px] border border-line bg-ink px-2 py-3">
          <CodeView code={code.join("\n")} className="text-[12px]" />
        </div>,
      );
      continue;
    }
    if (/^\s*[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*] /.test(lines[i]!)) items.push(lines[i++]!.replace(/^\s*[-*] /, ""));
      blocks.push(
        <ul key={blocks.length} className="space-y-1.5 pl-1">
          {items.map((t, j) => <li key={j} className="flex gap-2.5"><span className="mt-[9px] size-1 shrink-0 rounded-full bg-lime" /><span>{inline(t)}</span></li>)}
        </ul>,
      );
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i]!)) items.push(lines[i++]!.replace(/^\d+\. /, ""));
      blocks.push(
        <ol key={blocks.length} className="space-y-1.5">
          {items.map((t, j) => <li key={j} className="flex gap-2.5"><span className="w-4 shrink-0 font-mono text-[12px] leading-[1.9] text-lime">{j + 1}</span><span>{inline(t)}</span></li>)}
        </ol>,
      );
      continue;
    }
    if (line.trim()) blocks.push(<p key={blocks.length}>{inline(line)}</p>);
    i++;
  }
  return <div className="space-y-3 text-[14.5px] leading-[1.7] text-fg/85">{blocks}</div>;
}
