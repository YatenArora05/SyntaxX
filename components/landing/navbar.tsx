"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/services/auth";

const links = [
  { href: "#top", label: "Home" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#modes", label: "Battles" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#ai-arena", label: "AI Arena" },
];

export function Navbar() {
  const session = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const spring = { type: "tween", duration: 0.8, ease: [0.65, 0, 0.35, 1] } as const;

  return (
    <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="relative mx-auto flex w-full max-w-[1240px] justify-center">
        <motion.nav
          layout
          transition={spring}
          style={{ borderRadius: 999 }}
          aria-label="Main"
          className={cn(
            "pointer-events-auto flex items-center border transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[900ms]",
            scrolled
              ? "gap-1 border-line-strong bg-ink/80 p-1.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:gap-2"
              : "w-full justify-between border-transparent bg-transparent px-1 py-1.5 sm:px-3",
          )}
        >
          <motion.div layout transition={spring} className="flex items-center">
            <Link href="/" aria-label="Dev Battle home" className="group inline-flex items-center rounded-md">
              <LogoMark size={scrolled ? 36 : 28} className="shrink-0 transition-all duration-[900ms] group-hover:rotate-[-6deg]" />
              <motion.span
                initial={false}
                animate={{ width: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1, marginLeft: scrolled ? 0 : 10 }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                className="overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-[-0.02em]"
              >
                Dev Battle
              </motion.span>
            </Link>
          </motion.div>

          <motion.ul layout transition={spring} className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "relative block whitespace-nowrap rounded-full px-3 py-2 text-[13.5px] transition-colors",
                    active === l.href ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-active"
                      transition={spring}
                      className="absolute inset-0 -z-10 rounded-full bg-white/10"
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>

          <motion.div layout transition={spring} className="hidden items-center gap-2 lg:flex">
            {session ? (
              <Link
                href="/dashboard"
                title="Go to dashboard"
                className="max-w-[240px] truncate rounded-full bg-fg px-5 py-2 text-[13.5px] font-medium text-ink transition-opacity hover:opacity-90"
              >
                {session.email}
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </motion.div>

          <motion.button
            layout
            transition={spring}
            className="cursor-pointer rounded-full p-2 text-fg lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </motion.button>
        </motion.nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-line bg-ink/95 backdrop-blur-xl lg:hidden"
            >
              <ul className="flex flex-col px-4 py-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-2 py-3 text-[15px] text-fg/90">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="mt-2 flex gap-2 pb-2">
                  {session ? (
                    <Button className="flex-1 truncate" asChild>
                      <Link href="/dashboard">{session.email}</Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="secondary" className="flex-1" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button className="flex-1" asChild>
                        <Link href="/signup">Sign up</Link>
                      </Button>
                    </>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
