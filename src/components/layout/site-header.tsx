"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  Gamepad2,
  GraduationCap,
  Headphones,
  Heart,
  Laptop,
  Menu,
  Newspaper,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Wrench,
} from "lucide-react";
import { useCommerce } from "@/components/commerce/commerce-provider";
import { generatedContent } from "@/lib/wp-content";
import { formatCurrency } from "@/lib/format";

const zaloUrl =
  "https://khotaikhoan.net/wp-content/uploads/2024/12/Icon_of_Zalo.svg-2-35x35.png";
const contactPhone = "0931729316";
const contactPhoneDisplay = "0931 729 316";

const navLinks = [
  {
    href: "/gioi-thieu",
    label: "Giới Thiệu",
    iconSrc: "https://khotaikhoan.net/wp-content/uploads/2026/02/Untitled-1-03.png",
  },
  {
    href: "/huong-dan-mua-hang",
    label: "Hướng dẫn mua hàng",
    iconSrc: "https://khotaikhoan.net/wp-content/uploads/2025/10/Icon-ktk-02.png",
  },
  {
    href: "/blog",
    label: "Blog tin tức",
    iconSrc: "https://khotaikhoan.net/wp-content/uploads/2025/10/Icon-ktk-01.png",
  },
];

const railItems = [
  { href: "/ung-dung-phan-mem-khac/cong-cu-ai", label: "Công cụ AI", icon: Bot },
  { href: "/hoc-tap", label: "Học tập", icon: GraduationCap },
  { href: "/lam-viec", label: "Làm việc", icon: Laptop },
  { href: "/giai-tri", label: "Giải trí", icon: Gamepad2 },
  { href: "/anti-virus", label: "Anti Virus", icon: ShieldCheck },
  { href: "/vpn", label: "VPN", icon: Wrench },
  { href: "/blog", label: "Tin tức", icon: Newspaper },
  { href: `tel:${contactPhone}`, label: "Hỗ trợ", icon: Headphones },
];

const categoryMenuItems = [
  { href: "/ung-dung-phan-mem-khac/cong-cu-ai", label: "Công cụ AI", icon: Bot },
  { href: "/hoc-tap", label: "Học Tập", icon: GraduationCap },
  { href: "/lam-viec", label: "Làm Việc", icon: Laptop },
  { href: "/giai-tri", label: "Giải Trí", icon: Headphones },
  { href: "/vpn", label: "VPN", icon: ShieldCheck },
  { href: "/luu-tru", label: "Lưu Trữ", icon: Wrench },
  { href: "/anti-virus", label: "Anti Virus", icon: ShieldCheck },
  { href: "/ung-dung-phan-mem-khac", label: "Phần Mềm Khác", icon: Gamepad2 },
];

export function SiteHeader() {
  const commerce = useCommerce();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const activeRailHref = railItems
    .filter(
      (item) =>
        item.href.startsWith("/") &&
        (pathname === item.href || pathname.startsWith(`${item.href}/`)),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const activeCategoryHref = categoryMenuItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    lastScrollY.current = window.scrollY;

    function syncHeaderVisibility() {
      if (!mediaQuery.matches || menuOpen) {
        setIsHeaderHidden(false);
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 96) {
        setIsHeaderHidden(false);
      } else if (delta > 8) {
        setIsHeaderHidden(true);
      } else if (delta < -8) {
        setIsHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }

    let frame = 0;
    function handleScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        syncHeaderVisibility();
        frame = 0;
      });
    }

    syncHeaderVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    mediaQuery.addEventListener("change", syncHeaderVisibility);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", syncHeaderVisibility);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out lg:transform-gpu lg:will-change-transform ${
          isHeaderHidden ? "lg:-translate-y-full" : "lg:translate-y-0"
        }`}
      >
        <div className="lg:hidden">
          <div className="relative flex h-[60px] items-center justify-between px-4">
            <button
              className="focus-ring grid size-10 place-items-center text-slate-950"
              type="button"
              aria-label="Mở menu"
              title="Mở menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            <Link
              href="/"
              aria-label="AIHUB"
              className="focus-ring absolute left-1/2 top-1/2 flex h-[48px] w-[214px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              <BrandLogo compact />
            </Link>
            <button
              className="focus-ring grid size-10 place-items-center text-slate-950"
              type="button"
              aria-label="Tài khoản"
              title="Tài khoản"
              onClick={commerce.openAccount}
            >
              <UserRound size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="bg-[#eaf8ef] px-4 py-2">
            <SearchBox compact />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="ktk-page-frame flex h-[80px] items-center gap-7">
            <Link
              href="/"
              aria-label="AIHUB"
              className="focus-ring flex h-[58px] w-[214px] shrink-0 items-center"
            >
              <BrandLogo />
            </Link>

            <SearchBox />

            <div className="flex items-center gap-2">
              <Image src={zaloUrl} alt="Zalo" width={38} height={38} />
              <a
                className="whitespace-nowrap text-[15px] font-extrabold text-slate-950"
                href={`tel:${contactPhone}`}
              >
                {contactPhoneDisplay}
              </a>
            </div>
          </div>

          <div className="ml-[60px] h-[60px] bg-[#eaf8ef]">
            <div className="mx-auto flex h-full max-w-[1222px] items-center justify-between gap-5 px-[15px]">
              <div className="flex h-full items-center gap-5">
                <button
                  className="focus-ring inline-flex h-[42px] w-[171px] items-center gap-2.5 rounded-full bg-white pl-[3px] pr-3 text-[14px] font-extrabold leading-none text-slate-800 shadow-sm"
                  type="button"
                  onClick={() => setMenuOpen(true)}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#16a34a] text-white">
                    <Menu size={21} aria-hidden="true" />
                  </span>
                  <span className="whitespace-nowrap text-[13px]">Tất cả danh mục</span>
                </button>
                {navLinks.map((link) => {
                  const active =
                    pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "focus-ring group inline-flex h-[40px] items-center gap-2 px-[10px] text-[14px] font-bold text-[#15803d] transition"
                        : "focus-ring group inline-flex h-[40px] items-center gap-2 px-[10px] text-[14px] font-bold text-slate-700 transition hover:text-[#15803d]"
                    }
                  >
                    <Image
                      src={link.iconSrc}
                      alt=""
                      width={24}
                      height={24}
                      sizes="24px"
                      className={
                        active
                          ? "ktk-nav-img-active size-6 shrink-0 object-contain"
                          : "ktk-nav-img-inactive size-6 shrink-0 object-contain"
                      }
                    />
                    {link.label}
                  </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <HeaderIconButton label="Tài khoản" onClick={commerce.openAccount}>
                  <UserRound size={22} aria-hidden="true" />
                </HeaderIconButton>
                <HeaderIconButton
                  label="Yêu thích"
                  count={commerce.wishlistCount}
                  onClick={commerce.openWishlist}
                >
                  <Heart size={22} aria-hidden="true" />
                </HeaderIconButton>
                <HeaderIconButton
                  label="Giỏ hàng"
                  count={commerce.cartCount}
                  primary
                  onClick={commerce.openCart}
                >
                  <ShoppingCart size={22} aria-hidden="true" />
                </HeaderIconButton>
                <span className="text-[13px] font-extrabold text-slate-700">
                  {formatCurrency(commerce.subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="ktk-left-rail-bg" aria-hidden="true" />

      <button
        className="ktk-top-menu focus-ring"
        type="button"
        aria-label="Mở danh mục"
        title="Mở danh mục"
        onClick={() => setMenuOpen(true)}
      >
        <Menu size={23} aria-hidden="true" />
      </button>

      <aside className="ktk-left-rail">
        {railItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === activeRailHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "focus-ring grid size-10 place-items-center text-[#15803d] transition"
                  : "focus-ring grid size-10 place-items-center text-slate-950 transition hover:text-[#15803d]"
              }
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={21} aria-hidden="true" />
            </Link>
          );
        })}
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-[70]">
          <button
            className="absolute inset-0 bg-slate-950/70 lg:bg-transparent"
            type="button"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[300px] overflow-hidden bg-white shadow-2xl lg:w-[274px] lg:pt-2 lg:shadow-none">
            <div className="flex h-[53px] items-center justify-center border-b-2 border-[#16a34a] text-[14px] font-extrabold uppercase text-slate-950 lg:mx-2 lg:h-[44px] lg:justify-start lg:border-b-0 lg:bg-[#16a34a] lg:px-4 lg:text-[18px] lg:normal-case lg:text-white lg:[border-radius:0_22px_22px_0]">
              <Menu className="mr-2 hidden lg:block" size={22} aria-hidden="true" />
              <span className="lg:hidden">DANH MỤC</span>
              <span className="hidden lg:inline">Tất cả danh mục</span>
            </div>
            <div className="bg-white lg:mt-3">
              {categoryMenuItems.map((item) => {
                const Icon = item.icon;
                const active = item.href === activeCategoryHref;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group flex h-[50px] items-center gap-3 border-b border-[#e5e7eb] px-5 text-[16px] font-bold transition hover:text-[#15803d] lg:h-[50px] lg:gap-3.5 lg:border-b-0 lg:px-6 lg:text-[18px] ${
                      active ? "text-[#15803d]" : "text-slate-950"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon
                      size={24}
                      className={
                        active
                          ? "text-[#15803d]"
                          : "text-slate-950 transition group-hover:text-[#15803d]"
                      }
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full items-center gap-2.5 text-[#15803d]">
      <span
        className={
          compact
            ? "grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#16a34a] text-[15px] font-black text-white shadow-[0_8px_18px_rgba(22,163,74,0.22)]"
            : "grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#16a34a] text-[17px] font-black text-white shadow-[0_10px_22px_rgba(22,163,74,0.22)]"
        }
        aria-hidden="true"
      >
        AI
      </span>
      <span className="min-w-0 leading-none">
        <span
          className={
            compact
              ? "block text-[22px] font-black text-[#14532d]"
              : "block text-[28px] font-black text-[#14532d]"
          }
        >
          AIHUB
        </span>
        <span
          className={
            compact
              ? "mt-1 block text-[9px] font-bold text-[#16a34a]"
              : "mt-1 block text-[11px] font-bold text-[#16a34a]"
          }
        >
          Tài khoản số giá tốt
        </span>
      </span>
    </div>
  );
}

function HeaderIconButton({
  children,
  count,
  label,
  onClick,
  primary = false,
}: {
  children: ReactNode;
  count?: number;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      className={
        primary
          ? "focus-ring relative grid size-[43px] place-items-center rounded-full bg-primary text-white transition hover:bg-primary-strong"
          : "focus-ring relative grid size-[43px] place-items-center rounded-full bg-white text-slate-950 transition hover:text-primary-strong"
      }
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
      {typeof count === "number" ? (
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[11px] font-extrabold text-primary shadow-sm">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const products = generatedContent.products;
  const suggestions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (keyword.length < 2) return [];
    return products
      .filter((product) => `${product.title} ${product.path}`.toLowerCase().includes(keyword))
      .slice(0, 6);
  }, [products, query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = query.trim();
    if (keyword) {
      setFocused(false);
      router.push(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
    }
  }

  return (
    <form
      action="/tim-kiem"
      method="get"
      className={
        compact
          ? "relative flex h-[44px] items-center rounded-full border border-[#d6dde8] bg-white px-4"
          : "relative flex h-[46px] flex-1 items-center rounded-full border border-[#d8e0ea] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.02)]"
      }
      onSubmit={submit}
    >
      <button
        className={compact ? "mr-2 text-primary" : "ml-4 mr-3 text-primary"}
        type="submit"
        aria-label="Tìm kiếm"
        title="Tìm kiếm"
      >
        <Search size={compact ? 20 : 21} aria-hidden="true" />
      </button>
      <input
        aria-label="Tìm kiếm sản phẩm"
        className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium text-slate-700 outline-none placeholder:text-slate-500"
        placeholder="Tìm sản phẩm ..."
        name="q"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.form?.requestSubmit();
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
      />
      {focused && suggestions.length ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-md border border-border bg-white shadow-xl">
          {suggestions.map((product) => (
            <Link
              key={product.id}
              href={`/${product.path}`}
              className="flex items-center gap-3 border-b border-border px-3 py-2 last:border-b-0 hover:bg-surface-muted"
            >
              {product.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.featuredImage}
                  alt={product.title}
                  className="size-10 rounded-md object-cover"
                />
              ) : null}
              <span className="line-clamp-2 text-sm font-bold text-slate-800">
                {product.title}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </form>
  );
}
