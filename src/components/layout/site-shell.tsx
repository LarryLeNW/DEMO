import type { ReactNode } from "react";
import { FloatingContactBar } from "@/components/layout/floating-contact-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteShellClient } from "@/components/layout/site-shell-client";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return <SiteShellClient header={<SiteHeader />} footer={<SiteFooter />} floating={<FloatingContactBar />}>
    {children}
  </SiteShellClient>;
}
