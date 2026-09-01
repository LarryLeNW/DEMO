import Link from "next/link";
import styles from "./aihub-logo.module.css";

type AIHubLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  admin?: boolean;
  /** Wordmark colors: "light" for white backgrounds, "dark" for dark ones. Defaults to dark when `admin`. */
  tone?: "light" | "dark";
  /** Store name from settings; falls back to the AIHUB brand. */
  name?: string;
  tagline?: string;
  className?: string;
};

/**
 * Brand mark — keep in sync with `src/app/icon.svg` (favicon).
 * The green gradient lives in CSS on `.mark` (no SVG defs): `url(#id)` references break when
 * the id is duplicated across instances or defined inside a hidden subtree.
 */
export function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M15.6 33 24 15l8.4 18" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 27.2h9" stroke="white" strokeWidth="3.4" strokeLinecap="round" />
      <path d="m36.4 8.2 1.05 2.35 2.35 1.05-2.35 1.05-1.05 2.35-1.05-2.35-2.35-1.05 2.35-1.05Z" fill="#d9fbe5" />
    </svg>
  );
}

export function AIHubLogo({
  href = "/",
  size = "md",
  admin = false,
  tone = admin ? "dark" : "light",
  name = "AIHUB",
  tagline,
  className = "",
}: AIHubLogoProps) {
  const upper = name.toUpperCase();
  const [head, tail] = upper.startsWith("AI") && upper.length > 2 ? [upper.slice(0, 2), upper.slice(2)] : [upper, ""];
  return (
    <Link
      href={href}
      aria-label={admin ? `Trang quản trị ${upper}` : `Trang chủ ${upper}`}
      className={`${styles.logo} ${styles[size]} ${styles[tone]} ${className}`}
    >
      <span className={styles.mark} aria-hidden="true">
        <LogoMark />
      </span>
      <span className={styles.wordmark}>
        <span className={styles.name}>
          <span>{head}</span>
          {tail && <strong>{tail}</strong>}
          {admin && <span className={styles.adminBadge}>ADMIN</span>}
        </span>
        {tagline && <span className={styles.tagline}>{tagline}</span>}
      </span>
    </Link>
  );
}
