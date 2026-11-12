"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarClock, DoorOpen, Flame, Swords, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge, LiveDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { Counter } from "@/components/shared/counter";
import { RatingChart } from "@/components/analytics/charts";
import { battleHistory, currentUser, friends, leaderboard, platformStats, userStats } from "@/lib/mock-data/players";
import { ratingHistory } from "@/lib/mock-data/analytics";
import { problems } from "@/lib/mock-data/problems";
import { useSession } from "@/lib/services/auth";
import { invitePlayer } from "@/lib/services/matchmaking";
import { cn, formatClock } from "@/lib/utils";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function ResetCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
      setLeft(Math.floor((next - now.getTime()) / 1000));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return <span className="font-mono tabular">--:--:--</span>;
  return <span className="font-mono tabular">{String(Math.floor(left / 3600)).padStart(2, "0")}:{formatClock(left % 3600)}</span>;
}

export function DashboardView() {
  const router = useRouter();
  const session = useSession();
  const [range, setRange] = useState<"8w" | "16w">("16w");
  const [invited, setInvited] = useState<string[]>([]);
  const daily = problems[3]!;
  const myRank = leaderboard.slice(0, 4);
  const chartData = range === "8w" ? ratingHistory.slice(-8) : ratingHistory;
  const ratingGain = chartData[chartData.length - 1]!.rating - chartData[0]!.rating;

  const stats = [
    { label: "Current rank", value: <>#<Counter value={currentUser.rank} /></>, sub: currentUser.tier },
    { label: "Total battles", value: <Counter value={userStats.totalBattles} />, sub: "since Aug 2025" },
    { label: "Wins", value: <Counter value={userStats.wins} />, sub: "+6 this week", lime: true },
    { label: "Losses", value: <Counter value={userStats.losses} />, sub: `${userStats.draws} draws` },
    { label: "Win rate", value: <Counter value={userStats.winRate} decimals={1} suffix="%" />, sub: "top 18%" },
    { label: "Current streak", value: <Counter value={userStats.streak} />, sub: `best ${userStats.bestStreak}`, icon: true },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="flex items-center gap-2 text-[13px] text-muted"><LiveDot /> {platformStats.online.toLocaleString("en-US")} developers online</p>
          <h1 className="mt-2 text-[clamp(28px,3.4vw,40px)] font-bold tracking-[-0.04em]">Welcome back, {session?.name ?? "Developer"}.</h1>
          <p className="mt-1 text-[15px] text-muted">You&apos;re 53 rating points from Platinum. Two ranked wins should do it.</p>
        </div>
      </motion.div>

      {/* stat strip */}
      <motion.dl variants={item} className="grid grid-cols-2 overflow-hidden rounded-[16px] border border-line bg-card sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("border-line p-4 sm:p-5", i > 0 && "border-l", i >= 2 && "max-sm:border-t", i % 2 === 0 && "max-sm:border-l-0", i >= 3 && "sm:max-xl:border-t", i === 3 && "sm:max-xl:border-l-0")}>
            <dt className="flex items-center gap-1.5 text-[12.5px] text-muted">
              {s.label} {s.icon && <Flame className="size-3.5 text-lime" />}
            </dt>
            <dd className={cn("mt-1.5 font-mono text-[26px] font-semibold tracking-[-0.04em] tabular", s.lime && "text-lime")}>{s.value}</dd>
            <dd className="text-[12px] text-muted">{s.sub}</dd>
          </div>
        ))}
      </motion.dl>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* left: actions + graph + recent */}
        <div className="space-y-6 xl:col-span-2">
          <motion.div variants={item} className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
            <Link
              href="/find-battle?mode=quick"
              className="group relative overflow-hidden rounded-[18px] border border-lime/30 bg-card p-6 transition-colors hover:border-lime/60"
            >
              <div aria-hidden className="bg-grid absolute inset-0 opacity-60 mask-fade-b" />
              <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-lime/10 blur-3xl transition-opacity group-hover:opacity-150" />
              <div className="relative">
                <span className="grid size-10 place-items-center rounded-[12px] bg-lime text-ink"><Swords className="size-5" /></span>
                <h2 className="mt-5 text-[22px] font-bold tracking-tight">Quick Match</h2>
                <p className="mt-1.5 max-w-xs text-[14px] text-muted">Get paired with a developer near 1847 and start within seconds.</p>
                <div className="mt-6 flex items-center gap-4 text-[12.5px] text-muted">
                  <span className="flex items-center gap-1.5"><LiveDot className="size-1.5" /> 214 searching</span>
                  <span>~6s wait</span>
                </div>
                <div className="mt-6 flex items-center">
                  {leaderboard.slice(8, 14).map((p, i) => (
                    <span key={p.id} className="-ml-2 first:ml-0 rounded-full ring-2 ring-card" style={{ zIndex: 10 - i }}>
                      <Avatar name={p.username} size={30} />
                    </span>
                  ))}
                  <span className="ml-3 text-[12.5px] text-muted">near your rating right now</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-lime">Find opponent <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </div>
            </Link>
            <div className="grid gap-4">
              <Link href="/create-room" className="group rounded-[18px] border border-line bg-card p-5 transition-colors hover:border-line-strong">
                <div className="flex items-center justify-between">
                  <DoorOpen className="size-5 text-fg/80" />
                  <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-lime" />
                </div>
                <h3 className="mt-4 font-semibold">Create Private Room</h3>
                <p className="mt-1 text-[13px] text-muted">Pick the problem and clock, then invite friends with a code.</p>
              </Link>
              <div className="rounded-[18px] border border-line bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px] text-muted"><CalendarClock className="size-4" /> Daily challenge</span>
                  <span className="text-[12px] text-muted">resets in <ResetCountdown /></span>
                </div>
                <h3 className="mt-3 font-semibold">{daily.title}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="solid">{daily.difficulty}</Badge>
                  <span className="text-[12px] text-muted">4,812 solved today</span>
                </div>
                <Button size="sm" variant="outline" className="mt-4 w-full" asChild>
                  <Link href={`/battle?problem=${daily.id}&mode=practice&d=30`}>Solve challenge</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Rating</CardTitle>
                  <p className="mt-0.5 text-[13px] text-muted">
                    <span className="font-mono text-lime">+{ratingGain}</span> over the last {range === "8w" ? "8" : "16"} weeks
                  </p>
                </div>
                <Segmented size="sm" value={range} onChange={setRange} options={[{ value: "8w", label: "8 weeks" }, { value: "16w", label: "16 weeks" }]} ariaLabel="Chart range" />
              </CardHeader>
              <CardContent className="pt-4">
                <RatingChart data={chartData} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Recent battles</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link href="/history">View all</Link></Button>
              </CardHeader>
              <CardContent className="px-2 pb-2 pt-3">
                <ul>
                  {battleHistory.slice(0, 5).map((b) => (
                    <li key={b.id}>
                      <Link href={`/history?battle=${b.id}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-white/[0.04] sm:grid-cols-[auto_1fr_auto_auto]">
                        <span className={cn("w-11 rounded-md py-0.5 text-center text-[11.5px] font-semibold", b.result === "win" ? "bg-lime text-ink" : "bg-white/[0.07] text-fg/80")}>
                          {b.result === "win" ? "Win" : b.result === "loss" ? "Loss" : "Draw"}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium">{b.problem}</span>
                          <span className="block truncate text-[12px] text-muted">vs {b.opponent.username} · {b.difficulty}</span>
                        </span>
                        <span className="hidden font-mono text-[12.5px] text-muted tabular sm:block">{b.yourTests[0]}/{b.yourTests[1]}</span>
                        <span className={cn("w-12 text-right font-mono text-[13px] tabular", b.ratingDelta > 0 ? "text-lime" : "text-muted")}>
                          {b.ratingDelta > 0 ? "+" : ""}{b.ratingDelta}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* right column */}
        <div className="space-y-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Global ranking</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link href="/leaderboard">Leaderboard</Link></Button>
              </CardHeader>
              <CardContent className="space-y-1 px-3 pb-3 pt-3">
                {myRank.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-[10px] px-2 py-2">
                    <span className={cn("w-6 font-mono text-[12.5px] tabular", p.rank <= 3 ? "text-lime" : "text-muted")}>{p.rank}</span>
                    <Avatar name={p.username} size={28} />
                    <span className="flex-1 truncate text-[13.5px]">{p.username}</span>
                    <span className="font-mono text-[13px] tabular">{p.rating}</span>
                  </div>
                ))}
                <div className="py-1 text-center text-muted">⋮</div>
                <div className="flex items-center gap-3 rounded-[10px] border border-lime/30 bg-lime-soft px-2 py-2">
                  <span className="w-6 font-mono text-[11px] text-lime tabular">{currentUser.rank}</span>
                  <Avatar name={session?.username ?? currentUser.username} size={28} ring />
                  <span className="flex-1 truncate text-[13.5px] font-medium">You</span>
                  <span className="font-mono text-[13px] font-semibold text-lime tabular">{currentUser.rating}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="size-4 text-muted" /> Friends</CardTitle>
                <span className="text-[12.5px] text-muted">{friends.filter((f) => f.online).length} online</span>
              </CardHeader>
              <CardContent className="space-y-1 px-3 pb-3 pt-3">
                {friends.map((f) => {
                  const busy = f.status === "in-battle";
                  const sent = invited.includes(f.username);
                  return (
                    <div key={f.id} className="flex items-center gap-3 rounded-[10px] px-2 py-2">
                      <Avatar name={f.username} size={32} online={f.online} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px]">{f.username}</div>
                        <div className="text-[12px] text-muted">
                          {!f.online ? "Offline" : busy ? "In a battle" : f.status === "searching" ? "Searching for a match" : "Online"}
                        </div>
                      </div>
                      {f.online && !busy && (
                        <Button
                          size="sm"
                          variant={sent ? "ghost" : "outline"}
                          disabled={sent}
                          onClick={async () => {
                            setInvited((x) => [...x, f.username]);
                            await invitePlayer(f.username);
                            toast(`Challenge sent to ${f.username}`, {
                              description: "We'll open the arena when they accept.",
                              action: { label: "Open room", onClick: () => router.push(`/create-room?invite=${f.username}`) },
                            });
                          }}
                        >
                          {sent ? "Sent" : "Challenge"}
                        </Button>
                      )}
                      {busy && (
                        <Button size="sm" variant="ghost" onClick={() => toast(`Spectating isn't open for ${f.username}'s battle`, { description: "They're in a ranked game with spectators turned off." })}>
                          Watch
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
