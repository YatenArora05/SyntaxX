"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, CircleDashed, Ghost, Search, Sparkles } from "lucide-react";
import type { Difficulty } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { PageHeader } from "@/components/shared/page-header";
import { problems } from "@/lib/mock-data/problems";
import { leaderboard } from "@/lib/mock-data/players";

const status: Record<string, "solved" | "attempted" | undefined> = { "pair-sum": "solved", "merge-windows": "attempted" };
const ghosts: Record<string, string> = { "pair-sum": "o1_hiro", "longest-unique-run": "heapqueen", "merge-windows": "segfault_sara", "rain-terrace": "lambda_lena" };

export function Practice() {
  const [diff, setDiff] = useState<Difficulty | "All">("All");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      problems.filter(
        (p) =>
          (diff === "All" || p.difficulty === diff) &&
          (!q.trim() || (p.title + p.topics.join(" ")).toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [diff, q],
  );

  return (
    <div>
      <PageHeader
        title="Practice arena"
        description="Solve at your own pace against a ghost: a replay of a top player's real solve, streamed into the right-hand editor."
        actions={
          <Button variant="secondary" asChild>
            <Link href="/ai-coach?tab=generator"><Sparkles /> Generate a problem</Link>
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented value={diff} onChange={setDiff} ariaLabel="Difficulty filter" options={(["All", "Easy", "Medium", "Hard"] as const).map((d) => ({ value: d, label: d }))} />
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search problems or topics" className="h-10 pl-9" aria-label="Search problems" />
        </div>
      </div>
      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium">No problems match these filters</p>
            <p className="mt-1 text-[13.5px] text-muted">Clear the search or pick another difficulty.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setQ(""); setDiff("All"); }}>Clear filters</Button>
          </div>
        ) : (
          <ul>
            {list.map((p, i) => {
              const s = status[p.id];
              const ghost = leaderboard.find((x) => x.username === ghosts[p.id])!;
              return (
                <li key={p.id} className={i ? "border-t border-line" : ""}>
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] md:grid-cols-[auto_1fr_auto_auto_auto]">
                    {s === "solved" ? <CheckCircle2 className="size-4 text-lime" aria-label="Solved" /> : s === "attempted" ? <CircleDashed className="size-4 text-fg/70" aria-label="Attempted" /> : <span className="size-4" />}
                    <div className="min-w-0">
                      <div className="font-medium">{p.title}</div>
                      <div className="mt-1 flex flex-wrap gap-1.5">{p.topics.map((t) => <span key={t} className="text-[12px] text-muted">{t}</span>)}</div>
                    </div>
                    <Badge className="hidden md:inline-flex" variant={p.difficulty === "Hard" ? "solid" : p.difficulty === "Medium" ? "lime" : "outline"}>{p.difficulty}</Badge>
                    <span className="hidden w-28 text-right text-[12.5px] text-muted md:block">{p.acceptance}% accepted</span>
                    <Button size="sm" variant={s === "solved" ? "outline" : "primary"} asChild>
                      <Link href={`/battle?problem=${p.id}&mode=practice&opponent=${ghost.username}&d=30`}>
                        <Ghost /> {s === "solved" ? "Re-run" : "Practice"}
                      </Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <p className="mt-4 text-[13px] text-muted">Practice battles are unrated. JavaScript solutions are executed in your browser; other languages use the simulated judge until the backend is connected.</p>
    </div>
  );
}
