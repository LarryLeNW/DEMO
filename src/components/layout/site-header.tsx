"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);
  const categoryRef = useRef<HTMLDivElement>(null);
  const categoryCloseTimer = useRef<number | null>(null);
  const activeCategoryHref = categoryMenuItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const clearCategoryTimer = useCallback(() => {
    if (categoryCloseTimer.current !== null) {
      window.clearTimeout(categoryCloseTimer.current);
      categoryCloseTimer.current = null;
    }
  }, []);

  const openCategory = useCallback(() => {
    clearCategoryTimer();
    setCategoryOpen(true);
  }, [clearCategoryTimer]);

  const closeCategory = useCallback(
    (delay = 0) => {
      clearCategoryTimer();
      if (delay <= 0) {
        setCategoryOpen(false);
        return;
      }
      categoryCloseTimer.current = window.setTimeout(() => {
        categoryCloseTimer.current = null;
        setCategoryOpen(false);
      }, delay);
    },
    [clearCategoryTimer],
  );

  useEffect(() => clearCategoryTimer, [clearCategoryTimer]);

  useEffect(() => {
    if (!categoryOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!categoryRef.current?.contains(event.target as Node)) {
        closeCategory();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCategory();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoryOpen, closeCategory]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    lastScrollY.current = window.scrollY;

    function syncHeaderVisibility() {
      if (!mediaQuery.matches || menuOpen || categoryOpen) {
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
  }, [menuOpen, categoryOpen]);

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

          <div className="h-[60px] bg-[#eaf8ef]">
            <div className="mx-auto flex h-full max-w-[1222px] items-center justify-between gap-5 px-[15px]">
              <div className="flex h-full items-center gap-5">
                <div
                  ref={categoryRef}
                  className="relative flex h-full items-center"
                  onMouseEnter={openCategory}
                  onMouseLeave={() => closeCategory(160)}
                >
                  <button
                    className={`focus-ring inline-flex h-[42px] w-[171px] cursor-pointer items-center gap-2.5 rounded-full bg-white pl-[3px] pr-3 text-[14px] font-extrabold leading-none shadow-sm transition-[color,box-shadow] duration-200 ${
                      categoryOpen
                        ? "text-[#15803d] shadow-[0_6px_16px_rgba(22,163,74,0.18)]"
                        : "text-slate-800"
                    }`}
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={categoryOpen}
                    aria-controls="ktk-category-menu"
                    onClick={openCategory}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#16a34a] text-white">
                      <Menu size={21} aria-hidden="true" />
                    </span>
                    <span className="whitespace-nowrap text-[13px]">Tất cả danh mục</span>
                  </button>

                  <div
                    id="ktk-category-menu"
                    className={`absolute left-0 top-full z-50 w-[274px] origin-top overflow-hidden rounded-b-[10px] border border-t-0 border-[#e5e7eb] bg-white py-2 shadow-[0_18px_40px_rgba(15,23,42,0.14)] transition-[opacity,translate,visibility] duration-200 ease-out ${
                      categoryOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                    aria-hidden={!categoryOpen}
                  >
                    {categoryMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      const active = item.href === activeCategoryHref;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`group flex h-[48px] items-center gap-3.5 px-5 text-[15px] font-bold transition-[opacity,translate,background-color,color] duration-200 ease-out hover:bg-[#f0faf4] hover:text-[#15803d] ${
                            active ? "bg-[#f0faf4] text-[#15803d]" : "text-slate-950"
                          } ${
                            categoryOpen
                              ? "translate-y-0 opacity-100"
                              : "-translate-y-1 opacity-0"
                          }`}
                          style={{
                            transitionDelay: categoryOpen ? `${index * 22}ms` : "0ms",
                          }}
                          tabIndex={categoryOpen ? undefined : -1}
                          onClick={() => closeCategory()}
                        >
                          <Icon
                            size={22}
                            className={
                              active
                                ? "text-[#15803d]"
                                : "text-slate-950 transition-colors duration-200 group-hover:text-[#15803d]"
                            }
                            aria-hidden="true"
                          />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
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
                      width={28}
                      height={28}
                      sizes="28px"
                      className={
                        active
                          ? "ktk-nav-img-active size-7 shrink-0 object-contain"
                          : "ktk-nav-img-inactive size-7 shrink-0 object-contain"
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

      {menuOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/70"
            type="button"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[300px] overflow-hidden bg-white shadow-2xl">
            <div className="flex h-[53px] items-center justify-center border-b-2 border-[#16a34a] text-[14px] font-extrabold uppercase text-slate-950">
              DANH MỤC
            </div>
            <div className="bg-white">
              {categoryMenuItems.map((item) => {
                const Icon = item.icon;
                const active = item.href === activeCategoryHref;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group flex h-[50px] items-center gap-3 border-b border-[#e5e7eb] px-5 text-[16px] font-bold transition hover:text-[#15803d] ${
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
