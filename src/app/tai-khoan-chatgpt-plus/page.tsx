import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductTemplate } from "@/components/wp/product-template";
import { replaceBrandText } from "@/lib/brand";
import { getGeneratedRoute, isGeneratedProduct } from "@/lib/wp-content";

const route = getGeneratedRoute("tai-khoan-chatgpt-plus");

export const metadata: Metadata = route
  ? {
      title: replaceBrandText(route.title),
      description: replaceBrandText(route.excerpt),
    }
  : {};

export default function ChatGptProductPage() {
  if (!route || !isGeneratedProduct(route)) {
    notFound();
  }

  return <ProductTemplate product={route} />;
}
