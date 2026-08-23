"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type SiteShellClientProps = {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  floating: ReactNode;
};

export function SiteShellClient({ children, header, footer, floating }: SiteShellClientProps) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col pb-[calc(68px+env(safe-area-inset-bottom))] lg:pb-0">
      {header}
      <div className="flex-1">{children}</div>
      {footer}
      {floating}
    </div>
  );
}
