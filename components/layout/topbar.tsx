"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DropdownMenu, Popover } from "radix-ui";
import { AnimatePresence, motion } from "motion/react";
import { Bell, CornerDownLeft, LogOut, Menu, Search, Settings, Swords, User, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Logo } from "@/components/shared/logo";
import { currentUser, leaderboard } from "@/lib/mock-data/players";
import { problems } from "@/lib/mock-data/problems";
import { signOut, useSession } from "@/lib/services/auth";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";
import { SidebarNav } from "./sidebar";

const initialNotifications = [
  { id: 1, text: "segfault_sara challenged you to a private battle", time: "2m", unread: true, href: "/create-room" },
  { id: 2, text: "You climbed 14 places on the weekly leaderboard", time: "1h", unread: true, href: "/leaderboard" },
  { id: 3, text: "Saturday tournament registration closes in 6 hours", time: "3h", unread: false, href: "/find-battle?mode=tournament" },
];

function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const items = useMemo(() => {
    const all = [
      ...NAV.map((n) => ({ label: n.label, hint: "Page", href: n.href })),
      ...problems.map((p) => ({ label: p.title, hint: `Practice · ${p.difficulty}`, href: `/battle?problem=${p.id}&mode=practice` })),
      ...leaderboard.slice(0, 12).map((p) => ({ label: p.username, hint: `Player · ${p.rating}`, href: `/create-room?invite=${p.username}` })),
    ];
    const s = q.trim().toLowerCase();
    return (s ? all.filter((i) => i.label.toLowerCase().includes(s)) : all).slice(0, 8);
  }, [q]);

  const go = (href: string) => {
    onOpenChange(false);
    setQ("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Search Dev Battle" className="max-w-xl p-0 [&>div:first-child]:sr-only">
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(items.length - 1, c + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
            if (e.key === "Enter" && items[cursor]) go(items[cursor].href);
          }}
          placeholder="Search pages, problems and players…"
          className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted/70"
          aria-label="Search"
        />
      </div>
      <ul className="max-h-[360px] overflow-y-auto p-2" role="listbox">
        {items.length === 0 && <li className="px-3 py-8 text-center text-[13.5px] text-muted">Nothing matches &ldquo;{q}&rdquo;. Try a problem title or a username.</li>}
        {items.map((i, idx) => (
          <li key={i.href + i.label} role="option" aria-selected={idx === cursor}>
            <button
              onMouseEnter={() => setCursor(idx)}
              onClick={() => go(i.href)}
              className={cn("flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[14px] cursor-pointer", idx === cursor && "bg-white/[0.06]")}
            >
              <span>{i.label}</span>
              <span className="flex items-center gap-2 text-[12px] text-muted">{i.hint}{idx === cursor && <CornerDownLeft className="size-3" />}</span>
            </button>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}

export function Topbar() {
  const router = useRouter();
  const session = useSession();
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [notes, setNotes] = useState(initialNotifications);
  const unread = notes.filter((n) => n.unread).length;
  const name = session?.username ?? currentUser.username;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-ink/80 px-4 backdrop-blur-xl sm:px-6">
        <button className="rounded-md p-2 lg:hidden cursor-pointer" aria-label="Open navigation" onClick={() => setDrawer(true)}>
          <Menu className="size-5" />
        </button>
        <button
          onClick={() => setPalette(true)}
          className="flex h-9 w-full max-w-[320px] items-center gap-2.5 rounded-[10px] border border-line bg-surface px-3 text-[13.5px] text-muted transition-colors hover:border-line-strong cursor-pointer"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="hidden rounded border border-line-strong px-1.5 font-mono text-[11px] sm:inline">⌘K</kbd>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/find-battle"><Swords /> Battle now</Link>
          </Button>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="relative rounded-[10px] p-2 text-muted transition-colors hover:bg-white/[0.05] hover:text-fg cursor-pointer" aria-label={`Notifications, ${unread} unread`}>
                <Bell className="size-[18px]" />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-lime ring-2 ring-ink" />}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content align="end" sideOffset={8} className="z-50 w-[340px] rounded-[14px] border border-line-strong bg-card p-1.5 shadow-2xl">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[13px] font-semibold">Notifications</span>
                  <button className="text-[12px] text-muted hover:text-lime cursor-pointer" onClick={() => setNotes((n) => n.map((x) => ({ ...x, unread: false })))}>
                    Mark all as read
                  </button>
                </div>
                {notes.map((n) => (
                  <Popover.Close asChild key={n.id}>
                    <Link href={n.href} onClick={() => setNotes((all) => all.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))} className="flex gap-3 rounded-[10px] px-3 py-2.5 text-[13px] hover:bg-white/[0.05]">
                      <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.unread ? "bg-lime" : "bg-transparent")} />
                      <span className="flex-1 leading-snug text-fg/85">{n.text}</span>
                      <span className="text-[11.5px] text-muted">{n.time}</span>
                    </Link>
                  </Popover.Close>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="rounded-full cursor-pointer" aria-label="Account menu">
                <Avatar name={name} size={34} online />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-56 rounded-[14px] border border-line-strong bg-card p-1.5 shadow-2xl">
                <div className="px-3 py-2">
                  <div className="text-[13.5px] font-medium">{name}</div>
                  <div className="text-[12px] text-muted">{session?.email ?? "developer@devbattle.io"}</div>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-line" />
                {[
                  { label: "Profile", icon: User, href: "/profile" },
                  { label: "Settings", icon: Settings, href: "/settings" },
                ].map((i) => (
                  <DropdownMenu.Item key={i.href} onSelect={() => router.push(i.href)} className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] outline-none data-[highlighted]:bg-white/[0.06]">
                    <i.icon className="size-4 text-muted" /> {i.label}
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 h-px bg-line" />
                <DropdownMenu.Item
                  onSelect={() => {
                    void signOut().then(() => router.refresh());
                    toast("Logged out");
                    router.push("/");
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] outline-none data-[highlighted]:bg-white/[0.06]"
                >
                  <LogOut className="size-4 text-muted" /> Log out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      <CommandPalette open={palette} onOpenChange={setPalette} />

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[272px] border-r border-line bg-surface p-4 lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo />
                <button aria-label="Close navigation" onClick={() => setDrawer(false)} className="rounded-md p-1.5 text-muted cursor-pointer"><X className="size-5" /></button>
              </div>
              <SidebarNav collapsed={false} onNavigate={() => setDrawer(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
