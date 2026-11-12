"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Brain, CalendarDays, Crown, Flame, MapPin, Pencil, Share2, Swords, Target, Timer, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { achievements, battleHistory, currentUser, userStats } from "@/lib/mock-data/players";
import { languageSplit, topicMastery } from "@/lib/mock-data/analytics";
import { useSession } from "@/lib/services/auth";
import { cn } from "@/lib/utils";

const icons = { flame: Flame, zap: Zap, trophy: Trophy, target: Target, brain: Brain, swords: Swords, timer: Timer, crown: Crown };

export function Profile() {
  const session = useSession();
  const name = session?.username ?? currentUser.username;
  const [tab, setTab] = useState("overview");
  const tierFloor = 1600, tierCeil = 1900;
  const tierPct = ((currentUser.rating - tierFloor) / (tierCeil - tierFloor)) * 100;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-32 mask-fade-b" />
        <div aria-hidden className="seam absolute inset-y-0 right-[30%] hidden w-px opacity-40 md:block" />
        <CardContent className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end">
          <Avatar name={name} size={104} ring online />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[30px] font-bold tracking-[-0.035em]">{name}</h1>
              <Badge variant="lime">{currentUser.tier}</Badge>
            </div>
            <p className="mt-1 max-w-xl text-[14.5px] text-muted">{currentUser.bio}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-muted">
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {currentUser.country.name}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Joined August 2025</span>
              <span className="flex items-center gap-1.5"><Swords className="size-3.5" /> Mostly {currentUser.favouriteLanguage}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={async () => { try { await navigator.clipboard.writeText(`https://devbattle.io/u/${name}`); } catch {} toast("Profile link copied"); }}><Share2 /> Share</Button>
            <Button variant="outline" asChild><Link href="/settings"><Pencil /> Edit profile</Link></Button>
          </div>
        </CardContent>
        <div className="relative grid grid-cols-2 border-t border-line md:grid-cols-5">
          {[
            ["Rating", currentUser.rating, true],
            ["Global rank", `#${currentUser.rank.toLocaleString("en-US")}`],
            ["Battles", userStats.totalBattles],
            ["Wins / losses", `${userStats.wins} / ${userStats.losses}`],
            ["Problems solved", userStats.problemsSolved],
          ].map(([label, value, lime], i) => (
            <div key={String(label)} className={cn("px-6 py-4", i && "border-l border-line", i === 2 && "max-md:border-l-0 max-md:border-t", i > 2 && "max-md:border-t")}>
              <div className="text-[12px] text-muted">{label}</div>
              <div className={cn("mt-1 font-mono text-[22px] font-semibold tracking-tight tabular", lime && "text-lime")}>{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between text-[13px]">
          <span><span className="font-medium">{currentUser.tier}</span> <span className="text-muted">→ Platinum at 1900</span></span>
          <span className="font-mono text-muted tabular">{tierCeil - currentUser.rating} to go</span>
        </div>
        <Progress value={tierPct} className="mt-3 h-2" label="Progress to next tier" />
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-5 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative space-y-4 border-l border-line pl-5">
                {battleHistory.slice(0, 6).map((b) => (
                  <li key={b.id} className="relative">
                    <span className={cn("absolute -left-[25px] top-1.5 size-2 rounded-full ring-4 ring-card", b.result === "win" ? "bg-lime" : "bg-muted")} />
                    <div className="text-[14px]">
                      {b.result === "win" ? "Beat" : b.result === "loss" ? "Lost to" : "Drew with"} <span className="font-medium">{b.opponent.username}</span> on {b.problem}
                    </div>
                    <div className="text-[12px] text-muted">
                      {b.yourTests[0]}/{b.yourTests[1]} tests · <span className={b.ratingDelta > 0 ? "text-lime" : ""}>{b.ratingDelta > 0 ? "+" : ""}{b.ratingDelta} rating</span>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Languages</CardTitle></CardHeader>
              <CardContent className="space-y-3.5">
                {languageSplit.map((l) => (
                  <div key={l.language}>
                    <div className="mb-1.5 flex justify-between text-[13px]"><span>{l.language}</span><span className="font-mono text-muted tabular">{l.battles} battles · {l.winRate}% won</span></div>
                    <Progress value={(l.battles / 92) * 100} label={`${l.language} battles`} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top topics</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {topicMastery.slice(0, 6).map((t) => (
                  <span key={t.topic} className="rounded-full border border-line-strong px-3 py-1 text-[12.5px]">
                    {t.topic} <span className="ml-1 font-mono text-lime">{t.score}</span>
                  </span>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="achievements" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a, i) => {
              const Icon = icons[a.icon];
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className={cn("h-full p-5", a.unlocked ? "border-lime/30" : "opacity-80")}>
                    <span className={cn("grid size-11 place-items-center rounded-[12px]", a.unlocked ? "bg-lime text-ink" : "border border-dashed border-line-strong text-muted")}>
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-semibold">{a.title}</h3>
                    <p className="mt-1 text-[13px] text-muted">{a.description}</p>
                    {a.unlocked ? (
                      <p className="mt-4 text-[12px] font-medium text-lime">Unlocked</p>
                    ) : (
                      <div className="mt-4">
                        <div className="mb-1.5 flex justify-between text-[12px] text-muted"><span>In progress</span><span className="font-mono">{a.progress}%</span></div>
                        <Progress value={a.progress ?? 0} label={`${a.title} progress`} barClassName="bg-fg/60" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
