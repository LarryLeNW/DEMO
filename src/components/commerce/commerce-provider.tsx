"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShoppingCart,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { generatedContent } from "@/lib/wp-content";

export type CommerceProductSnapshot = {
  id: string;
  slug: string;
  title: string;
  image?: string;
  price: number;
  regularPrice?: number;
};

export type CartLine = CommerceProductSnapshot & {
  lineId: string;
  variantLabel: string;
  durationLabel?: string;
  quantity: number;
};

type CheckoutDraft = {
  name: string;
  phone: string;
  email: string;
  note: string;
  paymentMethod: "bank" | "zalo";
};

type CommerceContextValue = {
  cart: CartLine[];
  wishlist: CommerceProductSnapshot[];
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  isWishlisted: (slug: string) => boolean;
  addToCart: (
    product: CommerceProductSnapshot,
    options?: { variantLabel?: string; durationLabel?: string; quantity?: number },
  ) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  toggleWishlist: (product: CommerceProductSnapshot) => void;
  openCart: () => void;
  openWishlist: () => void;
  openAccount: () => void;
  openCheckout: () => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

const cartStorageKey = "ktk.cart.v1";
const wishlistStorageKey = "ktk.wishlist.v1";

function normalizeWishlist(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) =>
      typeof item === "string"
        ? wishlistSnapshotFromSlug(item)
        : wishlistSnapshotFromStoredItem(item),
    )
    .filter((item): item is CommerceProductSnapshot => Boolean(item));
}

function wishlistSnapshotFromStoredItem(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Partial<CommerceProductSnapshot>;

  if (!item.slug || typeof item.slug !== "string") {
    return null;
  }

  const fallback = wishlistSnapshotFromSlug(item.slug);

  return {
    id: String(item.id ?? fallback?.id ?? item.slug),
    slug: item.slug,
    title: String(item.title ?? fallback?.title ?? `/${item.slug}`),
    image: typeof item.image === "string" ? item.image : fallback?.image,
    price: typeof item.price === "number" ? item.price : fallback?.price ?? 0,
    regularPrice:
      typeof item.regularPrice === "number"
        ? item.regularPrice
        : fallback?.regularPrice,
  };
}

function wishlistSnapshotFromSlug(slug: string): CommerceProductSnapshot {
  const product = generatedContent.products.find(
    (item) => item.path === slug || item.slug === slug,
  );

  return {
    id: String(product?.id ?? slug),
    slug: product?.path ?? slug,
    title: product?.title ?? `/${slug}`,
    image: product?.featuredImage,
    price: product ? 99000 : 0,
    regularPrice: product ? 199000 : undefined,
  };
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<CommerceProductSnapshot[]>([]);
  const [drawer, setDrawer] = useState<"cart" | "wishlist" | "account" | "checkout" | null>(
    null,
  );
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft>({
    name: "",
    phone: "",
    email: "",
    note: "",
    paymentMethod: "bank",
  });
  const [orderCode, setOrderCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCart = window.localStorage.getItem(cartStorageKey);
        const savedWishlist = window.localStorage.getItem(wishlistStorageKey);
        if (savedCart) setCart(JSON.parse(savedCart) as CartLine[]);
        if (savedWishlist) setWishlist(normalizeWishlist(JSON.parse(savedWishlist)));
      } catch {
        setCart([]);
        setWishlist([]);
      } finally {
        setHasLoadedStorage(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, hasLoadedStorage]);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    window.localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
  }, [hasLoadedStorage, wishlist]);

  const addToCart = useCallback<CommerceContextValue["addToCart"]>(
    (product, options) => {
      const variantLabel = options?.variantLabel ?? "Gói mặc định";
      const durationLabel = options?.durationLabel;
      const lineKey = `${product.slug}::${variantLabel}::${durationLabel ?? ""}`;
      const quantity = options?.quantity ?? 1;

      setCart((current) => {
        const existing = current.find((item) => item.lineId === lineKey);
        if (existing) {
          return current.map((item) =>
            item.lineId === lineKey
              ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
              : item,
          );
        }

        return [
          ...current,
          {
            ...product,
            lineId: lineKey,
            variantLabel,
            durationLabel,
            quantity,
          },
        ];
      });
      setDrawer("cart");
    },
    [],
  );

  const removeFromCart = useCallback((lineId: string) => {
    setCart((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setCart((current) =>
      current.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, 99)) }
          : item,
      ),
    );
  }, []);

  const toggleWishlist = useCallback((product: CommerceProductSnapshot) => {
    setWishlist((current) =>
      current.some((item) => item.slug === product.slug)
        ? current.filter((item) => item.slug !== product.slug)
        : [product, ...current],
    );
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const value = useMemo<CommerceContextValue>(
    () => ({
      cart,
      wishlist,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
      subtotal,
      isWishlisted: (slug) => wishlist.some((item) => item.slug === slug),
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      openCart: () => setDrawer("cart"),
      openWishlist: () => setDrawer("wishlist"),
      openAccount: () => setDrawer("account"),
      openCheckout: () => setDrawer("checkout"),
    }),
    [addToCart, cart, removeFromCart, subtotal, toggleWishlist, updateQuantity, wishlist],
  );

  function submitCheckout() {
    const nextCode = `KTK${Date.now().toString().slice(-7)}`;
    setOrderCode(nextCode);
    window.localStorage.setItem(
      "ktk.lastOrder.v1",
      JSON.stringify({ code: nextCode, cart, checkoutDraft, total: subtotal }),
    );
    setCart([]);
  }

  return (
    <CommerceContext.Provider value={value}>
      {children}
      {drawer ? (
        <div className="fixed inset-0 z-[80]">
          <button
            className="absolute inset-0 bg-slate-950/40"
            type="button"
            aria-label="Đóng"
            onClick={() => setDrawer(null)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-[70vw] min-w-[270px] max-w-[420px] flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <h2 className="inline-flex items-center gap-2 text-lg font-extrabold text-slate-950">
                {drawer === "cart" ? <ShoppingCart size={20} /> : null}
                {drawer === "wishlist" ? <Heart size={20} /> : null}
                {drawer === "account" ? <UserRound size={20} /> : null}
                {drawer === "checkout" ? <PackageCheck size={20} /> : null}
                {drawer === "cart"
                  ? "Giỏ hàng"
                  : drawer === "wishlist"
                    ? "Yêu thích"
                    : drawer === "account"
                      ? "Tài khoản"
                      : "Thanh toán"}
              </h2>
              <button
                className="focus-ring grid size-9 place-items-center rounded-full hover:bg-slate-100"
                type="button"
                aria-label="Đóng"
                onClick={() => setDrawer(null)}
              >
                <X size={20} />
              </button>
            </div>

            {drawer === "cart" ? (
              <CartDrawer
                cart={cart}
                subtotal={subtotal}
                onCheckout={() => setDrawer("checkout")}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ) : null}

            {drawer === "wishlist" ? (
              <WishlistDrawer
                wishlist={wishlist}
                onRemove={(slug) =>
                  setWishlist((current) => current.filter((item) => item.slug !== slug))
                }
              />
            ) : null}

            {drawer === "account" ? <AccountDrawer /> : null}

            {drawer === "checkout" ? (
              <CheckoutDrawer
                cart={cart}
                draft={checkoutDraft}
                orderCode={orderCode}
                subtotal={subtotal}
                onChange={setCheckoutDraft}
                onSubmit={submitCheckout}
              />
            ) : null}
          </aside>
        </div>
      ) : null}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error("useCommerce must be used inside CommerceProvider");
  }
  return context;
}

function CartDrawer({
  cart,
  subtotal,
  onCheckout,
  onRemove,
  onUpdateQuantity,
}: {
  cart: CartLine[];
  subtotal: number;
  onCheckout: () => void;
  onRemove: (lineId: string) => void;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
}) {
  if (!cart.length) {
    return (
      <div className="grid flex-1 place-items-center p-6 text-center">
        <div>
          <ShoppingCart className="mx-auto text-slate-300" size={46} />
          <p className="mt-4 font-bold text-slate-700">Giỏ hàng đang trống</p>
          <p className="mt-2 text-sm text-muted">Chọn gói sản phẩm để bắt đầu đơn hàng.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4 overflow-auto p-5">
        {cart.map((item) => (
          <div key={item.lineId} className="rounded-md border border-border p-3">
            <div className="flex gap-3">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-16 rounded-md object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/${item.slug}`}
                  className="line-clamp-2 font-extrabold text-slate-950"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-xs font-semibold text-muted">
                  {item.variantLabel}
                  {item.durationLabel ? ` · ${item.durationLabel}` : ""}
                </p>
                <p className="mt-2 font-extrabold text-primary-strong">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="inline-flex h-9 items-center rounded-md border border-border">
                <button
                  className="grid size-9 place-items-center"
                  type="button"
                  aria-label="Giảm số lượng"
                  onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)}
                >
                  <Minus size={15} />
                </button>
                <span className="min-w-8 text-center text-sm font-bold">
                  {item.quantity}
                </span>
                <button
                  className="grid size-9 place-items-center"
                  type="button"
                  aria-label="Tăng số lượng"
                  onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
                >
                  <Plus size={15} />
                </button>
              </div>
              <button
                className="inline-flex items-center gap-1 text-sm font-bold text-danger"
                type="button"
                onClick={() => onRemove(item.lineId)}
              >
                <Trash2 size={16} />
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-5">
        <div className="mb-4 flex items-center justify-between font-extrabold">
          <span>Tạm tính</span>
          <span className="text-primary-strong">{formatCurrency(subtotal)}</span>
        </div>
        <button
          className="focus-ring h-12 w-full rounded-md bg-primary font-extrabold text-white"
          type="button"
          onClick={onCheckout}
        >
          Tiến hành thanh toán
        </button>
      </div>
    </>
  );
}

function WishlistDrawer({
  wishlist,
  onRemove,
}: {
  wishlist: CommerceProductSnapshot[];
  onRemove: (slug: string) => void;
}) {
  return (
    <div className="flex-1 overflow-auto p-5">
      {wishlist.length ? (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div key={item.slug} className="rounded-md border border-border p-3">
              <div className="flex gap-3">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="grid size-16 shrink-0 place-items-center rounded-md bg-surface-muted text-xs font-extrabold text-primary-strong">
                    AI
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${item.slug}`}
                    className="line-clamp-2 font-extrabold text-slate-950 hover:text-primary-strong"
                  >
                    {item.title}
                  </Link>
                  {item.price > 0 ? (
                    <div className="mt-2">
                      <p className="font-extrabold text-primary-strong">
                        {formatCurrency(item.price)}
                      </p>
                      {item.regularPrice && item.regularPrice > item.price ? (
                        <p className="text-xs font-semibold text-slate-400 line-through">
                          {formatCurrency(item.regularPrice)}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  href={`/${item.slug}`}
                  className="text-sm font-bold text-primary-strong"
                >
                  Xem sản phẩm
                </Link>
                <button
                  className="inline-flex items-center gap-1 text-sm font-bold text-danger"
                  type="button"
                  onClick={() => onRemove(item.slug)}
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid h-full place-items-center text-center">
          <div>
            <Heart className="mx-auto text-slate-300" size={46} />
            <p className="mt-4 font-bold text-slate-700">Chưa có sản phẩm yêu thích</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountDrawer() {
  return (
    <div className="space-y-4 p-5">
      <p className="text-sm leading-6 text-muted">
        Khu vực tài khoản mô phỏng cho clone frontend. Khi nối backend, form này sẽ
        chuyển sang login/register thật.
      </p>
      {["Email hoặc số điện thoại", "Mật khẩu"].map((label) => (
        <label key={label} className="block text-sm font-bold text-slate-800">
          {label}
          <input
            className="mt-2 h-11 w-full rounded-md border border-border px-3 outline-none focus:border-primary"
            type={label.includes("Mật") ? "password" : "text"}
          />
        </label>
      ))}
      <button className="h-11 w-full rounded-md bg-primary font-extrabold text-white">
        Đăng nhập
      </button>
      <button className="h-11 w-full rounded-md border border-border font-extrabold text-slate-800">
        Tạo tài khoản
      </button>
    </div>
  );
}

function CheckoutDrawer({
  cart,
  draft,
  orderCode,
  subtotal,
  onChange,
  onSubmit,
}: {
  cart: CartLine[];
  draft: CheckoutDraft;
  orderCode: string | null;
  subtotal: number;
  onChange: (draft: CheckoutDraft) => void;
  onSubmit: () => void;
}) {
  if (orderCode) {
    return (
      <div className="grid flex-1 place-items-center p-6 text-center">
        <div>
          <PackageCheck className="mx-auto text-success" size={52} />
          <h3 className="mt-4 text-xl font-extrabold text-slate-950">
            Đã tạo đơn {orderCode}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Đây là luồng checkout mô phỏng. Khi nối backend, đơn sẽ được gửi lên API,
            xác nhận chuyển khoản và gửi tài khoản qua email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-5">
      <div className="mb-4 rounded-md bg-surface-muted p-3 text-sm">
        <div className="flex justify-between font-extrabold">
          <span>{cart.length} sản phẩm</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>
      <div className="space-y-4">
        {[
          ["name", "Họ tên", "text"],
          ["phone", "Số điện thoại", "tel"],
          ["email", "Email nhận tài khoản", "email"],
        ].map(([field, label, type]) => (
          <label key={field} className="block text-sm font-bold text-slate-800">
            {label}
            <input
              className="mt-2 h-11 w-full rounded-md border border-border px-3 outline-none focus:border-primary"
              type={type}
              value={draft[field as keyof CheckoutDraft]}
              onChange={(event) =>
                onChange({ ...draft, [field]: event.currentTarget.value })
              }
            />
          </label>
        ))}
        <label className="block text-sm font-bold text-slate-800">
          Ghi chú
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border border-border p-3 outline-none focus:border-primary"
            value={draft.note}
            onChange={(event) => onChange({ ...draft, note: event.currentTarget.value })}
          />
        </label>
        <div className="grid gap-2">
          {[
            ["bank", "Chuyển khoản ACB / QR"],
            ["zalo", "Liên hệ Zalo để xác nhận"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-border p-3 text-sm font-bold"
            >
              <input
                type="radio"
                checked={draft.paymentMethod === value}
                onChange={() =>
                  onChange({ ...draft, paymentMethod: value as CheckoutDraft["paymentMethod"] })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <button
          className="h-12 w-full rounded-md bg-accent font-extrabold text-white disabled:opacity-50"
          type="button"
          disabled={!cart.length || !draft.email || !draft.phone}
          onClick={onSubmit}
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}
