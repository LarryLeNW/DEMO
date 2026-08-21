import type { Metadata } from "next";
import { ProductCard } from "@/features/catalog/components/product-card";
import { replaceBrandText } from "@/lib/brand";
import { generatedContent, type GeneratedProduct } from "@/lib/wp-content";
import type { Product } from "@/types/commerce";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  description: "Tìm kiếm sản phẩm tại AIHUB.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();
  const results = normalizedQuery
    ? generatedContent.products.filter((product) =>
        `${product.title} ${product.path} ${product.excerpt}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : [];

  return (
    <main className="bg-white">
      <section className="container-page py-8">
        <p className="text-sm font-extrabold uppercase text-primary-strong">Tìm kiếm</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
          {query ? `Kết quả cho “${query}”` : "Nhập từ khóa để tìm sản phẩm"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {query ? `Tìm thấy ${results.length} sản phẩm phù hợp.` : "Bạn có thể tìm theo tên sản phẩm, công cụ hoặc loại tài khoản."}
        </p>

        {query ? (
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={toCommerceProduct(product)} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function toCommerceProduct(product: GeneratedProduct): Product {
  return {
    id: String(product.id),
    slug: product.path,
    name: product.title,
    shortDescription: replaceBrandText(product.excerpt),
    categories: [],
    images: [
      {
        src:
          product.featuredImage ||
          "https://khotaikhoan.net/wp-content/uploads/2026/08/hypic-pro.webp",
        alt: product.title,
      },
    ],
    badges: ["Sale"],
    ratingAverage: 4.8,
    reviewCount: 100,
    soldCount: 1000 + (product.id % 700),
    variants: [
      {
        id: `${product.id}-default`,
        sku: `${product.id}`,
        attributes: { accountType: "Gói mặc định", duration: "1 tháng" },
        salePrice: 99000 + (product.id % 6) * 50000,
        regularPrice: 299000 + (product.id % 8) * 70000,
        stockStatus: "in_stock",
      },
    ],
  };
}
