"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, BrainCircuit, Check, Copy, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ChatMessage } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { coachReply } from "@/lib/services/ai";
import { battleHistory, currentUser } from "@/lib/mock-data/players";
import { Markdown } from "./markdown";
import { cn } from "@/lib/utils";

const prompts = [
  "Why did I lose my last battle?",
  "Explain time and space complexity of a sliding window",
  "Show me alternative approaches for Rain Over Terraces",
  "How do I optimise a solution that hits the time limit?",
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function CoachChat({ seed }: { seed?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || streaming) return;
    setInput("");
    const reply: ChatMessage = { id: uid(), role: "assistant", content: "", createdAt: Date.now() };
    setMessages((m) => [...m, { id: uid(), role: "user", content, createdAt: Date.now() }, reply]);
    setStreaming(true);
    abort.current = new AbortController();
    for await (const tok of coachReply(content, abort.current.signal)) {
      setMessages((m) => m.map((x) => (x.id === reply.id ? { ...x, content: x.content + tok } : x)));
    }
    setStreaming(false);
  };

  useEffect(() => {
    if (seed && !seeded.current) {
      seeded.current = true;
      void send(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const last = battleHistory.find((b) => b.result === "loss")!;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <Card className="flex h-[calc(100dvh-260px)] min-h-[520px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="flex items-center gap-2 text-[14px] font-medium"><BrainCircuit className="size-4 text-lime" /> Coach</span>
          <Tooltip content="Clear conversation">
            <Button variant="ghost" size="icon-sm" aria-label="Clear conversation" disabled={!messages.length || streaming} onClick={() => setConfirmClear(true)}><Trash2 /></Button>
          </Tooltip>
        </div>

        <div ref={scroller} className="flex-1 overflow-y-auto px-5 py-6" aria-live="polite">
          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
              <span className="grid size-12 place-items-center rounded-[14px] bg-lime-soft text-lime"><BrainCircuit className="size-6" /></span>
              <h2 className="mt-5 text-[22px] font-semibold tracking-tight">What do you want to get better at?</h2>
              <p className="mt-2 text-[14px] text-muted">Your coach knows your last 186 battles. Ask about a loss, a topic, or paste code for a review.</p>
              <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
                {prompts.map((p) => (
                  <button key={p} onClick={() => send(p)} className="rounded-[12px] border border-line bg-surface px-4 py-3 text-left text-[13.5px] text-fg/85 transition-colors hover:border-lime/40 hover:text-fg cursor-pointer">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="mx-auto max-w-3xl space-y-7">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.li key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3.5", m.role === "user" && "flex-row-reverse")}>
                    {m.role === "user" ? (
                      <Avatar name={currentUser.username} size={30} />
                    ) : (
                      <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-lime text-ink"><BrainCircuit className="size-4" /></span>
                    )}
                    <div className={cn("group min-w-0", m.role === "user" ? "max-w-[80%]" : "flex-1")}>
                      {m.role === "user" ? (
                        <div className="rounded-[14px] rounded-tr-[4px] bg-white/[0.07] px-4 py-2.5 text-[14.5px]">{m.content}</div>
                      ) : m.content ? (
                        <>
                          <Markdown text={m.content} />
                          {streaming && m.id === messages[messages.length - 1]?.id && <span className="ml-1 inline-block h-4 w-[2px] translate-y-0.5 bg-lime animate-caret" />}
                          {!(streaming && m.id === messages[messages.length - 1]?.id) && (
                            <button
                              onClick={async () => { try { await navigator.clipboard.writeText(m.content); } catch {} setCopied(m.id); setTimeout(() => setCopied(null), 1400); }}
                              className="mt-2 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] text-muted opacity-0 transition-opacity hover:text-fg group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                            >
                              {copied === m.id ? <Check className="size-3" /> : <Copy className="size-3" />} {copied === m.id ? "Copied" : "Copy"}
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex gap-1 pt-2.5">
                          {[0, 1, 2].map((d) => <span key={d} className="size-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />)}
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); void send(input); }}
          className="border-t border-line p-3"
        >
          <div className="flex items-end gap-2 rounded-[14px] border border-line-strong bg-surface p-2 focus-within:border-lime-line">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); }
              }}
              rows={1}
              placeholder="Ask about a problem, an approach, or paste your code…"
              className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-[14.5px] outline-none placeholder:text-muted/70"
              aria-label="Message the AI coach"
            />
            {streaming ? (
              <Button type="button" size="icon" variant="secondary" aria-label="Stop generating" onClick={() => { abort.current?.abort(); setStreaming(false); toast("Stopped"); }}><Square className="!size-3.5 fill-current" /></Button>
            ) : (
              <Button type="submit" size="icon" aria-label="Send message" disabled={!input.trim()}><ArrowUp /></Button>
            )}
          </div>
          <p className="mt-2 px-1 text-[11.5px] text-muted">Enter to send · Shift + Enter for a new line</p>
        </form>
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="text-[13px] font-semibold">Context the coach uses</h3>
          <dl className="mt-3 space-y-2.5 text-[13px]">
            <div className="flex justify-between"><dt className="text-muted">Rating</dt><dd className="font-mono text-lime">{currentUser.rating}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Weakest topic</dt><dd>Dynamic Programming</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Strongest topic</dt><dd>Hash Map</dd></div>
          </dl>
        </Card>
        <Card className="p-5">
          <h3 className="text-[13px] font-semibold">Last loss</h3>
          <p className="mt-2 text-[14px]">{last.problem}</p>
          <p className="text-[12.5px] text-muted">vs {last.opponent.username} · {last.yourTests[0]}/{last.yourTests[1]} tests</p>
          <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => send("Why did I lose my last battle?")} disabled={streaming}>Review this battle</Button>
        </Card>
      </div>

      <ConfirmDialog open={confirmClear} onOpenChange={setConfirmClear} title="Clear this conversation?" description="All messages in this chat will be removed." confirmLabel="Clear conversation" onConfirm={() => setMessages([])} />
    </div>
  );
}
