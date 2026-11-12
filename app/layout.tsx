import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { SessionProvider } from "@/lib/services/auth";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: {
    default: "Dev Battle — Real-time 1v1 coding battles",
    template: "%s · Dev Battle",
  },
  description:
    "Challenge developers worldwide. Solve the same problem in real time, side by side. Your code is executed and benchmarked, and an AI judge explains who wrote the better solution.",
};

export const viewport: Viewport = {
  themeColor: "#080A08",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  return (
    <html lang="en" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SessionProvider session={session}>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
