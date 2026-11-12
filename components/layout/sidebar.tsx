"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ChevronsLeft, ChevronsRight, Zap } from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { currentUser } from "@/lib/mock-data/players";
import { useSession } from "@/lib/services/auth";
import { cn } from "@/lib/utils";
import { NAV } from "./nav";

export function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="App" className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const link = (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-[10px] px-3 text-[14px] transition-colors",
              active ? "text-fg" : "text-muted hover:bg-white/[0.04] hover:text-fg",
              collapsed && "justify-center px-0",
            )}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-[10px] border border-line-strong bg-white/[0.06]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            {active && <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-lime" />}
            <item.icon className={cn("relative size-[18px] shrink-0", active && "text-lime")} />
            {!collapsed && <span className="relative truncate">{item.label}</span>}
          </Link>
        );
        return collapsed ? (
          <Tooltip key={item.href} content={item.label} side="right">
            {link}
          </Tooltip>
        ) : (
          link
        );
      })}
    </nav>
  );
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const session = useSession();
  const name = session?.username ?? currentUser.username;
  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 252 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface/60 px-3 py-4 lg:flex"
    >
      <div className={cn("flex h-9 items-center", collapsed ? "justify-center" : "justify-between px-1.5")}>
        {collapsed ? <Link href="/" aria-label="Dev Battle home"><LogoMark /></Link> : <Logo />}
      </div>

      <div className="mt-6 flex-1 overflow-y-auto">
        <SidebarNav collapsed={collapsed} />
      </div>

      {!collapsed && (
        <Link
          href="/find-battle?mode=quick"
          className="group mb-3 block overflow-hidden rounded-[14px] border border-lime/30 bg-lime-soft p-3.5 transition-colors hover:border-lime/60"
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold text-lime"><Zap className="size-4" /> Quick match</span>
          <span className="mt-1 block text-[12px] leading-relaxed text-fg/70">Average wait right now is 6 seconds.</span>
        </Link>
      )}

      <div className={cn("flex items-center gap-3 border-t border-line pt-3", collapsed && "flex-col")}>
        <Link href="/profile" className="flex min-w-0 flex-1 items-center gap-3 rounded-[10px] p-1 hover:bg-white/[0.04]" aria-label="Your profile">
          <Avatar name={name} size={34} online />
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium">{name}</span>
              <span className="block font-mono text-[11.5px] text-muted"><span className="text-lime">{currentUser.rating}</span> · {currentUser.tier}</span>
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-fg cursor-pointer"
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
