import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const cols = [
  { title: "Play", links: [["Find a battle", "/find-battle"], ["Create a room", "/create-room"], ["Practice arena", "/practice"], ["Leaderboard", "/leaderboard"]] },
  { title: "Improve", links: [["AI Coach", "/ai-coach"], ["Analytics", "/analytics"], ["Battle history", "/history"], ["Profile", "/profile"]] },
  { title: "Account", links: [["Log in", "/login"], ["Sign up", "/signup"], ["Reset password", "/forgot-password"], ["Settings", "/settings"]] },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
            Real-time 1v1 coding battles. Same problem, same clock, and the better code wins.
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="text-[13px] font-semibold">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href!} className="text-[14px] text-muted transition-colors hover:text-fg">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-3 px-4 py-6 text-[12.5px] text-muted sm:flex-row sm:px-6">
          <span>© 2026 Dev Battle. All battles fought fairly.</span>
          <span className="font-mono">status: all systems operational</span>
        </div>
      </div>
    </footer>
  );
}
