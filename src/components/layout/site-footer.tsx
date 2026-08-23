import Link from "next/link";
import { siteConfig } from "@/config/site";
import { generatedContent, type GeneratedCategory } from "@/lib/wp-content";

const policyLinks = [
  { href: "/huong-dan-mua-hang", label: "Hướng dẫn mua hàng" },
  { href: "/chinh-sach-bao-hanh", label: "Chính sách bảo hành" },
  { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { href: "/dieu-khoan-dich-vu", label: "Điều khoản dịch vụ" },
];

export function SiteFooter() {
  const categories = (generatedContent as { productCategories: GeneratedCategory[] }).productCategories
    .filter((category) => category.parent === 0)
    .slice(0, 5);

  return (
    <footer className="mt-10 border-t border-border bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950">
            {siteConfig.name}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            {siteConfig.description}
          </p>
          <p className="mt-4 text-sm font-bold text-slate-700">
            Email:{" "}
            <a href={`mailto:${siteConfig.email}`} className="hover:text-primary-strong">
              {siteConfig.email}
            </a>
          </p>
          <p className="mt-1 text-sm font-bold text-slate-700">
            Hotline:{" "}
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-primary-strong">
              {siteConfig.phone}
            </a>
          </p>
        </div>
        <div>
          <h3 className="font-extrabold text-slate-950">Danh mục</h3>
          <div className="mt-3 grid gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.path}`}
                className="text-sm font-semibold text-muted transition hover:text-primary-strong"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-extrabold text-slate-950">Chính sách</h3>
          <div className="mt-3 grid gap-2">
            {policyLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-muted transition hover:text-primary-strong"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
