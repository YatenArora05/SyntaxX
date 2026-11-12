"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, Crown, Minus, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { countries, currentUser, leaderboardFor, userStats } from "@/lib/mock-data/players";
import type { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly" | "all";

function Change({ v }: { v: number }) {
  if (!v) return <Minus className="size-3.5 text-muted" aria-label="No change" />;
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-mono text-[12px]", v > 0 ? "text-lime" : "text-muted")} aria-label={`${v > 0 ? "Up" : "Down"} ${Math.abs(v)}`}>
      {v > 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {Math.abs(v)}
    </span>
  );
}

function Podium({ top }: { top: LeaderboardEntry[] }) {
  const order = [top[1], top[0], top[2]].filter(Boolean) as LeaderboardEntry[];
  return (
    <div className="grid gap-4 md:grid-cols-3 md:items-end">
      {order.map((p) => {
        const first = p.rank === 1;
        return (
          <motion.div
            key={p.id + p.rank}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: first ? 0.05 : 0.15 }}
            className={cn(
              "relative overflow-hidden rounded-[20px] border bg-card p-6 text-center",
              first ? "border-lime/50 shadow-glow md:order-none md:pb-10 md:pt-10" : "border-line",
            )}
          >
            {first && <div aria-hidden className="bg-grid absolute inset-0 opacity-60 mask-fade-b" />}
            <div className="relative">
              <span className={cn("mx-auto grid size-8 place-items-center rounded-full font-mono text-[13px] font-bold", first ? "bg-lime text-ink" : "border border-line-strong text-fg")}>
                {first ? <Crown className="size-4" /> : p.rank}
              </span>
              <div className="mt-4 flex justify-center"><Avatar name={p.username} size={first ? 80 : 64} ring={first} /></div>
              <div className="mt-4 text-lg font-semibold tracking-tight">{p.username}</div>
              <div className="text-[12.5px] text-muted">{p.country.name} · {p.tier}</div>
              <div className={cn("mt-4 font-mono text-[28px] font-bold tracking-[-0.04em] tabular", first && "text-lime")}>{p.rating}</div>
              <div className="mt-3 flex justify-center gap-5 text-[12.5px] text-muted">
                <span><span className="font-mono text-fg">{p.wins}</span> wins</span>
                <span><span className="font-mono text-fg">{p.winRate}%</span> win rate</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function LeaderboardView() {
  const [period, setPeriod] = useState<Period>("all");
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const data = useMemo(() => leaderboardFor(period), [period]);
  const rows = data.filter((p) => (country === "all" || p.country.code === country) && p.username.includes(q.trim().toLowerCase()));

  const changePeriod = (p: Period) => {
    setLoading(true);
    setPeriod(p);
    setTimeout(() => setLoading(false), 450);
  };

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        description="Rankings update after every ranked battle. Ratings use Elo with a K-factor of 32."
        actions={
          <Segmented
            value={period}
            onChange={changePeriod}
            ariaLabel="Time period"
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "all", label: "All Time" },
            ]}
          />
        }
      />
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[300px] rounded-[20px]" />)}</div>
      ) : (
        <Podium top={data.slice(0, 3)} />
      )}

      <Card className="mt-8 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a developer" className="h-10 pl-9" aria-label="Search developers" />
          </div>
          <Select
            className="sm:w-48"
            ariaLabel="Country"
            value={country}
            onValueChange={setCountry}
            options={[{ value: "all", label: "All countries" }, ...Object.values(countries).map((c) => ({ value: c.code, label: c.name }))]}
          />
          <span className="text-[12.5px] text-muted sm:ml-auto">{rows.length} developers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead className="text-[12px] text-muted">
              <tr className="border-b border-line">
                <th className="w-20 px-5 py-3 text-left font-medium">Rank</th>
                <th className="px-2 py-3 text-left font-medium">Developer</th>
                <th className="px-2 py-3 text-left font-medium">Country</th>
                <th className="px-2 py-3 text-right font-medium">Wins</th>
                <th className="px-2 py-3 text-right font-medium">Win rate</th>
                <th className="px-2 py-3 text-right font-medium">Rating</th>
                <th className="w-20 px-5 py-3 text-right font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {loading
                  ? Array.from({ length: 8 }, (_, i) => (
                      <tr key={`s${i}`} className="border-b border-line"><td colSpan={7} className="px-5 py-3"><Skeleton className="h-6" /></td></tr>
                    ))
                  : rows.map((p) => (
                      <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-line transition-colors hover:bg-white/[0.025]">
                        <td className={cn("px-5 py-3 font-mono tabular", p.rank <= 3 ? "font-semibold text-lime" : "text-muted")}>{p.rank}</td>
                        <td className="px-2 py-3">
                          <span className="flex items-center gap-3">
                            <Avatar name={p.username} size={30} online={p.online} />
                            <span className="font-medium">{p.username}</span>
                            <span className="rounded-full border border-line px-2 text-[11px] text-muted">{p.tier}</span>
                          </span>
                        </td>
                        <td className="px-2 py-3 text-muted"><span className="mr-2 font-mono text-[12px] text-fg/70">{p.country.code}</span>{p.country.name}</td>
                        <td className="px-2 py-3 text-right font-mono tabular">{p.wins}</td>
                        <td className="px-2 py-3 text-right">
                          <span className="inline-flex items-center gap-2">
                            <span className="hidden h-1 w-14 overflow-hidden rounded-full bg-white/[0.07] lg:block"><span className="block h-full bg-lime" style={{ width: `${p.winRate}%` }} /></span>
                            <span className="font-mono tabular">{p.winRate}%</span>
                          </span>
                        </td>
                        <td className="px-2 py-3 text-right font-mono font-semibold tabular">{p.rating}</td>
                        <td className="px-5 py-3 text-right"><Change v={p.change} /></td>
                      </motion.tr>
                    ))}
              </AnimatePresence>
              {!loading && rows.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-14 text-center text-[13.5px] text-muted">No developers match. Try another name or country.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 border-t border-lime/30 bg-lime-soft px-5 py-3 text-[14px]">
          <span className="w-14 font-mono text-[12.5px] text-lime tabular">#{currentUser.rank}</span>
          <Avatar name={currentUser.username} size={30} ring />
          <span className="font-medium">You</span>
          <span className="ml-auto hidden text-muted sm:inline">{userStats.wins} wins · {userStats.winRate}%</span>
          <span className="font-mono font-semibold text-lime tabular">{currentUser.rating}</span>
        </div>
      </Card>
    </div>
  );
}
