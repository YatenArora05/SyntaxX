"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, RefreshCw, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Counter } from "@/components/shared/counter";
import { AccuracyChart, RatingChart, SolveTimeChart, TopicRadar, WinLossChart } from "./charts";
import { accuracyTrend, dailyResults, languageSplit, ratingHistory, recommendations, topicMastery, solveTimeByDifficulty } from "@/lib/mock-data/analytics";
import { userStats } from "@/lib/mock-data/players";
import { sleep } from "@/lib/utils";

export function AnalyticsView() {
  const [view, setView] = useState<"radar" | "list">("radar");
  const [refreshing, setRefreshing] = useState(false);
  const [order, setOrder] = useState(0);
  const strongest = topicMastery[0]!;
  const weakest = topicMastery[topicMastery.length - 1]!;
  const recs = [...recommendations.slice(order), ...recommendations.slice(0, order)];

  const regenerate = async () => {
    setRefreshing(true);
    await sleep(1200);
    setOrder((o) => (o + 1) % recommendations.length);
    setRefreshing(false);
  };

  const kpis = [
    { label: "Average solve time", value: <><Counter value={Math.floor(userStats.avgSolveSec / 60)} />m <Counter value={userStats.avgSolveSec % 60} />s</>, delta: "−48s vs last month", up: true },
    { label: "Accuracy", value: <Counter value={userStats.accuracy} decimals={1} suffix="%" />, delta: "+6.1 pts", up: true },
    { label: "Strongest topic", value: strongest.topic, delta: `${strongest.score}% mastery`, up: true, text: true },
    { label: "Weakest topic", value: weakest.topic, delta: `${weakest.score}% mastery`, up: false, text: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Your AI performance analyst reads every battle and tells you where the next 100 rating points are hiding." />

      <Card className="relative overflow-hidden border-lime/25">
        <div aria-hidden className="absolute -right-24 -top-24 size-64 rounded-full bg-lime/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center">
          <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-lime text-ink"><Sparkles className="size-5" /></span>
          <p className="flex-1 text-[15.5px] leading-relaxed text-fg/90">
            You&apos;re winning <span className="font-semibold text-lime">71%</span> of battles on array and hash-map problems but only <span className="font-semibold">38%</span> when the problem needs dynamic programming. Closing half that gap is worth roughly <span className="font-semibold text-lime">+60 rating</span> at your current volume.
          </p>
          <Button variant="outline" asChild><Link href="/ai-coach">Ask the coach</Link></Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="text-[12.5px] text-muted">{k.label}</div>
            <div className={k.text ? "mt-2 truncate text-[20px] font-semibold tracking-tight" : "mt-1.5 font-mono text-[28px] font-semibold tracking-[-0.04em] tabular"}>{k.value}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
              {k.up ? <TrendingUp className="size-3.5 text-lime" /> : <TrendingDown className="size-3.5" />} {k.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div><CardTitle>Rating trend</CardTitle><p className="text-[13px] text-muted">16 weeks · peak 1861</p></div>
          </CardHeader>
          <CardContent className="pt-4"><RatingChart data={ratingHistory} height={260} /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Topic mastery</CardTitle>
            <Segmented size="sm" value={view} onChange={setView} ariaLabel="Topic view" options={[{ value: "radar", label: "Radar" }, { value: "list", label: "List" }]} />
          </CardHeader>
          <CardContent className="pt-2">
            {view === "radar" ? (
              <TopicRadar data={topicMastery.slice(0, 8)} height={268} />
            ) : (
              <ul className="space-y-3 pt-2">
                {topicMastery.map((t) => (
                  <li key={t.topic}>
                    <div className="mb-1 flex justify-between text-[13px]"><span>{t.topic}</span><span className="font-mono text-muted tabular">{t.score}%</span></div>
                    <Progress value={t.score} barClassName={t.score < 50 ? "bg-fg/50" : "bg-lime"} label={`${t.topic} mastery`} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><div><CardTitle>Wins and losses</CardTitle><p className="text-[13px] text-muted">Last 14 days</p></div></CardHeader>
          <CardContent className="pt-4"><WinLossChart data={dailyResults} /></CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Accuracy</CardTitle><p className="text-[13px] text-muted">Overall vs accepted on first submit</p></div></CardHeader>
          <CardContent className="pt-4"><AccuracyChart data={accuracyTrend} /></CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Solve time by difficulty</CardTitle><p className="text-[13px] text-muted">You vs platform average, minutes</p></div></CardHeader>
          <CardContent className="pt-4"><SolveTimeChart data={solveTimeByDifficulty} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>By language</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            {languageSplit.map((l) => (
              <div key={l.language} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 text-[13px]">
                <span>{l.language}</span>
                <Progress value={l.winRate} label={`${l.language} win rate`} />
                <span className="w-28 text-right font-mono text-muted tabular">{l.winRate}% · {l.battles}</span>
              </div>
            ))}
            <p className="pt-2 text-[12.5px] text-muted">Win rate and battle count. Python lags by 11 points; most losses there are runtime, not correctness.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div><CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-lime" /> Personalised recommendations</CardTitle><p className="text-[13px] text-muted">Based on your last 50 battles</p></div>
          <Button variant="ghost" size="sm" onClick={regenerate} disabled={refreshing}><RefreshCw className={refreshing ? "animate-spin" : ""} /> Refresh insights</Button>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {refreshing
              ? [0, 1, 2].map((i) => <Skeleton key={`s${i}`} className="h-[190px] rounded-[14px]" />)
              : recs.map((r, i) => (
                  <motion.div key={r.title} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex flex-col rounded-[14px] border border-line bg-surface p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant={r.impact === "High" ? "lime" : "default"}>{r.impact} impact</Badge>
                      <span className="text-[12px] text-muted">{r.topic}</span>
                    </div>
                    <h3 className="mt-4 font-semibold">{r.title}</h3>
                    <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-muted">{r.detail}</p>
                    <Link href="/practice" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-fg hover:text-lime">Practise this <ArrowRight className="size-3.5" /></Link>
                  </motion.div>
                ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
