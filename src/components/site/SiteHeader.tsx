import Link from "next/link";
import { Logo } from "./Logo";
import styles from "./SiteHeader.module.css";

const leftLinks = [
  { label: "Buy", href: "/search?type=buy" },
  { label: "Rent", href: "/search?type=rent" },
  { label: "Sell", href: "/search?type=sell" },
  { label: "Get a mortgage", href: "/apply" },
  { label: "Find an agent", href: "/search?type=agent" },
];

const rightLinks = [
  { label: "My account", href: "/account" },
  { label: "Manage rentals", href: "/account" },
  { label: "Advertise", href: "/signin" },
  { label: "Get help", href: "/signin" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.side} aria-label="Main">
        {leftLinks.map((link) => (
          <Link key={link.label} href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Link href="/" className={styles.logo} aria-label="Hellow home">
        <Logo />
      </Link>
      <nav className={`${styles.side} ${styles.right}`} aria-label="Account">
        {rightLinks.map((link) => (
          <Link key={link.label} href={link.href} className={`${styles.link} ${styles.collapsible}`}>
            {link.label}
          </Link>
        ))}
        <Link href="/signin" className={styles.link}>
          Sign in
        </Link>
      </nav>
    </header>
  );
}


