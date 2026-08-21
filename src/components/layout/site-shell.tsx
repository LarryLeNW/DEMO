import type { ReactNode } from "react";
import { FloatingContactBar } from "@/components/layout/floating-contact-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col pb-[calc(68px+env(safe-area-inset-bottom))] lg:pb-0">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <FloatingContactBar />
    </div>
  );
}
