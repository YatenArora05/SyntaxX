import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 text-center">
      <div aria-hidden className="bg-grid mask-radial absolute inset-0" />
      <div className="relative">
        <LogoMark size={40} className="mx-auto" />
        <p className="mt-8 font-mono text-[13px] text-lime">404 · Wrong Answer</p>
        <h1 className="mt-3 text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-0.045em]">This page didn&apos;t pass the tests.</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The route you asked for doesn&apos;t exist. Head back and pick another battle.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild><Link href="/">Back to home</Link></Button>
          <Button variant="secondary" asChild><Link href="/dashboard">Dashboard</Link></Button>
        </div>
      </div>
    </main>
  );
}
