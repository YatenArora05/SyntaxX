import type { Metadata } from "next";
import { Practice } from "@/components/dashboard/practice";

export const metadata: Metadata = { title: "Practice Arena" };

export default function PracticePage() {
  return <Practice />;
}
