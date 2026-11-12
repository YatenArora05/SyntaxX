import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden py-32">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10" />
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.07] blur-[120px]" />
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-[clamp(36px,6vw,72px)] font-extrabold leading-[0.95] tracking-[-0.05em]">Ready to prove your coding skills?</h2>
        <p className="mx-auto mt-6 max-w-md text-[17px] text-muted">Your first ranked battle is one click away. Average wait right now: 6 seconds.</p>
        <div className="mt-10 flex justify-center">
          <Button size="lg" className="h-14 px-8 text-base" asChild>
            <Link href="/signup">Enter the Arena</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
