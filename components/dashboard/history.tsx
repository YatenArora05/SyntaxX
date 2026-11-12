"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrainCircuit, Eye, RotateCcw, Search } from "lucide-react";
import type { BattleRecord } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { PageHeader } from "@/components/shared/page-header";
import { battleHistory } from "@/lib/mock-data/players";
import { problems } from "@/lib/mock-data/problems";
import { languageLabel } from "@/lib/constants";
import { cn, formatClock } from "@/lib/utils";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

function ResultPill({ r }: { r: BattleRecord["result"] }) {
  return (
    <span className={cn("inline-flex w-14 justify-center rounded-md py-0.5 text-[12px] font-semibold", r === "win" ? "bg-lime text-ink" : "bg-white/[0.07] text-fg/80")}>
      {r === "win" ? "Win" : r === "loss" ? "Loss" : "Draw"}
    </span>
  );
}

function Detail({ b }: { b: BattleRecord }) {
  const problem = problems.find((p) => p.title === b.problem)!;
  const rows: [string, string, string, "you" | "them" | null][] = [
    ["Tests passed", `${b.yourTests[0]}/${b.yourTests[1]}`, `${b.opponentTests[0]}/${b.opponentTests[1]}`, b.yourTests[0] > b.opponentTests[0] ? "you" : b.yourTests[0] < b.opponentTests[0] ? "them" : null],
    ["Execution time", `${b.runtimeMs} ms`, `${b.opponentRuntimeMs} ms`, b.runtimeMs < b.opponentRuntimeMs ? "you" : "them"],
  ];
  return (
    <div>
      <div className="flex items-center justify-between gap-4 rounded-[14px] border border-line bg-ink p-4">
        <span className="flex items-center gap-3"><Avatar name="kernel_panic" size={40} ring={b.result === "win"} /><span className="font-semibold">You</span></span>
        <ResultPill r={b.result} />
        <span className="flex items-center gap-3"><span className="font-semibold">{b.opponent.username}</span><Avatar name={b.opponent.username} size={40} ring={b.result === "loss"} /></span>
      </div>
      <dl className="mt-4 space-y-0">
        {rows.map(([label, a, c, best]) => (
          <div key={label} className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-line py-2.5 text-[14px]">
            <dd className={cn("font-mono tabular", best === "you" && "text-lime")}>{a}</dd>
            <dt className="text-center text-[12px] text-muted">{label}</dt>
            <dd className={cn("text-right font-mono tabular", best === "them" && "font-semibold")}>{c}</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
        {[
          ["Mode", b.mode],
          ["Language", languageLabel(b.language)],
          ["Duration", formatClock(b.durationSec)],
          ["Rating", `${b.ratingDelta > 0 ? "+" : ""}${b.ratingDelta}`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[10px] border border-line px-3 py-2">
            <dt className="text-[11.5px] text-muted">{k}</dt>
            <dd className="mt-0.5 font-medium capitalize">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild><Link href={`/battle?problem=${problem.id}&opponent=${b.opponent.username}&mode=${b.mode === "tournament" ? "ranked" : b.mode}`}><RotateCcw /> Rematch</Link></Button>
        <Button variant="secondary" asChild><Link href="/ai-coach?topic=last-battle"><BrainCircuit /> Review with AI Coach</Link></Button>
      </div>
    </div>
  );
}

export function History() {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");
  const [q, setQ] = useState("");
  const selectedId = params.get("battle");
  const selected = battleHistory.find((b) => b.id === selectedId);

  const rows = useMemo(
    () =>
      battleHistory.filter(
        (b) =>
          (filter === "all" || b.result === filter) &&
          (!q.trim() || (b.problem + b.opponent.username).toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [filter, q],
  );

  const wins = battleHistory.filter((b) => b.result === "win").length;

  return (
    <div>
      <PageHeader
        title="Battle history"
        description={`${battleHistory.length} battles in the last month · ${wins} wins · net ${battleHistory.reduce((s, b) => s + b.ratingDelta, 0) > 0 ? "+" : ""}${battleHistory.reduce((s, b) => s + b.ratingDelta, 0)} rating`}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented value={filter} onChange={setFilter} ariaLabel="Result filter" options={[{ value: "all", label: "All" }, { value: "win", label: "Wins" }, { value: "loss", label: "Losses" }]} />
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search problem or opponent" className="h-10 pl-9" aria-label="Search battles" />
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[14px]">
            <thead className="text-[12px] text-muted">
              <tr className="border-b border-line">
                <th className="px-5 py-3 text-left font-medium">Result</th>
                <th className="px-2 py-3 text-left font-medium">Opponent</th>
                <th className="px-2 py-3 text-left font-medium">Problem</th>
                <th className="px-2 py-3 text-left font-medium">Performance</th>
                <th className="px-2 py-3 text-left font-medium">Date (UTC)</th>
                <th className="px-2 py-3 text-right font-medium">Rating</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-line transition-colors hover:bg-white/[0.025]">
                  <td className="px-5 py-3"><ResultPill r={b.result} /></td>
                  <td className="px-2 py-3">
                    <span className="flex items-center gap-2.5"><Avatar name={b.opponent.username} size={28} /><span>{b.opponent.username}</span><span className="font-mono text-[12px] text-muted">{b.opponent.rating}</span></span>
                  </td>
                  <td className="px-2 py-3">
                    <div>{b.problem}</div>
                    <div className="text-[12px] text-muted">{b.difficulty} · {languageLabel(b.language)}</div>
                  </td>
                  <td className="px-2 py-3 font-mono text-[12.5px] tabular">
                    <span className={b.yourTests[0] === b.yourTests[1] ? "text-lime" : ""}>{b.yourTests[0]}/{b.yourTests[1]}</span>
                    <span className="text-muted"> · {b.runtimeMs} ms</span>
                  </td>
                  <td className="px-2 py-3 text-[13px] text-muted">{fmtDate(b.date)}</td>
                  <td className={cn("px-2 py-3 text-right font-mono tabular", b.ratingDelta > 0 ? "text-lime" : "text-muted")}>{b.ratingDelta > 0 ? "+" : ""}{b.ratingDelta}</td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => router.replace(`/history?battle=${b.id}`, { scroll: false })}><Eye /> View details</Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-16 text-center">
                  <p className="font-medium">No battles match</p>
                  <p className="mt-1 text-[13.5px] text-muted">Try another search, or play a battle to add to your history.</p>
                  <Button size="sm" className="mt-4" asChild><Link href="/find-battle">Find a battle</Link></Button>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog
        open={!!selected}
        onOpenChange={(o) => !o && router.replace("/history", { scroll: false })}
        title={selected ? `${selected.problem}` : "Battle"}
        description={selected ? `${selected.id} · ${fmtDate(selected.date)} UTC` : undefined}
        className="max-w-xl"
      >
        {selected && <Detail b={selected} />}
      </Dialog>
    </div>
  );
}
