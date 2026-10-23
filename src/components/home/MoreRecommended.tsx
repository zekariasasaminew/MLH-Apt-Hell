import Link from "next/link";
import styles from "./MoreRecommended.module.css";

export function MoreRecommended() {
  return (
    <div className={styles.wrap}>
      <Link href="/search" className={styles.link}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        More recommended homes
      </Link>
    </div>
  );
}
