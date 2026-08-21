import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import {
  generatedContent,
  type GeneratedPost,
  type GeneratedRoute,
} from "@/lib/wp-content";
import { replaceBrandText } from "@/lib/brand";

type BlogTemplateProps = {
  page: GeneratedRoute;
};

const topicTabs = [
  "Tất cả",
  "Hướng dẫn & Thủ thuật",
  "So sánh & Review",
  "Xu hướng & Tin tức",
];

const categoryLabels: Record<number, string> = {
  1: "BLOG",
  572: "HƯỚNG DẪN & THỦ THUẬT",
  633: "XU HƯỚNG & TIN TỨC",
  905: "SO SÁNH & REVIEW",
};

const publishDateOverrides: Record<string, string> = {
  "gpt-5-6-la-gi": "10/07/2026",
  "chatgpt-plus-dung-rieng-hay-dung-chung": "11/06/2026",
  "claude-code-la-gi": "10/06/2026",
  "claude-max-5x-vs-20x": "10/06/2026",
  "nen-mua-chatgpt-plus-hay-claude-pro": "27/05/2026",
  "huong-dan-khac-phuc-loi-tao-tai-khoan-claude-ai-bi-chan-o-viet-nam-2026":
    "13/05/2026",
  "cach-nhan-chatgpt-plus-mien-phi-1-thang": "12/05/2026",
  "autodesk-la-phan-mem-gi": "04/04/2026",
  "huong-dan-kich-hoat-windows": "15/01/2026",
  "adobe-creative-cloud-la-gi": "02/10/2025",
  "cach-su-dung-ejoy-pro-hieu-qua": "24/09/2025",
  "canva-pro-cho-giao-vien-mien-phi": "20/04/2025",
  "tong-hop-3-cach-mua-adobe-ban-quyen-re-hop-phap-khong-bi-lua": "19/04/2025",
};

const readingTimeOverrides: Record<string, number> = {
  "gpt-5-6-la-gi": 11,
  "chatgpt-plus-dung-rieng-hay-dung-chung": 8,
  "claude-code-la-gi": 6,
  "claude-max-5x-vs-20x": 6,
  "nen-mua-chatgpt-plus-hay-claude-pro": 6,
  "huong-dan-khac-phuc-loi-tao-tai-khoan-claude-ai-bi-chan-o-viet-nam-2026": 8,
  "cach-nhan-chatgpt-plus-mien-phi-1-thang": 8,
  "autodesk-la-phan-mem-gi": 9,
  "huong-dan-kich-hoat-windows": 11,
  "adobe-creative-cloud-la-gi": 7,
  "cach-su-dung-ejoy-pro-hieu-qua": 7,
  "canva-pro-cho-giao-vien-mien-phi": 7,
  "tong-hop-3-cach-mua-adobe-ban-quyen-re-hop-phap-khong-bi-lua": 7,
};

export function BlogTemplate({ page }: BlogTemplateProps) {
  const posts = generatedContent.posts;
  const [featuredPost, ...restPosts] = posts;
  const compactFeaturedPosts = restPosts.slice(0, 2);
  const highlightPost = posts[3];
  const gridPosts = posts.slice(4, 13);
  const popularPosts = [posts[0], posts[2], posts[1], posts[92]].filter(Boolean);
  const fallbackDescription = decodeText(page.excerpt);
  const description =
    "Hướng dẫn sử dụng, so sánh và cập nhật những công cụ số đáng chú ý để bạn chọn đúng tài khoản và dùng hiệu quả hơn.";

  return (
    <main className="bg-[#f5f5f5] text-slate-950">
      <section className="ktk-blog-frame pt-12 pb-9 md:pt-[70px]">
        <h1 className="text-[34px] font-extrabold leading-tight tracking-normal md:text-[42px]">
          Blog AIHUB
        </h1>
        <p className="mt-3 max-w-[690px] text-[16px] font-medium leading-7 text-slate-600">
          {description || fallbackDescription}
        </p>

        {featuredPost ? (
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_450px]">
            <FeaturedPostCard post={featuredPost} />
            <div className="flex flex-col gap-3">
              {compactFeaturedPosts.map((post) => (
                <CompactFeatureCard key={post.id} post={post} />
              ))}
              <p className="mt-auto hidden text-center text-[13px] font-medium text-slate-500 lg:block">
                Chọn chủ đề để tìm nhanh nội dung phù hợp với nhu cầu của bạn.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <h2 className="text-[26px] font-extrabold leading-none">
            Bài viết mới nhất
          </h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {topicTabs.map((topic, index) => (
              <Link
                key={topic}
                href={index === 0 ? "/blog" : `/blog?topic=${encodeURIComponent(topic)}`}
                className={
                  index === 0
                    ? "rounded-full bg-[#15803d] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-sm"
                    : "rounded-full border border-[#dfe7f2] bg-white px-5 py-2.5 text-[13px] font-extrabold text-slate-700 shadow-sm transition hover:border-[#15803d] hover:text-[#15803d]"
                }
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            {highlightPost ? <WidePostCard post={highlightPost} /> : null}
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {gridPosts.map((post) => (
                <PostGridCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination />
          </div>

          <aside className="hidden lg:block">
            <SidebarPanel title="Đọc nhiều nhất">
              <div className="grid gap-3">
                {popularPosts.map((post) => (
                  <PopularPost key={post.id} post={post} />
                ))}
              </div>
            </SidebarPanel>

            <SidebarPanel title="Chủ đề" className="mt-5">
              <div className="flex flex-wrap gap-2">
                {topicTabs.slice(1).map((topic) => (
                  <Link
                    key={topic}
                    href={`/blog?topic=${encodeURIComponent(topic)}`}
                    className="rounded-full border border-[#dfe7f2] bg-white px-4 py-2 text-[13px] font-extrabold text-slate-600 transition hover:border-[#15803d] hover:text-[#15803d]"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </SidebarPanel>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FeaturedPostCard({ post }: { post: GeneratedPost }) {
  return (
    <Link
      href={`/${post.path}`}
      className="group grid overflow-hidden rounded-[8px] border border-[#e1e8f2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(29,102,229,0.12)] md:h-[286px] md:grid-cols-[300px_1fr]"
    >
      <PostImage
        post={post}
        priority
        className="aspect-[1.18] md:aspect-auto md:h-full"
        imageClassName="object-cover"
        sizes="(min-width: 1024px) 300px, 100vw"
      />
      <div className="flex min-h-[270px] flex-col px-6 py-5 md:min-h-0">
        <PostMeta post={post} />
        <h2 className="mt-3 text-[23px] font-extrabold leading-[1.25] text-slate-950 group-hover:text-[#15803d]">
          {decodeText(post.title)}
        </h2>
        <p className="mt-3 line-clamp-3 text-[15px] font-medium leading-6 text-slate-600">
          {decodeText(post.excerpt)}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-[#e8edf4] pt-4">
          <time className="text-[13px] font-semibold text-slate-500">
            {formatPostDate(post)}
          </time>
          <span className="inline-flex h-9 items-center rounded-[7px] bg-[#15803d] px-4 text-[13px] font-extrabold text-white">
            Đọc bài
            <ArrowRight className="ml-1.5" size={15} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CompactFeatureCard({ post }: { post: GeneratedPost }) {
  return (
    <Link
      href={`/${post.path}`}
      className="group grid min-h-[102px] overflow-hidden rounded-[8px] border border-[#e1e8f2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(29,102,229,0.12)] sm:grid-cols-[104px_1fr]"
    >
      <PostImage
        post={post}
        className="aspect-[2.4] sm:aspect-auto sm:h-full"
        imageClassName="object-cover"
        sizes="104px"
      />
      <div className="px-4 py-3">
        <span className="text-[11px] font-extrabold uppercase text-[#15803d]">
          {postCategory(post)}
        </span>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-extrabold leading-5 text-slate-950 group-hover:text-[#15803d]">
          {decodeText(post.title)}
        </h3>
        <p className="mt-1 text-[12px] font-semibold text-slate-500">
          {formatPostDate(post)} • {readingTime(post)} phút đọc
        </p>
      </div>
    </Link>
  );
}

function WidePostCard({ post }: { post: GeneratedPost }) {
  return (
    <Link
      href={`/${post.path}`}
      className="group grid overflow-hidden rounded-[8px] border border-[#e1e8f2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(29,102,229,0.12)] md:grid-cols-[260px_1fr]"
    >
      <PostImage
        post={post}
        className="aspect-[1.35] md:aspect-auto md:min-h-[255px]"
        imageClassName="object-cover"
        sizes="260px"
      />
      <div className="flex flex-col px-6 py-6">
        <PostMeta post={post} />
        <h2 className="mt-3 text-[26px] font-extrabold leading-[1.18] text-slate-950 group-hover:text-[#15803d]">
          {decodeText(post.title)}
        </h2>
        <p className="mt-3 line-clamp-2 text-[15px] font-medium leading-7 text-slate-600">
          {decodeText(post.excerpt)}
        </p>
        <div className="mt-auto pt-4">
          <ReadLink />
        </div>
      </div>
    </Link>
  );
}

function PostGridCard({ post }: { post: GeneratedPost }) {
  return (
    <Link
      href={`/${post.path}`}
      className="group flex min-h-[300px] flex-col overflow-hidden rounded-[8px] border border-[#e1e8f2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(29,102,229,0.12)]"
    >
      <PostImage
        post={post}
        className="aspect-[1.63] bg-[#edf3ff]"
        imageClassName="object-cover"
        sizes="(min-width: 1280px) 270px, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col px-4 py-4">
        <span className="w-fit rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[11px] font-extrabold uppercase text-[#15803d]">
          {postCategory(post)}
        </span>
        <h3 className="mt-3 line-clamp-2 text-[18px] font-extrabold leading-6 text-slate-950 group-hover:text-[#15803d]">
          {decodeText(post.title)}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-[12px] font-semibold text-slate-500">
            {formatPostDate(post)} • {readingTime(post)} phút đọc
          </p>
          <span className="shrink-0 text-[13px] font-extrabold text-[#15803d]">
            Đọc →
          </span>
        </div>
      </div>
    </Link>
  );
}

function PopularPost({ post }: { post: GeneratedPost }) {
  return (
    <Link href={`/${post.path}`} className="group grid grid-cols-[58px_1fr] gap-3">
      <PostImage
        post={post}
        className="aspect-square rounded-[6px] bg-[#edf3ff]"
        imageClassName="object-cover"
        sizes="58px"
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[13px] font-extrabold leading-5 text-slate-950 group-hover:text-[#15803d]">
          {decodeText(post.title)}
        </h3>
        <p className="mt-1 text-[12px] font-semibold text-slate-500">
          {formatPostDate(post)} • {readingTime(post)} phút đọc
        </p>
      </div>
    </Link>
  );
}

function SidebarPanel({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[8px] border border-[#e1e8f2] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] ${className}`}
    >
      <h2 className="border-b border-[#e8edf4] pb-3 text-[18px] font-extrabold text-slate-950">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PostMeta({ post }: { post: GeneratedPost }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[12px] font-extrabold uppercase tracking-normal text-[#15803d]">
      <span>{postCategory(post)}</span>
      <span className="text-slate-300">•</span>
      <span>{readingTime(post)} phút đọc</span>
    </div>
  );
}

function PostImage({
  post,
  className,
  imageClassName,
  sizes,
  priority = false,
}: {
  post: GeneratedPost;
  className: string;
  imageClassName: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {post.featuredImage ? (
        <Image
          src={post.featuredImage}
          alt={decodeText(post.title)}
          fill
          priority={priority}
          sizes={sizes}
          className={`transition duration-300 group-hover:scale-[1.03] ${imageClassName}`}
        />
      ) : (
        <div className="absolute inset-0 bg-[#edf3ff]" />
      )}
    </div>
  );
}

function Pagination() {
  const pages = ["1", "2", "...", "9"];

  return (
    <nav className="mt-8 flex items-center gap-2" aria-label="Phân trang blog">
      {pages.map((page, index) => (
        <Link
          key={`${page}-${index}`}
          href={index === 0 ? "/blog" : `/blog?page=${page}`}
          className={
            index === 0
              ? "grid h-10 min-w-10 place-items-center rounded-[7px] bg-[#15803d] px-3 text-[15px] font-extrabold text-white"
              : "grid h-10 min-w-10 place-items-center rounded-[7px] border border-[#dfe7f2] bg-white px-3 text-[15px] font-extrabold text-slate-700 transition hover:border-[#15803d] hover:text-[#15803d]"
          }
        >
          {page}
        </Link>
      ))}
      <Link
        href="/blog?page=2"
        className="grid h-10 min-w-[70px] place-items-center rounded-[7px] border border-[#dfe7f2] bg-white px-4 text-[15px] font-extrabold text-slate-700 transition hover:border-[#15803d] hover:text-[#15803d]"
      >
        Sau →
      </Link>
    </nav>
  );
}

function ReadLink() {
  return (
    <span className="inline-flex h-9 items-center rounded-[7px] bg-[#15803d] px-4 text-[13px] font-extrabold text-white">
      Đọc bài
      <ArrowRight className="ml-1.5" size={15} aria-hidden="true" />
    </span>
  );
}

function postCategory(post: GeneratedPost) {
  const categoryId = post.categories[0];
  return categoryLabels[categoryId] ?? "BLOG";
}

function readingTime(post: GeneratedPost) {
  if (readingTimeOverrides[post.path]) {
    return readingTimeOverrides[post.path];
  }

  const words = stripHtml(post.contentHtml).split(/\s+/).filter(Boolean).length;
  return Math.max(6, Math.min(12, Math.round(words / 220)));
}

function formatPostDate(post: GeneratedPost) {
  if (publishDateOverrides[post.path]) {
    return publishDateOverrides[post.path];
  }

  const date = new Date(post.modified);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function stripHtml(value: string) {
  return decodeText(value.replace(/<[^>]*>/g, " "));
}

function decodeText(value: string) {
  return replaceBrandText(value)
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8230;/g, "…");
}
