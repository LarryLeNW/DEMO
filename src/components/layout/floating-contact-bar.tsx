"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Heart, Send, ShoppingCart } from "lucide-react";
import { useCommerce } from "@/components/commerce/commerce-provider";

const zaloUrl =
  "https://khotaikhoan.net/wp-content/uploads/2024/12/Icon_of_Zalo.svg-2-35x35.png";
const contactPhone = "0931729316";
const bottomNavItemClass =
  "relative grid content-center justify-items-center gap-0.5 px-1 py-2 text-[12px] font-semibold leading-none text-slate-950";

export function FloatingContactBar() {
  const commerce = useCommerce();

  return (
    <>
      <div className="fixed right-4 top-[252px] z-50 hidden gap-3 lg:grid">
        <a
          className="grid size-[58px] place-items-center rounded-full bg-white shadow-[0_8px_28px_rgba(15,23,42,0.22)]"
          href={`https://zalo.me/${contactPhone}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat Zalo"
          title="Chat Zalo"
        >
          <span className="grid size-[42px] place-items-center rounded-full border-2 border-[#dceaff]">
            <Image src={zaloUrl} alt="Zalo" width={30} height={30} />
          </span>
        </a>
        <a
          className="grid size-[58px] place-items-center rounded-full bg-white shadow-[0_8px_28px_rgba(15,23,42,0.22)]"
          href={`tel:${contactPhone}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          title="Telegram"
        >
          <span className="grid size-[42px] place-items-center rounded-full bg-[#16a34a] text-white">
            <Send size={22} aria-hidden="true" />
          </span>
        </a>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(68px+env(safe-area-inset-bottom))] grid-cols-3 border-t border-[#e5e7eb] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden">
        <button
          className={bottomNavItemClass}
          type="button"
          onClick={commerce.openWishlist}
        >
          <span className="relative">
            <Heart size={23} aria-hidden="true" />
            <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-extrabold text-white">
              {commerce.wishlistCount}
            </span>
          </span>
          <span>Wishlist</span>
        </button>
        <button
          className={bottomNavItemClass}
          type="button"
          onClick={commerce.openCart}
        >
          <span className="relative">
            <ShoppingCart size={24} aria-hidden="true" />
            <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-extrabold text-white">
              {commerce.cartCount}
            </span>
          </span>
          <span>Giỏ hàng</span>
        </button>
        <Link
          className={bottomNavItemClass}
          href="/blog"
        >
          <FileText size={24} aria-hidden="true" />
          <span>Blog</span>
        </Link>
      </nav>
    </>
  );
}
