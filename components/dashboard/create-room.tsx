"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Link2, Loader2, LogIn, Search, Shuffle, Swords, UserPlus } from "lucide-react";
import { toast } from "sonner";
import type { Difficulty, Language } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge, LiveDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/shared/page-header";
import { friends, leaderboard } from "@/lib/mock-data/players";
import { problems } from "@/lib/mock-data/problems";
import { createRoom, invitePlayer, joinRoom } from "@/lib/services/matchmaking";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type InviteState = "sent" | "joined";

export function CreateRoom() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("Friday night grudge match");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [problemId, setProblemId] = useState<string>("random");
  const [duration, setDuration] = useState("15");
  const [langs, setLangs] = useState<Language[]>(["javascript", "python", "cpp"]);
  const [spectators, setSpectators] = useState(true);
  const [room, setRoom] = useState<{ code: string } | null>(null);
  const [creating, setCreating] = useState(false);
  const [invites, setInvites] = useState<Record<string, InviteState>>({});
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string>();
  const [joining, setJoining] = useState(false);

  const pool = useMemo(() => {
    const all = [...friends, ...leaderboard.filter((p) => !friends.some((f) => f.id === p.id))];
    const q = query.trim().toLowerCase();
    return (q ? all.filter((p) => p.username.includes(q)) : all).slice(0, 7);
  }, [query]);

  const problemOptions = [
    { value: "random", label: `Random ${difficulty} problem` },
    ...problems.filter((p) => p.difficulty === difficulty).map((p) => ({ value: p.id, label: p.title })),
  ];

  const invite = async (username: string) => {
    setInvites((s) => ({ ...s, [username]: "sent" }));
    await invitePlayer(username);
    toast(`Invite sent to ${username}`);
    setTimeout(() => {
      setInvites((s) => (s[username] ? { ...s, [username]: "joined" } : s));
      toast(`${username} joined the room`);
    }, 2600);
  };

  const create = async () => {
    if (!name.trim()) return toast("Give your room a name first");
    if (!langs.length) return toast("Allow at least one language");
    setCreating(true);
    const r = await createRoom({ name, difficulty, durationMin: Number(duration), languages: langs, problemId, spectators });
    setRoom(r);
    setCreating(false);
    toast("Room created", { description: `Share code ${r.code} with your opponent.` });
    const pre = params.get("invite");
    if (pre) void invite(pre);
  };

  const copy = async (what: "code" | "link") => {
    const text = what === "code" ? room!.code : `https://devbattle.io/join/${room!.code}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(what);
    toast(what === "code" ? "Room code copied" : "Invite link copied");
    setTimeout(() => setCopied(null), 1500);
  };

  const joined = Object.entries(invites).find(([, s]) => s === "joined")?.[0];
  const start = () => {
    const pid = problemId === "random" ? (problems.find((p) => p.difficulty === difficulty) ?? problems[0]!).id : problemId;
    const q = new URLSearchParams({ problem: pid, opponent: joined!, mode: "private", d: duration, lang: langs[0]!, id: `BTL-${room!.code.replace("-", "")}` });
    router.push(`/battle?${q.toString()}`);
  };

  return (
    <div>
      <PageHeader title="Private room" description="Set the rules, share a code, and battle a friend on your terms." />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="p-6">
          <fieldset disabled={!!room} className="space-y-6 disabled:opacity-70">
            <div className="space-y-1.5">
              <Label htmlFor="room-name">Room name</Label>
              <Input id="room-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={48} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Segmented className="w-full" value={difficulty} onChange={(d) => { setDifficulty(d); setProblemId("random"); }} ariaLabel="Difficulty" options={(["Easy", "Medium", "Hard"] as const).map((d) => ({ value: d, label: d }))} />
              </div>
              <div className="space-y-2">
                <Label>Problem</Label>
                <Select className="w-full" ariaLabel="Problem" value={problemId} onValueChange={setProblemId} options={problemOptions} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Battle duration</Label>
              <Segmented className="w-full" value={duration} onChange={setDuration} ariaLabel="Duration" options={["10", "15", "20", "30", "45"].map((d) => ({ value: d, label: `${d} min` }))} />
            </div>
            <div className="space-y-2">
              <Label>Allowed languages</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => {
                  const on = langs.includes(l.value);
                  return (
                    <button
                      key={l.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setLangs((s) => (on ? s.filter((x) => x !== l.value) : [...s, l.value]))}
                      className={cn("inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors cursor-pointer", on ? "border-lime/50 bg-lime-soft text-lime" : "border-line-strong text-muted hover:text-fg")}
                    >
                      {on && <Check className="size-3.5" />} {l.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="flex items-center justify-between rounded-[12px] border border-line px-4 py-3.5">
              <span>
                <span className="block text-[14px] font-medium">Allow spectators</span>
                <span className="block text-[12.5px] text-muted">Anyone with the link can watch both editors live.</span>
              </span>
              <Switch checked={spectators} onCheckedChange={setSpectators} aria-label="Allow spectators" />
            </label>
          </fieldset>
          {!room && (
            <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={create} disabled={creating}>
              {creating ? <Loader2 className="animate-spin" /> : <Shuffle />} Create room
            </Button>
          )}
        </Card>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {room ? (
              <motion.div key="room" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="overflow-hidden border-lime/30">
                  <div className="p-6 text-center">
                    <Badge variant="lime"><LiveDot className="size-1.5" /> Room open</Badge>
                    <p className="mt-4 text-[13px] text-muted">Invitation code</p>
                    <button onClick={() => copy("code")} className="mt-1 inline-flex items-center gap-3 font-mono text-[34px] font-bold tracking-[0.06em] text-fg transition-colors hover:text-lime cursor-pointer" aria-label="Copy room code">
                      {room.code} {copied === "code" ? <Check className="size-5 text-lime" /> : <Copy className="size-5 text-muted" />}
                    </button>
                    <Button variant="secondary" size="sm" className="mt-3" onClick={() => copy("link")}>
                      {copied === "link" ? <Check /> : <Link2 />} Copy invite link
                    </Button>
                  </div>
                  <div className="border-t border-line bg-surface/50 p-5">
                    <div className="mb-3 flex items-center justify-between text-[13px]">
                      <span className="font-medium">Players</span>
                      <span className="text-muted">{joined ? "2/2 ready" : "1/2 · waiting"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar name="kernel_panic" size={36} ring />
                      <span className="text-[13px] font-medium">You (host)</span>
                      <span className="mx-auto text-[12px] font-black italic text-lime">VS</span>
                      {joined ? <><span className="text-[13px] font-medium">{joined}</span><Avatar name={joined} size={36} online /></> : <span className="grid size-9 place-items-center rounded-full border border-dashed border-line-strong"><Loader2 className="size-4 animate-spin text-muted" /></span>}
                    </div>
                    <Button size="lg" className="mt-5 w-full" disabled={!joined} onClick={start}><Swords /> {joined ? "Start battle" : "Waiting for an opponent"}</Button>
                    <button className="mt-3 w-full text-center text-[12.5px] text-muted hover:text-fg cursor-pointer" onClick={() => { setRoom(null); setInvites({}); toast("Room closed"); }}>Close room</button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="join" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="p-6">
                  <h2 className="font-semibold">Join with a code</h2>
                  <p className="mt-1 text-[13px] text-muted">Got a code from a friend? Enter it to jump into their room.</p>
                  <form
                    className="mt-4 flex gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setJoining(true);
                      setJoinError(undefined);
                      try {
                        const r = await joinRoom(joinCode);
                        router.push(`/battle?mode=private&id=${r.battleId}&opponent=${friends[0]!.username}`);
                      } catch (err) {
                        setJoinError((err as Error).message);
                        setJoining(false);
                      }
                    }}
                  >
                    <Input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="K7Q-4XMP" className="font-mono uppercase tracking-wider" aria-label="Room code" aria-invalid={!!joinError} maxLength={8} />
                    <Button type="submit" variant="secondary" className="h-11" disabled={joining || joinCode.length < 8}>{joining ? <Loader2 className="animate-spin" /> : <LogIn />} Join</Button>
                  </form>
                  {joinError && <p className="mt-2 text-[12.5px] text-fg/80" role="alert">{joinError}</p>}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="p-5">
            <h2 className="font-semibold">Invite friends</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by username" className="pl-9" aria-label="Search players" />
            </div>
            <ul className="mt-3 space-y-1">
              {pool.length === 0 && <li className="py-6 text-center text-[13px] text-muted">No players match &ldquo;{query}&rdquo;.</li>}
              {pool.map((p) => {
                const s = invites[p.username];
                return (
                  <li key={p.id} className="flex items-center gap-3 rounded-[10px] px-2 py-2">
                    <Avatar name={p.username} size={30} online={p.online} />
                    <span className="flex-1 truncate text-[13.5px]">{p.username}</span>
                    <span className="font-mono text-[12px] text-muted">{p.rating}</span>
                    <Button size="sm" variant={s ? "ghost" : "outline"} disabled={!room || !!s} onClick={() => invite(p.username)}>
                      {s === "joined" ? <><Check /> Joined</> : s === "sent" ? "Invited" : <><UserPlus /> Invite</>}
                    </Button>
                  </li>
                );
              })}
            </ul>
            {!room && <p className="mt-2 text-[12px] text-muted">Create the room first, then invite players.</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
