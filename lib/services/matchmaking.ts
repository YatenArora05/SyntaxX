/** Mock matchmaking and room services. Swap the bodies for API calls when the backend exists. */
import type { BattleMode, Difficulty, Language, Player } from "@/types";
import { onlinePlayers } from "@/lib/mock-data/players";
import { problems } from "@/lib/mock-data/problems";
import { randomId, sleep } from "@/lib/utils";

export interface MatchFound {
  battleId: string;
  opponent: Player;
  problemId: string;
  mode: BattleMode;
  language: Language;
}

export async function findMatch(
  opts: { mode: "quick" | "ranked"; difficulty: Difficulty | "Any"; language: Language; rating: number },
  signal?: AbortSignal,
): Promise<MatchFound> {
  const wait = 3200 + Math.random() * 2800;
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, wait);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Search cancelled", "AbortError"));
    });
  });
  const window = opts.mode === "ranked" ? 150 : 400;
  const pool = onlinePlayers.filter((p) => Math.abs(p.rating - opts.rating) < window + 600);
  const opponent = pool[Math.floor(Math.random() * pool.length)] ?? onlinePlayers[0]!;
  const candidates = problems.filter((p) => opts.difficulty === "Any" || p.difficulty === opts.difficulty);
  const problem = candidates[Math.floor(Math.random() * candidates.length)] ?? problems[0]!;
  return { battleId: randomId("BTL-"), opponent, problemId: problem.id, mode: opts.mode, language: opts.language };
}

export interface RoomSettings {
  name: string;
  difficulty: Difficulty;
  durationMin: number;
  languages: Language[];
  problemId: string;
  spectators: boolean;
}

export async function createRoom(settings: RoomSettings) {
  await sleep(700);
  return { code: `${randomId("", 3)}-${randomId("", 4)}`, settings };
}

export async function joinRoom(code: string) {
  await sleep(800);
  if (!/^[A-Z0-9]{3}-[A-Z0-9]{4}$/.test(code.trim().toUpperCase())) {
    throw new Error("Room codes look like K7Q-4XMP. Check the code and try again.");
  }
  return { battleId: `BTL-${code.replace("-", "")}` };
}

export async function invitePlayer(username: string) {
  await sleep(400);
  return { username, sentAt: Date.now() };
}
