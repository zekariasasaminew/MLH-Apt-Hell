import styles from "./GeocitiesBanner.module.css";

/** Unhinged tier: the page turns into a 1999 fan site. Pairs with the .geo rules in unhinged.module.css. */
export function GeocitiesBanner() {
  return (
    <div className={styles.banner} data-rent="geo-banner">
      <div className={styles.marquee}>
        <span>*** WELCOME 2 HELLOW RENTALZ *** BEST APARTMENTZ ON THE WEB *** SIGN MY GUESTBOOK ***</span>
      </div>
      <div className={styles.row}>
        <span className={styles.construction}>UNDER CONSTRUCTION</span>
        <span className={styles.counter}>You are visitor #004812</span>
        <span className={styles.construction}>UNDER CONSTRUCTION</span>
      </div>
    </div>
  );
}
