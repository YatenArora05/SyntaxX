"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Crown, Loader2, Search, Shield, Swords, X, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Difficulty, Language, Player } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge, LiveDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { PageHeader } from "@/components/shared/page-header";
import { currentUser, onlinePlayers } from "@/lib/mock-data/players";
import { findMatch, type MatchFound } from "@/lib/services/matchmaking";
import { LANGUAGES } from "@/lib/constants";
import { cn, formatClock } from "@/lib/utils";

type Mode = "quick" | "ranked" | "tournament";
type Stage = { kind: "idle" } | { kind: "searching"; since: number } | { kind: "found"; match: MatchFound };

function battleUrl(m: { opponent: Player; problemId: string; mode: string; language: Language; battleId?: string }) {
  const q = new URLSearchParams({ problem: m.problemId, opponent: m.opponent.username, mode: m.mode, lang: m.language });
  if (m.battleId) q.set("id", m.battleId);
  return `/battle?${q.toString()}`;
}

function Radar({ searching, players }: { searching: boolean; players: Player[] }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      {[1, 0.72, 0.44].map((s) => (
        <span key={s} className="absolute inset-0 m-auto rounded-full border border-line" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
      ))}
      {searching && (
        <>
          <span className="absolute inset-0 rounded-full border border-lime/60 animate-scan" />
          <span className="absolute inset-0 rounded-full border border-lime/60 animate-scan [animation-delay:0.8s]" />
          <span className="absolute inset-0 rounded-full border border-lime/60 animate-scan [animation-delay:1.6s]" />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "conic-gradient(from 0deg, rgb(183 247 0 / 0.22), transparent 25%)" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
          />
        </>
      )}
      {players.slice(0, 9).map((p, i) => {
        const angle = (i / 9) * Math.PI * 2 + 0.4;
        const r = 26 + ((i * 37) % 20);
        return (
          <motion.span
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + Math.cos(angle) * r}%`, top: `${50 + Math.sin(angle) * r}%` }}
            animate={searching ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.55 }}
            transition={{ repeat: searching ? Infinity : 0, duration: 2, delay: i * 0.2 }}
          >
            <Avatar name={p.username} size={26} />
          </motion.span>
        );
      })}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Avatar name={currentUser.username} size={56} ring />
      </span>
    </div>
  );
}

export function FindBattle() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = (params.get("mode") as Mode) || "quick";
  const [mode, setMode] = useState<Mode>(["quick", "ranked", "tournament"].includes(initial) ? initial : "quick");
  const [difficulty, setDifficulty] = useState<Difficulty | "Any">("Any");
  const [language, setLanguage] = useState<Language>("javascript");
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [now, setNow] = useState(0);
  const [registered, setRegistered] = useState(false);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (stage.kind !== "searching") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [stage.kind]);

  useEffect(() => {
    if (stage.kind !== "found") return;
    const t = setTimeout(() => router.push(battleUrl(stage.match)), 3200);
    return () => clearTimeout(t);
  }, [stage, router]);

  useEffect(() => () => abort.current?.abort(), []);

  const search = async () => {
    if (mode === "tournament") return;
    abort.current = new AbortController();
    setStage({ kind: "searching", since: Date.now() });
    setNow(Date.now());
    try {
      const match = await findMatch({ mode, difficulty, language, rating: currentUser.rating }, abort.current.signal);
      setStage({ kind: "found", match });
    } catch {
      setStage({ kind: "idle" });
    }
  };

  const cancel = () => {
    abort.current?.abort();
    toast("Search cancelled");
  };

  const waited = stage.kind === "searching" ? (now - stage.since) / 1000 : 0;
  const ratingWindow = mode === "ranked" ? Math.round(100 + waited * 15) : Math.round(300 + waited * 30);

  return (
    <div>
      <PageHeader title="Find a battle" description="Pick how you want to play. Matchmaking widens your rating window the longer you wait." />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* settings */}
        <Card className="h-fit p-5">
          <fieldset disabled={stage.kind !== "idle"} className="space-y-6 disabled:opacity-60">
            <div>
              <legend className="mb-2.5 text-[13px] font-medium">Mode</legend>
              <div className="grid gap-2">
                {([
                  { v: "quick", icon: Zap, t: "Quick match", d: "10 min · unrated" },
                  { v: "ranked", icon: Shield, t: "Ranked battle", d: "15 min · ±32 rating" },
                  { v: "tournament", icon: Crown, t: "Tournament", d: "Saturdays · 64 players" },
                ] as const).map((m) => (
                  <button
                    key={m.v}
                    type="button"
                    onClick={() => setMode(m.v)}
                    aria-pressed={mode === m.v}
                    className={cn(
                      "flex items-center gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-colors cursor-pointer",
                      mode === m.v ? "border-lime/50 bg-lime-soft" : "border-line hover:border-line-strong",
                    )}
                  >
                    <m.icon className={cn("size-[18px]", mode === m.v ? "text-lime" : "text-muted")} />
                    <span className="flex-1">
                      <span className="block text-[14px] font-medium">{m.t}</span>
                      <span className="block text-[12px] text-muted">{m.d}</span>
                    </span>
                    <span className={cn("size-4 rounded-full border-2", mode === m.v ? "border-lime bg-lime shadow-[inset_0_0_0_3px_#151915]" : "border-line-strong")} />
                  </button>
                ))}
              </div>
            </div>
            {mode !== "tournament" && (
              <>
                <div>
                  <div className="mb-2.5 text-[13px] font-medium">Difficulty</div>
                  <Segmented
                    className="w-full"
                    value={difficulty}
                    onChange={setDifficulty}
                    ariaLabel="Difficulty"
                    options={(["Any", "Easy", "Medium", "Hard"] as const).map((d) => ({ value: d, label: d }))}
                  />
                </div>
                <div>
                  <div className="mb-2.5 text-[13px] font-medium">Language</div>
                  <Select
                    className="w-full"
                    ariaLabel="Language"
                    value={language}
                    onValueChange={(v) => setLanguage(v as Language)}
                    options={LANGUAGES.map((l) => ({ value: l.value, label: l.label, hint: l.value === "javascript" ? "live judge" : "simulated" }))}
                  />
                </div>
              </>
            )}
          </fieldset>
          {mode === "tournament" ? (
            <Button
              size="lg"
              className="mt-6 w-full"
              variant={registered ? "secondary" : "primary"}
              onClick={() => {
                setRegistered((r) => !r);
                toast(registered ? "Registration withdrawn" : "You're registered for Saturday's tournament", {
                  description: registered ? undefined : "Check-in opens 30 minutes before 18:00 UTC.",
                });
              }}
            >
              <CalendarDays /> {registered ? "Withdraw registration" : "Register for Saturday"}
            </Button>
          ) : stage.kind === "searching" ? (
            <Button size="lg" variant="secondary" className="mt-6 w-full" onClick={cancel}><X /> Cancel search</Button>
          ) : (
            <Button size="lg" className="mt-6 w-full" onClick={search} disabled={stage.kind === "found"}>
              <Search /> Find opponent
            </Button>
          )}
        </Card>

        {/* stage */}
        <Card className="relative overflow-hidden p-6">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-50 mask-radial" />
          <AnimatePresence mode="wait">
            {mode === "tournament" ? (
              <motion.div key="tournament" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                <h2 className="text-xl font-semibold tracking-tight">Saturday Open · Week 46</h2>
                <p className="mt-1 text-[14px] text-muted">Single elimination, best of one, 20-minute rounds. Top 8 earn the Tournament Victor badge.</p>
                <div className="mt-8 grid grid-cols-4 gap-3">
                  {["Round of 64", "Round of 32", "Quarterfinal", "Final"].map((r, i) => (
                    <div key={r} className="space-y-2">
                      <div className="text-[12px] text-muted">{r}</div>
                      {Array.from({ length: 4 - i }, (_, j) => (
                        <div key={j} className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12px]" style={{ marginTop: i ? `${i * 14}px` : 0 }}>
                          <div className="flex justify-between"><span className="truncate">{onlinePlayers[(j * 2 + i) % onlinePlayers.length]!.username}</span><span className="text-muted">—</span></div>
                          <div className="mt-1 flex justify-between text-muted"><span className="truncate">{onlinePlayers[(j * 2 + i + 5) % onlinePlayers.length]!.username}</span><span>—</span></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[13px] text-muted">48 of 64 spots filled · seeding is by rating at check-in.</p>
              </motion.div>
            ) : stage.kind === "found" ? (
              <motion.div key="found" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative flex min-h-[420px] flex-col items-center justify-center text-center">
                <Badge variant="lime"><LiveDot className="size-1.5" /> Opponent found</Badge>
                <div className="mt-8 flex items-center gap-6 sm:gap-10">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar name={currentUser.username} size={72} ring />
                    <span className="font-semibold">You</span>
                    <span className="font-mono text-[12.5px] text-lime">{currentUser.rating}</span>
                  </div>
                  <motion.span initial={{ scale: 2.4, opacity: 0, rotate: -15 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="text-3xl font-black italic text-lime">VS</motion.span>
                  <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center gap-2">
                    <Avatar name={stage.match.opponent.username} size={72} />
                    <span className="font-semibold">{stage.match.opponent.username}</span>
                    <span className="font-mono text-[12.5px] text-muted">{stage.match.opponent.rating} · {stage.match.opponent.country.name}</span>
                  </motion.div>
                </div>
                <p className="mt-8 flex items-center gap-2 text-[13.5px] text-muted"><Loader2 className="size-4 animate-spin" /> Entering the arena…</p>
                <Button className="mt-4" onClick={() => router.push(battleUrl(stage.match))}><Swords /> Enter now</Button>
              </motion.div>
            ) : (
              <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative flex min-h-[420px] flex-col items-center justify-center">
                <Radar searching={stage.kind === "searching"} players={onlinePlayers} />
                <div className="mt-6 text-center" aria-live="polite">
                  {stage.kind === "searching" ? (
                    <>
                      <div className="font-mono text-[28px] font-semibold tabular">{formatClock(waited)}</div>
                      <p className="mt-1 text-[13.5px] text-muted">Searching within ±{ratingWindow} rating · {difficulty} · {LANGUAGES.find((l) => l.value === language)?.label}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[15px] font-medium">{onlinePlayers.length * 12} players in the {mode === "ranked" ? "ranked" : "quick"} queue</p>
                      <p className="mt-1 text-[13.5px] text-muted">Average wait right now is 6 seconds.</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* available players */}
      <Card className="mt-6">
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-[15px] font-semibold">Available players</h2>
          <span className="text-[12.5px] text-muted">Challenge someone directly</span>
        </div>
        <ul className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-3">
          {onlinePlayers.filter((p) => p.status !== "in-battle").slice(0, 9).map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-[12px] border border-line px-3 py-2.5">
              <Avatar name={p.username} size={34} online />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium">{p.username}</div>
                <div className="font-mono text-[12px] text-muted">{p.rating} · {p.country.code} · {p.status === "searching" ? "searching" : "idle"}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast(`${p.username} accepted your challenge`);
                  router.push(battleUrl({ opponent: p, problemId: ["pair-sum", "longest-unique-run", "merge-windows"][p.rating % 3]!, mode: "quick", language }));
                }}
              >
                Challenge
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
