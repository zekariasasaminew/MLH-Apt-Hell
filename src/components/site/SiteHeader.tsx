"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import styles from "./SiteHeader.module.css";

let headerHasBurned = false;

const leftLinks = [
  { label: "Buy", href: "/search?type=buy" },
  { label: "Rent", href: "/rent" },
  { label: "Sell", href: "/search?type=sell" },
  { label: "Get a mortgage", href: "/mortgage" },
  { label: "Spin a listing", href: "/spin" },
  { label: "Find an agent", href: "/search?type=agent" },
];

const rightLinks = [
  { label: "My account", href: "/account" },
  { label: "Manage rentals", href: "/account" },
  { label: "Advertise", href: "/signin" },
  { label: "Get help", href: "/signin" },
];

export function SiteHeader() {
  const [isInferno, setIsInferno] = useState(false);

  useEffect(() => {
    const ignite = () => {
      headerHasBurned = true;
      setIsInferno(true);
    };

    if (headerHasBurned) setIsInferno(true);

    window.addEventListener("hellow:awaken", ignite);
    window.addEventListener("pointerdown", ignite, { once: true, capture: true });
    window.addEventListener("keydown", ignite, { once: true, capture: true });
    window.addEventListener("input", ignite, { once: true, capture: true });

    return () => {
      window.removeEventListener("hellow:awaken", ignite);
      window.removeEventListener("pointerdown", ignite, true);
      window.removeEventListener("keydown", ignite, true);
      window.removeEventListener("input", ignite, true);
    };
  }, []);

  return (
    <header className={`${styles.header} ${isInferno ? styles.infernoHeader : ""}`}>
      <div className={styles.inferno} aria-hidden="true">
        <span className={styles.shellTyrant}><i>♛</i>🐢</span>
        <span className={`${styles.fireball} ${styles.fireballOne}`}>☄️</span>
        <span className={`${styles.fireball} ${styles.fireballTwo}`}>🔥</span>
        <span className={`${styles.fireball} ${styles.fireballThree}`}>☄️</span>
        <span className={styles.burnNotice}>🔥 HEADER INTEGRITY: CRISPY 🔥</span>
        <span className={styles.embers}>· ⁕ ･ ✦ · ⁕ ･ ✦ · ⁕ ･ ✦ · ⁕ ･ ✦ · ⁕ ･ ✦</span>
        <div className={styles.flameLine}>
          {Array.from({ length: 18 }, (_, index) => <span key={index}>🔥</span>)}
        </div>
      </div>
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


