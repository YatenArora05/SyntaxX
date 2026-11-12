import Link from "next/link";
import { Crown, Lock, Shield, Zap } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const modes = [
  { icon: Zap, title: "Quick Match", body: "Jump in against anyone online. No rating on the line, just reps.", meta: ["10 min", "Unrated"], href: "/find-battle?mode=quick" },
  { icon: Shield, title: "Ranked Battle", body: "Matched within ±150 rating. Wins and losses move your Elo.", meta: ["15 min", "±32 rating"], href: "/find-battle?mode=ranked", featured: true },
  { icon: Lock, title: "Private Room", body: "Invite a friend with a code. Pick the problem, clock and languages.", meta: ["Custom", "Invite only"], href: "/create-room" },
  { icon: Crown, title: "Tournament Mode", body: "Single-elimination brackets every Saturday. Top 8 earn a profile badge.", meta: ["Sat 18:00 UTC", "64 players"], href: "/find-battle?mode=tournament" },
];

export function Modes() {
  return (
    <section id="modes" className="mx-auto max-w-[1240px] scroll-mt-20 px-4 py-28 sm:px-6">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading title="Pick your battle." description="Four ways to play, from a casual warm-up to a bracket with your name on the line." />
      </div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {modes.map((m) => (
          <Link
            key={m.title}
            href={m.href}
            className="group relative flex flex-col bg-ink p-6 transition-colors hover:bg-surface focus-visible:z-10"
          >
            {m.featured && <span className="absolute inset-x-0 top-0 h-[2px] bg-lime" aria-hidden />}
            <m.icon className={m.featured ? "size-5 text-lime" : "size-5 text-fg/80"} />
            <h3 className="mt-8 text-lg font-semibold tracking-tight">{m.title}</h3>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{m.body}</p>
            <div className="mt-8 flex items-center gap-2 font-mono text-[12px] text-fg/70">
              {m.meta.map((x) => (
                <span key={x} className="rounded-md border border-line px-2 py-0.5">{x}</span>
              ))}
            </div>
            <span className="mt-6 text-[13px] font-medium text-fg transition-colors group-hover:text-lime">
              {m.title === "Private Room" ? "Create a room" : m.title === "Tournament Mode" ? "See the bracket" : "Play now"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
