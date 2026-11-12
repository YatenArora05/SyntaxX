import { Skeleton } from "@/components/ui/skeleton";

export function EditorSkeleton() {
  return (
    <div className="h-full w-full space-y-3 bg-ink p-5" aria-label="Loading editor">
      {[62, 44, 70, 38, 56, 30, 48].map((w, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}
