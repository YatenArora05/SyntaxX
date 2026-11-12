"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { BrainCircuit, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { CoachChat } from "./coach-chat";
import { ProblemGenerator } from "./problem-generator";

export function AiCoachView() {
  const params = useSearchParams();
  const router = useRouter();
  const tab = params.get("tab") === "generator" ? "generator" : "coach";
  const seed = params.get("topic") === "last-battle" ? "Why did I lose my last battle?" : undefined;
  return (
    <div>
      <PageHeader title="AI Coach" description="Ask about any battle, explore alternative approaches, or generate a fresh problem to practise on." />
      <Tabs value={tab} onValueChange={(v) => router.replace(v === "generator" ? "/ai-coach?tab=generator" : "/ai-coach", { scroll: false })}>
        <TabsList className="mb-5">
          <TabsTrigger value="coach"><BrainCircuit /> Coach</TabsTrigger>
          <TabsTrigger value="generator"><Sparkles /> Problem generator</TabsTrigger>
        </TabsList>
        <TabsContent value="coach"><CoachChat seed={seed} /></TabsContent>
        <TabsContent value="generator"><ProblemGenerator /></TabsContent>
      </Tabs>
    </div>
  );
}
