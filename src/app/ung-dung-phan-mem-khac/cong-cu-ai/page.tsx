import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryTemplate } from "@/components/wp/category-template";
import { replaceBrandText } from "@/lib/brand";
import { getGeneratedRoute, isGeneratedCategory } from "@/lib/wp-content";

const route = getGeneratedRoute("ung-dung-phan-mem-khac/cong-cu-ai");

export const metadata: Metadata = route
  ? {
      title: replaceBrandText(route.title),
      description: replaceBrandText(route.excerpt),
    }
  : {};

export default function AiToolsCategoryPage() {
  if (!route || !isGeneratedCategory(route)) {
    notFound();
  }

  return <CategoryTemplate category={route} />;
}
