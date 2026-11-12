import { Logo } from "@/components/shared/logo";
import { AuthShowcase } from "@/components/auth/auth-showcase";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <p className="text-[12px] text-muted">© 2026 Dev Battle</p>
      </div>
      <AuthShowcase />
    </div>
  );
}
