import styles from "./Logo.module.css";

export const BRAND_NAME = "Hellow";

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <span className={styles.logo} style={{ fontSize: size }}>
      <svg className={styles.mark} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11 12 3l9 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 10v11M17.5 10v11M6.5 15.5h11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {BRAND_NAME}
    </span>
  );
}
