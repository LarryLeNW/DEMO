import type { Category, Product } from "@/types/commerce";

const aiCategory: Category = {
  id: "cat_ai",
  name: "Công Cụ AI",
  slug: "cong-cu-ai",
  href: "/ung-dung-phan-mem-khac/cong-cu-ai",
  description: "ChatGPT, Claude, Cursor, Gemini và công cụ AI phục vụ công việc.",
  productCount: 24,
};

export const categories: Category[] = [
  aiCategory,
  {
    id: "cat_study",
    name: "Tài khoản học tập",
    slug: "tai-khoan-hoc-tap",
    href: "#",
    description: "Các nền tảng học, ngoại ngữ, tài liệu và luyện kỹ năng.",
    productCount: 18,
  },
  {
    id: "cat_work",
    name: "Làm việc",
    slug: "lam-viec",
    href: "#",
    description: "Office, design, storage, productivity và collaboration.",
    productCount: 31,
  },
  {
    id: "cat_security",
    name: "Bảo mật & VPN",
    slug: "bao-mat-vpn",
    href: "#",
    description: "VPN, password manager, antivirus và công cụ bảo vệ thiết bị.",
    productCount: 14,
  },
];

export const products: Product[] = [
  {
    id: "prod_chatgpt_plus",
    slug: "tai-khoan-chatgpt-plus",
    name: "Tài khoản ChatGPT Plus & Pro (GPT-5.6)",
    shortDescription:
      "ChatGPT Plus dùng chung từ 149.000đ/tháng, dùng riêng/chính chủ từ 449.000đ. CK ACB tự xác nhận, giao 5-15 phút.",
    categories: [aiCategory],
    images: [
      {
        src: "https://khotaikhoan.net/wp-content/uploads/2026/05/chatgpt-plus-pro.webp",
        alt: "Mua tài khoản ChatGPT Plus & Pro giá rẻ",
      },
    ],
    badges: ["Giảm sâu"],
    ratingAverage: 4.8,
    reviewCount: 1867,
    soldCount: 5200,
    variants: [
      {
        id: "var_chatgpt_shared_1m",
        sku: "GPT-SHARED-1M",
        attributes: { accountType: "Dùng chung - Plus", duration: "1 tháng" },
        salePrice: 149000,
        regularPrice: 299000,
        stockStatus: "in_stock",
      },
      {
        id: "var_chatgpt_shared_3m",
        sku: "GPT-SHARED-3M",
        attributes: { accountType: "Dùng chung - Plus", duration: "3 tháng" },
        salePrice: 399000,
        regularPrice: 799000,
        stockStatus: "in_stock",
      },
      {
        id: "var_chatgpt_private_1m",
        sku: "GPT-PRIVATE-1M",
        attributes: { accountType: "Dùng riêng - Plus", duration: "1 tháng" },
        salePrice: 469000,
        regularPrice: 529000,
        stockStatus: "in_stock",
      },
      {
        id: "var_chatgpt_pro_1m",
        sku: "GPT-PRO-20X-1M",
        attributes: { accountType: "Chính chủ - Pro 20x", duration: "1 tháng" },
        salePrice: 5489000,
        regularPrice: 5990000,
        stockStatus: "in_stock",
      },
    ],
  },
  {
    id: "prod_claude",
    slug: "claude-pro",
    name: "Tài khoản Claude Pro / Max",
    shortDescription:
      "Phù hợp viết dài, research, phân tích tài liệu và coding với context lớn.",
    categories: [aiCategory],
    images: [
      {
        src: "https://khotaikhoan.net/wp-content/uploads/2026/02/Claude-AI.webp",
        alt: "Tài khoản Claude AI Pro",
      },
    ],
    badges: ["Hot"],
    ratingAverage: 4.7,
    reviewCount: 932,
    soldCount: 2600,
    variants: [
      {
        id: "var_claude_1m",
        sku: "CLAUDE-PRO-1M",
        attributes: { accountType: "Claude Pro", duration: "1 tháng" },
        salePrice: 299000,
        regularPrice: 399000,
        stockStatus: "in_stock",
      },
    ],
  },
  {
    id: "prod_cursor",
    slug: "cursor-pro",
    name: "Tài khoản Cursor Pro",
    shortDescription:
      "IDE AI cho lập trình viên, hỗ trợ codebase lớn và workflow agent.",
    categories: [aiCategory],
    images: [
      {
        src: "https://khotaikhoan.net/wp-content/uploads/2025/07/cursor-pro.webp",
        alt: "Tài khoản Cursor Pro",
      },
    ],
    badges: ["Dev"],
    ratingAverage: 4.6,
    reviewCount: 741,
    soldCount: 1700,
    variants: [
      {
        id: "var_cursor_1m",
        sku: "CURSOR-PRO-1M",
        attributes: { accountType: "Cursor Pro", duration: "1 tháng" },
        salePrice: 249000,
        regularPrice: 399000,
        stockStatus: "in_stock",
      },
    ],
  },
  {
    id: "prod_gemini",
    slug: "gemini-advanced",
    name: "Google Gemini Advanced",
    shortDescription:
      "Gói AI của Google cho Workspace, research, văn bản và xử lý đa phương tiện.",
    categories: [aiCategory],
    images: [
      {
        src: "https://khotaikhoan.net/wp-content/uploads/2026/01/Gemini-Advanced.webp",
        alt: "Google Gemini Advanced",
      },
    ],
    badges: ["AI"],
    ratingAverage: 4.5,
    reviewCount: 512,
    soldCount: 980,
    variants: [
      {
        id: "var_gemini_1m",
        sku: "GEMINI-ADV-1M",
        attributes: { accountType: "Gemini Advanced", duration: "1 tháng" },
        salePrice: 189000,
        regularPrice: 299000,
        stockStatus: "in_stock",
      },
    ],
  },
];

export const featuredProducts = [products[0]];

export function getProductBySlug(slug: string) {
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error(`Product not found: ${slug}`);
  }

  return product;
}
