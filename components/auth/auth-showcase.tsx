import { Avatar } from "@/components/ui/avatar";
import { LiveDot } from "@/components/ui/badge";
import { leaderboard } from "@/lib/mock-data/players";

/** Right-hand panel on auth pages: a ticker of battles finishing right now. */
export function AuthShowcase() {
  const feed = [
    [0, 4, 9, 7], [2, 11, 8, 8], [6, 1, 5, 9], [13, 20, 7, 4], [3, 8, 9, 6], [17, 22, 6, 6], [10, 15, 3, 7],
  ].map(([a, b, x, y], i) => ({ id: i, a: leaderboard[a]!.username, b: leaderboard[b]!.username, x: x!, y: y! }));
  return (
    <aside className="relative hidden overflow-hidden border-l border-line bg-surface lg:block" aria-label="Live battles">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0" />
      <div aria-hidden className="seam seam-animated absolute inset-y-0 left-1/2 w-px opacity-50" />
      <div className="relative flex h-full flex-col justify-center px-12 xl:px-20">
        <p className="flex items-center gap-2 text-[13px] text-muted"><LiveDot /> Battles finishing right now</p>
        <ul className="mt-6 space-y-2.5">
          {feed.map((b, i) => (
            <li
              key={b.id}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[14px] border border-line bg-ink/80 px-4 py-3 backdrop-blur"
              style={{ opacity: 1 - i * 0.11 }}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <Avatar name={b.a} size={28} ring={b.x > b.y} />
                <span className="truncate text-[13.5px] font-medium">{b.a}</span>
              </span>
              <span className="font-mono text-[12px] tabular" aria-label={`${b.x} to ${b.y} tests passed`}>
                <span className={b.x > b.y ? "text-lime" : "text-fg/70"}>{b.x}</span>
                <span className="text-muted"> : </span>
                <span className={b.y > b.x ? "text-lime" : "text-fg/70"}>{b.y}</span>
              </span>
              <span className="flex min-w-0 items-center justify-end gap-2.5">
                <span className="truncate text-[13.5px] font-medium">{b.b}</span>
                <Avatar name={b.b} size={28} ring={b.y > b.x} />
              </span>
            </li>
          ))}
        </ul>
        <blockquote className="mt-12 max-w-md">
          <p className="text-[22px] font-semibold leading-snug tracking-[-0.02em]">
            &ldquo;Practice problems never made me nervous. Watching someone else&apos;s cursor move on the same problem does. That&apos;s the point.&rdquo;
          </p>
          <footer className="mt-4 text-[13px] text-muted">segfault_sara · Grandmaster, #3 globally</footer>
        </blockquote>
      </div>
    </aside>
  );
}
