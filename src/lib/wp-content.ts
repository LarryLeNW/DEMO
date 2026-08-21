import wpContent from "@/data/generated/wp-content.json";

export type GeneratedRoute = (typeof wpContent.routes)[number];
export type GeneratedProduct = (typeof wpContent.products)[number];
export type GeneratedCategory = (typeof wpContent.productCategories)[number];
export type GeneratedPost = (typeof wpContent.posts)[number];

export const generatedContent = wpContent;

export function normalizePath(slug: string[] | string) {
  const parts = Array.isArray(slug) ? slug : [slug];
  return parts.filter(Boolean).join("/").replace(/^\/|\/$/g, "");
}

export function getGeneratedRoute(path: string) {
  return generatedContent.routes.find((route) => route.path === path);
}

export function getGeneratedCategory(id: number) {
  return generatedContent.productCategories.find((category) => category.id === id);
}

export function getProductsForCategory(category: GeneratedCategory) {
  const childIds = generatedContent.productCategories
    .filter((item) => item.id === category.id || item.parent === category.id)
    .map((item) => item.id);

  return generatedContent.products.filter((product) =>
    product.categories.some((categoryId) => childIds.includes(categoryId)),
  );
}

export function categoryNameForProduct(product: GeneratedProduct) {
  const category = product.categories
    .map((categoryId) => getGeneratedCategory(categoryId))
    .find(Boolean);

  return category?.title ?? "Sản phẩm";
}

export function isGeneratedProduct(route: GeneratedRoute): route is GeneratedProduct {
  return route.kind === "product";
}

export function isGeneratedCategory(route: GeneratedRoute): route is GeneratedCategory {
  return route.kind === "productCategory";
}
