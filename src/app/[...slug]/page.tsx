import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutTemplate } from "@/components/wp/about-template";
import { ArticleTemplate } from "@/components/wp/article-template";
import { BlogTemplate } from "@/components/wp/blog-template";
import { CategoryTemplate } from "@/components/wp/category-template";
import { ProductTemplate } from "@/components/wp/product-template";
import { replaceBrandText } from "@/lib/brand";
import {
  generatedContent,
  getGeneratedRoute,
  isGeneratedCategory,
  isGeneratedProduct,
  normalizePath,
} from "@/lib/wp-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return generatedContent.routes.map((route) => ({
    slug: route.path.split("/"),
  }));
}

export async function generateMetadata(
  props: PageProps<"/[...slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = getGeneratedRoute(normalizePath(params.slug));

  if (!page) {
    return {};
  }

  if (page.path === "blog") {
    return {
      title: "Blog Hướng Dẫn & Review",
      description:
        "Hướng dẫn sử dụng, so sánh và cập nhật những công cụ số đáng chú ý để bạn chọn đúng tài khoản và dùng hiệu quả hơn.",
    };
  }

  if (page.path === "gioi-thieu") {
    return {
      title: "Giới thiệu AIHUB",
      description:
        "AIHUB cung cấp tài khoản số, công cụ AI và phần mềm bản quyền với quy trình mua hàng rõ ràng, dễ nhận hàng và có hỗ trợ sau bán.",
      openGraph: {
        title: "Giới thiệu AIHUB",
        description:
          "Tìm hiểu cách AIHUB vận hành đơn hàng, giao tài khoản và hỗ trợ khách hàng sau khi mua.",
      },
    };
  }

  return {
    title: replaceBrandText(page.title),
    description: replaceBrandText(page.excerpt),
    openGraph: {
      title: replaceBrandText(page.title),
      description: replaceBrandText(page.excerpt),
      images: page.featuredImage ? [page.featuredImage] : undefined,
    },
  };
}

export default async function CatchAllPage(props: PageProps<"/[...slug]">) {
  const params = await props.params;
  const page = getGeneratedRoute(normalizePath(params.slug));

  if (!page) {
    notFound();
  }

  if (isGeneratedProduct(page)) {
    return <ProductTemplate product={page} />;
  }

  if (isGeneratedCategory(page)) {
    return <CategoryTemplate category={page} />;
  }

  if (page.path === "blog") {
    return <BlogTemplate page={page} />;
  }

  if (page.path === "gioi-thieu") {
    return <AboutTemplate page={page} />;
  }

  return <ArticleTemplate page={page} />;
}
