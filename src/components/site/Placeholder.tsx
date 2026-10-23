import Link from "next/link";
import styles from "./Placeholder.module.css";

/** Temporary body for routes nobody has claimed yet. Delete it from your page once you start building. */
export function Placeholder({ route, children }: { route: string; children: React.ReactNode }) {
  return (
    <div className={styles.box}>
      <code className={styles.route}>{route}</code>
      <div className={styles.body}>{children}</div>
      <Link href="/" className={styles.home}>
        ← Back to Hellow
      </Link>
    </div>
  );
}
