"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, CheckCircle2, ShoppingCart, Star, Zap } from "lucide-react";
import { useCommerce } from "@/components/commerce/commerce-provider";
import { ContentBody } from "@/components/wp/content-body";
import { replaceBrandText } from "@/lib/brand";
import { formatCurrency } from "@/lib/format";
import type { GeneratedProduct } from "@/lib/wp-content";
import { categoryNameForProduct } from "@/lib/wp-content";

type ProductTemplateProps = {
  product: GeneratedProduct;
};

type Option = {
  label: string;
  price: number;
  regularPrice: number;
  disabled?: boolean;
};

type ProductPresentation = {
  discount: string;
  reviewCount: string;
  soldCount: string;
  buyerInitial: string;
  buyerName: string;
  buyerText: string;
  buyerTone: "green" | "purple" | "pink";
  description: string | null;
  soldPercent: string;
  remaining: string;
  packageOptions: Option[];
  durationOptions: Option[];
};

export function ProductTemplate({ product }: ProductTemplateProps) {
  const commerce = useCommerce();
  const categoryName = categoryNameForProduct(product);
  const presentation = useMemo(() => getProductPresentation(product), [product]);
  const [selectedPackage, setSelectedPackage] = useState(presentation.packageOptions[0]);
  const [selectedDuration, setSelectedDuration] = useState<Option | null>(
    presentation.durationOptions[0] ?? null,
  );
  const [activeImage, setActiveImage] = useState(product.featuredImage);
  const [toast, setToast] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "5" | "4">("all");
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([
    { id: 1, name: "Minh", rating: 5, text: "Nhận tài khoản nhanh, dùng ổn định." },
    { id: 2, name: "Lan", rating: 5, text: "Shop hỗ trợ đổi gói rất nhanh." },
    { id: 3, name: "Hoàng", rating: 4, text: "Giá tốt, hướng dẫn rõ ràng." },
  ]);
  const flashSaleEndsAtRef = useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: "11",
    hours: "06",
    minutes: "30",
    seconds: "00",
  });

  const selectedOption = selectedDuration ?? selectedPackage;
  const productSnapshot = {
    id: String(product.id),
    slug: product.path,
    title: product.title,
    image: product.featuredImage,
    price: selectedOption.price,
    regularPrice: selectedOption.regularPrice,
  };

  const gallery = [product.featuredImage].filter(Boolean) as string[];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.featuredImage ? [product.featuredImage] : undefined,
    description: replaceBrandText(product.excerpt),
    sku: String(product.id),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.6",
      reviewCount: presentation.reviewCount.replace(/\D/g, ""),
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: selectedOption.price,
      availability: "https://schema.org/InStock",
      url: `https://khotaikhoan.net/${product.path}/`,
    },
  };

  useEffect(() => {
    const endsAt = Date.now() + 11 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 30 * 60 * 1000;
    flashSaleEndsAtRef.current = endsAt;
    const tick = () => setTimeLeft(getCountdownParts(endsAt));
    const initialTick = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, []);

  function addToCart() {
    commerce.addToCart(productSnapshot, {
      variantLabel: selectedPackage.label,
      durationLabel: selectedDuration?.label,
    });
    setToast("Đã thêm sản phẩm vào giỏ hàng");
    window.setTimeout(() => setToast(null), 2200);
  }

  function buyNow() {
    commerce.addToCart(productSnapshot, {
      variantLabel: selectedPackage.label,
      durationLabel: selectedDuration?.label,
    });
    commerce.openCheckout();
  }

  function submitReview() {
    if (!reviewName.trim() || !reviewText.trim()) return;
    setReviews((current) => [
      { id: Date.now(), name: reviewName.trim(), rating: 5, text: reviewText.trim() },
      ...current,
    ]);
    setReviewName("");
    setReviewText("");
  }

  const visibleReviews = reviews.filter((review) =>
    reviewFilter === "all" ? true : String(review.rating) === reviewFilter,
  );

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {toast ? (
        <div className="fixed right-4 top-4 z-[90] rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      ) : null}

      <nav className="ktk-product-frame flex h-[70px] items-center overflow-hidden whitespace-nowrap text-[16px] text-slate-500 lg:h-[80px]">
        <span>Trang chủ</span>
        <span className="mx-2 text-slate-300">/</span>
        <span>Ứng dụng & Phần mềm khác</span>
        <span className="mx-2 text-slate-300">/</span>
        <span>{categoryName}</span>
        <span className="mx-2 text-slate-300">/</span>
        <strong className="text-slate-950">{product.title}</strong>
      </nav>

      <section className="ktk-product-frame grid gap-7 pb-8 lg:gap-6 lg:grid-cols-[526px_1fr]">
        <div>
          <div className="relative overflow-hidden rounded-[7px] bg-[#f8fafc]">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.title}
                width={900}
                height={900}
                priority
                sizes="(min-width: 1024px) 526px, 100vw"
                className="aspect-square h-auto w-full object-cover"
              />
            ) : (
              <div className="grid aspect-square place-items-center p-8 text-center text-sm font-bold text-muted">
                {product.title}
              </div>
            )}
            <span className="absolute left-0 top-4 rounded-r-full bg-[#15803d] px-3 py-1 text-[13px] font-extrabold text-white">
              {presentation.discount}
            </span>
          </div>
          {gallery.length ? (
            <div className="mt-3 hidden gap-2 lg:flex">
              {gallery.map((image) => (
                <button
                  key={image}
                  className={
                    image === activeImage
                      ? "relative size-16 overflow-hidden rounded-md border-2 border-primary"
                      : "relative size-16 overflow-hidden rounded-md border border-border"
                  }
                  type="button"
                  aria-label="Chọn ảnh sản phẩm"
                  onClick={() => setActiveImage(image)}
                >
                  <Image src={image} alt={product.title} fill className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="text-[27px] font-extrabold leading-tight text-slate-950 lg:text-[29px]">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px] text-slate-500">
            <span className="inline-flex items-center gap-0.5 text-[#ffb300]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  className="fill-current"
                  aria-hidden="true"
                />
              ))}
            </span>
            <strong className="text-slate-950">4.6</strong>
            <a className="font-bold text-[#15803d]" href="#reviews">
              {presentation.reviewCount} đánh giá
            </a>
            <span>·</span>
            <span>{presentation.soldCount} đã bán</span>
            <span className="w-full rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-extrabold text-emerald-700 lg:w-auto">
              Được đánh giá cao
            </span>
          </div>

          <div className="mt-5 flex h-[46px] items-center rounded-[8px] border border-[#e2e8f0] bg-white px-3 shadow-sm lg:mt-7">
            <span
              className={`mr-2 grid size-[30px] shrink-0 place-items-center rounded-full text-[16px] font-extrabold text-white ${
                presentation.buyerTone === "pink"
                  ? "bg-[#d41467]"
                  : presentation.buyerTone === "purple"
                    ? "bg-[#7c3aed]"
                    : "bg-[#0aa37f]"
              }`}
            >
              {presentation.buyerInitial}
            </span>
            <p className="text-[13px] font-semibold text-slate-500">
              <strong className="text-slate-800">{presentation.buyerName}</strong>{" "}
              {presentation.buyerText}
            </p>
          </div>

          <div className="mx-[-16px] mt-4 flex h-[40px] items-center gap-3 bg-[#f7f7f7] px-4 lg:mx-0">
            <del className="text-[20px] font-semibold text-slate-400">
              {formatCurrency(selectedOption.regularPrice)}
            </del>
            <span className="text-[27px] font-extrabold text-red-600">
              {formatCurrency(selectedOption.price)}
            </span>
          </div>

          {presentation.description ? (
            <p className="mt-3 text-[17px] leading-[1.55] text-slate-950">
              {presentation.description}
            </p>
          ) : null}

          <div className="mt-4 h-px bg-[#e5e7eb]" />

          <div className="mt-7 rounded-[8px] bg-gradient-to-r from-[#ff2f6d] to-[#ff6a32] p-3 text-white shadow-[0_14px_34px_rgba(255,47,109,0.25)]">
            <div className="mb-2 flex items-center justify-between gap-2 text-[12px] font-extrabold">
              <span className="rounded-full bg-white/20 px-3 py-1">
                ƯU ĐÃI ĐANG ÁP DỤNG
              </span>
              <div className="ml-auto flex min-w-0 items-center gap-1 text-right">
                <span className="hidden whitespace-nowrap lg:inline">KẾT THÚC SAU:</span>
                {[
                  [timeLeft.days, "NGÀY"],
                  [timeLeft.hours, "GIỜ"],
                  [timeLeft.minutes, "PHÚT"],
                  [timeLeft.seconds, "GIÂY"],
                ].map(([value, label]) => (
                  <span
                    key={label}
                    className="grid min-w-[30px] rounded-[5px] bg-white px-1 py-0.5 text-center leading-none text-[#ff315f] lg:min-w-[36px]"
                  >
                    <strong className="text-[13px] leading-none">{value}</strong>
                    <small className="mt-0.5 text-[7px] font-extrabold leading-none">
                      {label}
                    </small>
                  </span>
                ))}
              </div>
            </div>
            <div className="h-[6px] overflow-hidden rounded-full bg-white">
              <div className="h-full w-[89%] rounded-full bg-[#ffcc00]" />
            </div>
            <div className="mt-2 flex justify-between text-[13px] font-extrabold">
              <span>Đã bán {presentation.soldPercent}</span>
              <span>Còn {presentation.remaining}</span>
            </div>
          </div>

          <OptionGroup
            label="Loại gói:"
            options={presentation.packageOptions}
            selected={selectedPackage}
            onSelect={(option) => {
              setSelectedPackage(option);
              if (!presentation.durationOptions.length) setSelectedDuration(null);
            }}
          />

          {presentation.durationOptions.length ? (
            <OptionGroup
              label="Thời hạn:"
              options={presentation.durationOptions}
              selected={selectedDuration}
              onSelect={setSelectedDuration}
            />
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-primary px-5 font-extrabold text-white transition hover:bg-primary-strong"
              onClick={addToCart}
            >
              <ShoppingCart size={18} aria-hidden="true" />
              Thêm vào giỏ
            </button>
            <button
              type="button"
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-accent px-5 font-extrabold text-white transition hover:bg-orange-600"
              onClick={buyNow}
            >
              <Zap size={18} aria-hidden="true" />
              Mua ngay
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              [BadgeCheck, "Bảo hành 1 đổi 1"],
              [CheckCircle2, "CK ACB tự xác nhận"],
              [Zap, "Giao 5-15 phút"],
            ].map(([Icon, text]) => (
              <div
                key={text as string}
                className="flex items-center gap-2 rounded-[4px] border border-border px-3 py-2 text-sm font-bold text-slate-700"
              >
                <Icon size={18} className="text-primary" aria-hidden="true" />
                {text as string}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ktk-product-frame border-t border-[#eef2f7] py-8">
        <ContentBody html={product.contentHtml} />
      </section>

      <section id="reviews" className="ktk-product-frame border-t border-[#eef2f7] py-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">Đánh giá sản phẩm</h2>
            <p className="mt-1 text-sm text-muted">
              Lọc và gửi đánh giá mô phỏng trên frontend.
            </p>
          </div>
          <div className="flex gap-2">
            {[
              ["all", "Tất cả"],
              ["5", "5 sao"],
              ["4", "4 sao"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={
                  reviewFilter === value
                    ? "rounded-md bg-primary px-3 py-2 text-sm font-bold text-white"
                    : "rounded-md border border-border px-3 py-2 text-sm font-bold"
                }
                type="button"
                onClick={() => setReviewFilter(value as "all" | "5" | "4")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {visibleReviews.map((review) => (
              <article key={review.id} className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-950">{review.name}</h3>
                  <span className="text-sm font-bold text-[#ffb300]">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{review.text}</p>
              </article>
            ))}
          </div>
          <div className="rounded-md border border-border p-4">
            <h3 className="font-extrabold text-slate-950">Gửi đánh giá</h3>
            <input
              className="mt-3 h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary"
              placeholder="Tên của bạn"
              value={reviewName}
              onChange={(event) => setReviewName(event.currentTarget.value)}
            />
            <textarea
              className="mt-3 min-h-24 w-full rounded-md border border-border p-3 text-sm outline-none focus:border-primary"
              placeholder="Nội dung đánh giá"
              value={reviewText}
              onChange={(event) => setReviewText(event.currentTarget.value)}
            />
            <button
              className="mt-3 h-10 w-full rounded-md bg-primary text-sm font-extrabold text-white disabled:opacity-50"
              type="button"
              disabled={!reviewName.trim() || !reviewText.trim()}
              onClick={submitReview}
            >
              Gửi đánh giá 5 sao
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function OptionGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: Option[];
  selected: Option | null;
  onSelect: (option: Option) => void;
}) {
  return (
    <div className="mt-4">
      <div className="mb-3 text-[16px] font-extrabold text-slate-950">{label}</div>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.label}
            className={
              selected?.label === option.label
                ? "focus-ring h-[39px] rounded-[4px] bg-[#15803d] px-5 text-[15px] font-bold text-white"
                : option.disabled
                  ? "h-[39px] cursor-not-allowed rounded-[4px] border border-[#cfdbe8] bg-[#f8fbfb] px-5 text-[15px] font-medium text-slate-400 line-through"
                  : "focus-ring h-[39px] rounded-[4px] border border-[#cfdbe8] bg-[#f8fbfb] px-5 text-[15px] font-medium text-slate-700"
            }
            type="button"
            disabled={option.disabled}
            onClick={() => onSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function getProductPresentation(product: GeneratedProduct): ProductPresentation {
  if (product.path === "canva-pro") {
    return {
      discount: "-75%",
      reviewCount: "1,187",
      soldCount: "5.4k",
      buyerInitial: "Q",
      buyerName: "Quỳnh",
      buyerText: "vừa nâng cấp Pro vừa xong",
      buyerTone: "pink",
      description: null,
      soldPercent: "9%",
      remaining: "272",
      packageOptions: [{ label: "Dùng riêng", price: 189050, regularPrice: 479000 }],
      durationOptions: [
        { label: "12 tháng · Phổ biến nhất", price: 189050, regularPrice: 479000 },
        { label: "Vĩnh viễn", price: 489000, regularPrice: 990000 },
      ],
    };
  }

  return {
    discount: "-73%",
    reviewCount: "1,867",
    soldCount: "11.2k",
    buyerInitial: "H",
    buyerName: "Hiếu",
    buyerText: "vừa chọn Dùng chung - Plus · 1 tháng · 5 phút trước",
    buyerTone: "green",
    description: replaceBrandText(product.excerpt),
    soldPercent: "89%",
    remaining: "125",
    packageOptions: [
      { label: "Dùng chung - Plus", price: 147510, regularPrice: 499000 },
      { label: "Dùng riêng - Plus", price: 389000, regularPrice: 799000 },
      { label: "Chính chủ - Pro 5x", price: 1199000, regularPrice: 2199000, disabled: true },
      { label: "Chính chủ - Pro 20x", price: 4899000, regularPrice: 5999000, disabled: true },
    ],
    durationOptions: [],
  };
}

function getCountdownParts(end: number) {
  const diff = Math.max(0, end - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}
