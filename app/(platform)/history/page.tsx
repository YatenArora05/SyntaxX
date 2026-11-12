import type { Metadata } from "next";
import { Suspense } from "react";
import { History } from "@/components/dashboard/history";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Battle History" };

export default function HistoryPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[16px]" />}>
      <History />
    </Suspense>
  );
}
