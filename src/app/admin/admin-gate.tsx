"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { LoaderCircle, LogOut, ShieldAlert } from "lucide-react";
import { AIHubLogo } from "@/components/aihub-logo";
import { LoginForm } from "@/components/auth/auth-forms";
import { useAuth } from "@/components/auth/auth-provider";
import { roleLabels } from "@/lib/api/auth";

/** Renders the admin UI only for an authenticated user with the `admin` role. */
export function AdminGate({ children }: { children: ReactNode }) {
  const { status, user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  if (status === "loading") {
    return (
      <GateFrame>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          Đang kiểm tra phiên đăng nhập…
        </p>
      </GateFrame>
    );
  }

  if (status === "anonymous" || !user) {
    return (
      <GateFrame>
        <AIHubLogo admin href="/admin" />
        <h1 className="mt-6 text-[22px] font-extrabold text-slate-950">Đăng nhập quản trị</h1>
        <p className="mt-1 text-[13px] text-muted">
          Chỉ tài khoản có vai trò quản trị viên mới truy cập được khu vực này.
        </p>
        <div className="mt-6 text-left">
          <LoginForm idPrefix="admin-login" />
        </div>
        <Link href="/" className="focus-ring mt-5 inline-block text-[13px] font-bold text-primary-strong">
          ← Về trang chủ
        </Link>
      </GateFrame>
    );
  }

  if (user.role !== "admin") {
    return (
      <GateFrame>
        <span className="grid size-14 place-items-center rounded-full bg-amber-100 text-amber-700">
          <ShieldAlert size={28} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-[20px] font-extrabold text-slate-950">Không có quyền truy cập</h1>
        <p className="mt-2 text-[13px] leading-6 text-muted">
          Tài khoản <strong className="text-slate-800">{user.email}</strong> đang có vai trò{" "}
          <strong className="text-slate-800">{roleLabels[user.role]}</strong>. Hãy đăng nhập bằng tài
          khoản quản trị viên.
        </p>
        <div className="mt-6 grid gap-2">
          <button
            type="button"
            className="focus-ring inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary font-extrabold text-white transition hover:bg-primary-strong disabled:opacity-60"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              try {
                await logout();
              } finally {
                setSigningOut(false);
              }
            }}
          >
            <LogOut size={18} aria-hidden="true" />
            Đăng xuất và đăng nhập lại
          </button>
          <Link
            href="/"
            className="focus-ring inline-flex h-11 items-center justify-center rounded-md border border-border font-extrabold text-slate-800 transition hover:bg-slate-50"
          >
            Về trang chủ
          </Link>
        </div>
      </GateFrame>
    );
  }

  return <>{children}</>;
}

function GateFrame({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f8fb] px-4 py-10">
      <div className="w-full max-w-[400px] rounded-[12px] border border-[#e1e8f2] bg-white p-7 text-center shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
        {children}
      </div>
    </div>
  );
}
