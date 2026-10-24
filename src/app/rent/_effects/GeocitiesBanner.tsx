import type { MarketMode } from "@/data/property-market";
import styles from "./GeocitiesBanner.module.css";

/** The page is a 1999 fan site. Pairs with the .geo rules in geocities.module.css. */
export function GeocitiesBanner({ mode = "rent" }: { mode?: MarketMode }) {
  return (
    <div className={styles.banner} data-rent="geo-banner">
      <div className={styles.marquee}>
        <span>*** WELCOME 2 HELLOW {mode === "buy" ? "HOMEZ FOR SALE" : "RENTALZ"} *** BEST {mode === "buy" ? "HOMEZ" : "APARTMENTZ"} ON THE WEB *** SIGN MY GUESTBOOK ***</span>
      </div>
      <div className={styles.row}>
        <span className={styles.construction}>UNDER CONSTRUCTION</span>
        <span className={styles.counter}>You are visitor #004812</span>
        <span className={styles.construction}>UNDER CONSTRUCTION</span>
      </div>
    </div>
  );
}
