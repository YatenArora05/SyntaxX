import Link from "next/link";
import { cn } from "@/lib/utils";

/** Two chevrons pointing at each other: a clash, and a nod to </> */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" fill="#B7F700" />
      <path d="M8.5 10.5 13.5 16l-5 5.5" fill="none" stroke="#080A08" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.5 10.5 18.5 16l5 5.5" fill="none" stroke="#080A08" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8.5v15" stroke="#080A08" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="1.6 2.2" />
    </svg>
  );
}

export function Logo({ href = "/", className, compact }: { href?: string; className?: string; compact?: boolean }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5 rounded-md", className)} aria-label="Dev Battle home">
      <LogoMark className="transition-transform duration-300 group-hover:rotate-[-6deg]" />
      {!compact && <span className="text-[15px] font-semibold tracking-[-0.02em]">Dev Battle</span>}
    </Link>
  );
}
