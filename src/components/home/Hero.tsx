import Image from "next/image";
import { heroPhoto } from "@/data/listings";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Image src={heroPhoto} alt="" fill priority sizes="100vw" className={styles.photo} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          Rentals. Homes.
          <br />
          Agents. Loans.
        </h1>
        <form action="/search" className={styles.search} role="search">
          <input
            name="q"
            type="text"
            className={styles.input}
            placeholder="Enter an address, neighborhood, city, or ZIP code"
            aria-label="Search for homes by city, neighborhood, address, or ZIP code"
            autoComplete="off"
          />
          <button type="submit" className={styles.submit} aria-label="Submit Search">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.25" />
              <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
