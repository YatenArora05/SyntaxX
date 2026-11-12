import { cn } from "@/lib/utils";

/**
 * Monogram avatar. Each user gets a deterministic geometric mark built only from
 * the brand palette, so avatars stay on-brand without stock photography.
 */
export function Avatar({
  name,
  size = 36,
  ring = false,
  online,
  className,
}: {
  name: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
  className?: string;
}) {
  const initials = name
    .replace(/[^A-Za-z0-9 _-]/g, "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "?";
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const variant = h % 4;
  const angle = (h % 8) * 45;

  const fills = [
    "bg-card text-fg",
    "bg-white/[0.08] text-fg",
    "bg-lime-soft text-lime",
    "bg-white text-ink",
  ];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-line-strong font-semibold select-none",
        fills[variant],
        ring && "shadow-glow-sm border-lime",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
      aria-label={name}
      role="img"
    >
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-full opacity-40"
        style={{
          backgroundImage: `repeating-linear-gradient(${angle}deg, transparent 0 5px, rgb(255 255 255 / 0.06) 5px 6px)`,
        }}
      />
      <span className="relative">{initials}</span>
      {online !== undefined && (
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-ink",
            online ? "bg-lime" : "bg-muted/60",
          )}
          style={{ width: Math.max(8, size * 0.28), height: Math.max(8, size * 0.28) }}
        />
      )}
    </span>
  );
}
