export type Category = {
  id: string;
  name: string;
  slug: string;
  href: string;
  description: string;
  productCount: number;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  attributes: {
    accountType: string;
    duration: string;
  };
  salePrice: number;
  regularPrice?: number;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  categories: Category[];
  images: ProductImage[];
  badges: string[];
  ratingAverage: number;
  reviewCount: number;
  soldCount: number;
  variants: ProductVariant[];
};
