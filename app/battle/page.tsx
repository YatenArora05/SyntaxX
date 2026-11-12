import type { Metadata } from "next";
import { Suspense } from "react";
import { ArenaSkeleton, BattleArena } from "@/components/battle/battle-arena";

export const metadata: Metadata = { title: "Battle Arena" };

export default function BattlePage() {
  return (
    <Suspense fallback={<ArenaSkeleton />}>
      <BattleArena />
    </Suspense>
  );
}
