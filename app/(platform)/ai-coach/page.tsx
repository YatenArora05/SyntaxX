import type { Metadata } from "next";
import { Suspense } from "react";
import { AiCoachView } from "@/components/ai/ai-coach-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "AI Coach" };

export default function AiCoachPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[16px]" />}>
      <AiCoachView />
    </Suspense>
  );
}
