import type { Metadata } from "next";
import { Settings } from "@/components/dashboard/settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <Settings />;
}
