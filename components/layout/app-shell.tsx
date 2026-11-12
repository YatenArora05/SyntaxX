"use client";

import { useSyncExternalStore } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

const KEY = "devbattle.sidebar";
const listeners = new Set<() => void>();
const read = () => {
  try {
    return localStorage.getItem(KEY) === "collapsed";
  } catch {
    return false;
  }
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => false,
  );
  const toggle = () => {
    try {
      localStorage.setItem(KEY, collapsed ? "open" : "collapsed");
    } catch {}
    listeners.forEach((l) => l());
  };
  return (
    <div className="flex min-h-dvh">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
