import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { leaderboard } from "@/lib/mock-data/players";
import { cn } from "@/lib/utils";

export function LeaderboardPreview() {
  const top = leaderboard.slice(0, 6);
  return (
    <section id="leaderboard" className="mx-auto max-w-[1240px] scroll-mt-20 px-4 pb-28 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <SectionHeading title="The names to beat." description="Updated after every ranked battle. This week Korea holds the top spot for the third time running." />
          <Button variant="outline" className="mt-8" asChild>
            <Link href="/leaderboard">View full leaderboard</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-[18px] border border-line">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-surface text-[12px] text-muted">
              <tr>
                <th className="w-14 px-5 py-3 font-medium">#</th>
                <th className="px-2 py-3 font-medium">Developer</th>
                <th className="hidden px-2 py-3 font-medium sm:table-cell">Country</th>
                <th className="px-2 py-3 text-right font-medium">Win rate</th>
                <th className="px-5 py-3 text-right font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {top.map((p) => (
                <tr key={p.id} className="border-t border-line transition-colors hover:bg-surface/60">
                  <td className={cn("px-5 py-3.5 font-mono tabular", p.rank <= 3 ? "text-lime" : "text-muted")}>{p.rank}</td>
                  <td className="px-2 py-3.5">
                    <span className="flex items-center gap-3">
                      <Avatar name={p.username} size={30} ring={p.rank === 1} />
                      <span className="font-medium">{p.username}</span>
                      <span className="hidden rounded-full border border-line px-2 text-[11px] text-muted md:inline">{p.tier}</span>
                    </span>
                  </td>
                  <td className="hidden px-2 py-3.5 text-muted sm:table-cell">{p.country.name}</td>
                  <td className="px-2 py-3.5 text-right font-mono tabular text-fg/80">{p.winRate}%</td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold tabular">{p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
