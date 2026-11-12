import type { Metadata } from "next";
import { Suspense } from "react";
import { FindBattle } from "@/components/dashboard/find-battle";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Find Battle" };

export default function FindBattlePage() {
  return (
    <Suspense fallback={<Skeleton className="h-[560px] w-full rounded-[16px]" />}>
      <FindBattle />
    </Suspense>
  );
}
