import Link from "next/link";
import styles from "./aihub-logo.module.css";

type AIHubLogoProps = {
  href?: string;
  size?: "sm" | "md";
  admin?: boolean;
  className?: string;
};

export function AIHubLogo({ href = "/", size = "md", admin = false, className = "" }: AIHubLogoProps) {
  return (
    <Link
      href={href}
      aria-label={admin ? "Trang quản trị AIHUB" : "Trang chủ AIHUB"}
      className={`${styles.logo} ${styles[size]} ${className}`}
    >
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <path className={styles.frame} d="M24 4.8 40.6 14.4v19.2L24 43.2 7.4 33.6V14.4L24 4.8Z" />
          <path className={styles.aShape} d="m14.8 33.1 9.1-20.2 9.3 20.2M18.2 26.2h11.6" />
          <path className={styles.circuit} d="M24 12.9v-4M14.8 33.1l-3.5 2M33.2 33.1l3.5 2" />
          <circle className={styles.node} cx="24" cy="12.9" r="2.1" />
          <circle className={styles.node} cx="14.8" cy="33.1" r="2.1" />
          <circle className={styles.node} cx="33.2" cy="33.1" r="2.1" />
          <circle className={styles.coreGlow} cx="24" cy="26.2" r="4.1" />
          <circle className={styles.core} cx="24" cy="26.2" r="1.8" />
          <path className={styles.spark} d="M36.8 10.2v5.2M34.2 12.8h5.2" />
        </svg>
      </span>
      <span className={styles.wordmark}>
        <span className={styles.name}><span>AI</span><strong>HUB</strong></span>
        {admin && <span className={styles.adminBadge}>ADMIN</span>}
      </span>
    </Link>
  );
}
