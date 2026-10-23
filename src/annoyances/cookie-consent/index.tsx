"use client";

import { TIERS } from "@/pain/pain-cookie";
import type { Annoyance, AnnoyanceProps } from "../types";
import styles from "./styles.module.css";

function CookieConsent({ bump, dismiss }: AnnoyanceProps) {
  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <p className={styles.text}>
        Hellow uses cookies to remember your preferences and how annoyed you are. By continuing, you agree to our
        use of cookies.
      </p>
      <div className={styles.actions}>
        <button className={styles.secondary} onClick={() => bump(5)}>
          Manage preferences
        </button>
        <button className={styles.primary} onClick={dismiss}>
          Accept all
        </button>
      </div>
    </div>
  );
}

const cookieConsent: Annoyance = {
  id: "cookie-consent",
  owner: "zekariasasaminew",
  minPain: TIERS.calm,
  maxPain: TIERS.annoying,
  Component: CookieConsent,
};

export default cookieConsent;
