import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateRoom } from "@/components/dashboard/create-room";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Create Room" };

export default function CreateRoomPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[560px] w-full rounded-[16px]" />}>
      <CreateRoom />
    </Suspense>
  );
}
