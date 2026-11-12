"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Lightbulb, Loader2, RefreshCw, Sparkles, Swords } from "lucide-react";
import { toast } from "sonner";
import type { Difficulty, Language } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { RichText } from "@/components/battle/problem-panel";
import { generateProblem, generatorTopics, type GeneratedProblem } from "@/lib/services/ai";
import { LANGUAGES } from "@/lib/constants";

export function ProblemGenerator() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [topic, setTopic] = useState(generatorTopics[0]!);
  const [language, setLanguage] = useState<Language>("javascript");
  const [time, setTime] = useState("20");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedProblem | null>(null);
  const [hints, setHints] = useState(0);

  const run = async () => {
    setLoading(true);
    setHints(0);
    const p = await generateProblem({ difficulty, topic, language, timeLimitMin: Number(time) });
    setResult(p);
    setLoading(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="h-fit space-y-5 p-5">
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Segmented className="w-full" value={difficulty} onChange={setDifficulty} ariaLabel="Difficulty" options={(["Easy", "Medium", "Hard"] as const).map((d) => ({ value: d, label: d }))} />
        </div>
        <div className="space-y-2">
          <Label>Topic</Label>
          <Select className="w-full" ariaLabel="Topic" value={topic} onValueChange={setTopic} options={generatorTopics.map((t) => ({ value: t, label: t }))} />
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <Select className="w-full" ariaLabel="Language" value={language} onValueChange={(v) => setLanguage(v as Language)} options={LANGUAGES.map((l) => ({ value: l.value, label: l.label }))} />
        </div>
        <div className="space-y-2">
          <Label>Time limit</Label>
          <Segmented className="w-full" value={time} onChange={setTime} ariaLabel="Time limit" options={["10", "20", "30", "45"].map((t) => ({ value: t, label: `${t}m` }))} />
        </div>
        <Button size="lg" className="w-full" onClick={run} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} {result ? "Generate another" : "Generate problem"}
        </Button>
      </Card>

      <Card className="min-h-[460px] p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4" aria-label="Generating problem">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-24 w-full rounded-[12px]" />
            </motion.div>
          ) : result ? (
            <motion.article key={result.title + result.difficulty} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={result.difficulty === "Hard" ? "solid" : "lime"}>{result.difficulty}</Badge>
                <Badge>{result.topic}</Badge>
                <Badge>{result.timeLimitMin} min</Badge>
                <Badge>{LANGUAGES.find((l) => l.value === result.language)?.label}</Badge>
              </div>
              <h2 className="mt-4 text-[26px] font-bold tracking-[-0.03em]">{result.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-fg/85"><RichText text={result.statement} /></p>
              <h3 className="mt-6 text-[13px] font-semibold">Example</h3>
              {result.examples.map((e, i) => (
                <div key={i} className="mt-2 rounded-[12px] border border-line bg-ink px-4 py-3 font-mono text-[12.5px]">
                  <div><span className="text-muted">Input </span>{e.input}</div>
                  <div><span className="text-muted">Output </span><span className="text-lime">{e.output}</span></div>
                </div>
              ))}
              <h3 className="mt-6 text-[13px] font-semibold">Constraints</h3>
              <ul className="mt-2 space-y-1 font-mono text-[12.5px] text-fg/80">{result.constraints.map((c) => <li key={c}>· {c}</li>)}</ul>
              <div className="mt-6 rounded-[12px] border border-line p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px] font-semibold"><Lightbulb className="size-4 text-lime" /> Hints</span>
                  <Button size="sm" variant="ghost" disabled={hints >= result.hints.length} onClick={() => setHints((h) => h + 1)}>
                    {hints >= result.hints.length ? "All hints shown" : `Reveal hint ${hints + 1}`}
                  </Button>
                </div>
                {hints > 0 && <ol className="mt-2 space-y-1.5 text-[13.5px] text-fg/80">{result.hints.slice(0, hints).map((h, i) => <li key={i}>{i + 1}. {h}</li>)}</ol>}
                <p className="mt-2 text-[12px] text-muted">Target: {result.expectedComplexity}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild><Link href={`/create-room`}><Swords /> Use in a private room</Link></Button>
                <Button variant="secondary" onClick={async () => { try { await navigator.clipboard.writeText(`${result.title}\n\n${result.statement}`); } catch {} toast("Problem copied"); }}><Copy /> Copy</Button>
                <Button variant="ghost" onClick={run}><RefreshCw /> Regenerate</Button>
              </div>
            </motion.article>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <span className="grid size-12 place-items-center rounded-[14px] border border-dashed border-line-strong text-muted"><Sparkles className="size-5" /></span>
              <p className="mt-4 font-medium">Generate a custom challenge</p>
              <p className="mt-1 max-w-sm text-[13.5px] text-muted">Pick a topic and difficulty. You&apos;ll get a statement, examples, constraints and staged hints.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
