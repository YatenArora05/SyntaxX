import { BarChart3, BrainCircuit, DoorOpen, Dumbbell, History, LayoutGrid, Settings, Swords, Trophy } from "lucide-react";

export const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/find-battle", label: "Find Battle", icon: Swords },
  { href: "/create-room", label: "Create Room", icon: DoorOpen },
  { href: "/practice", label: "Practice Arena", icon: Dumbbell },
  { href: "/ai-coach", label: "AI Coach", icon: BrainCircuit },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/history", label: "Battle History", icon: History },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;
