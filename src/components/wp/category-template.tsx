import Link from "next/link";
import { CategoryProductBrowser } from "@/components/wp/category-product-browser";
import { ContentBody } from "@/components/wp/content-body";
import { replaceBrandText } from "@/lib/brand";
import type { GeneratedCategory } from "@/lib/wp-content";
import { getProductsForCategory } from "@/lib/wp-content";
import type { Product } from "@/types/commerce";

type CategoryTemplateProps = {
  category: GeneratedCategory;
};

export function CategoryTemplate({ category }: CategoryTemplateProps) {
  const products = getProductsForCategory(category);
  const { introHtml, articleHtml } = splitCategoryHtml(category.contentHtml);

  return (
    <main className="bg-[#f5f5f5]">
      <section className="bg-white py-5">
        <div className="ktk-category-frame">
        <div className="mb-3 flex flex-col gap-2 text-[16px] text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <nav className="overflow-hidden whitespace-nowrap">
            <Link href="/">Trang chủ</Link>
            <span className="mx-2 text-slate-300">/</span>
            <Link href="/ung-dung-phan-mem-khac">Ứng dụng & Phần mềm khác</Link>
            <span className="mx-2 text-slate-300">/</span>
            <strong className="text-slate-950">{category.title}</strong>
          </nav>
          <p className="hidden text-[16px] text-slate-950 lg:block">
            Hiển thị 1-12 của {products.length} kết quả
          </p>
        </div>

        {introHtml ? (
          <ContentBody html={introHtml} />
        ) : (
          <div className="wp-content">
            <h1>{category.title}</h1>
            <p>{replaceBrandText(category.excerpt)}</p>
          </div>
        )}
        </div>
      </section>

      <CategoryProductBrowser products={products.map((product) => toCommerceProduct(product))} />

      {articleHtml ? (
        <section className="ktk-category-frame pb-10">
          <ContentBody html={articleHtml} />
        </section>
      ) : null}
    </main>
  );
}

function splitCategoryHtml(html: string) {
  const splitAt = html.indexOf("<h2");
  if (splitAt === -1) {
    return { introHtml: html, articleHtml: "" };
  }

  return {
    introHtml: html.slice(0, splitAt),
    articleHtml: html.slice(splitAt),
  };
}

function toCommerceProduct(product: ReturnType<typeof getProductsForCategory>[number]): Product {
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
