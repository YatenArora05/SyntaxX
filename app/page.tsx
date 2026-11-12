import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { AiSection } from "@/components/landing/ai-section";
import { Modes } from "@/components/landing/modes";
import { LeaderboardPreview } from "@/components/landing/leaderboard-preview";
import { Stats } from "@/components/landing/stats";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <AiSection />
        <Modes />
        <Stats />
        <div className="h-28" aria-hidden />
        <LeaderboardPreview />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
