"use client";

import { useRef } from "react";
import { ListingCard } from "@/components/site/ListingCard";
import type { Listing } from "@/data/listings";
import styles from "./ListingCarousel.module.css";

type Props = {
  title: React.ReactNode;
  subtitle: string;
  listings: Listing[];
  badge?: string;
};

export function ListingCarousel({ title, subtitle, listings, badge }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) =>
    track.current?.scrollBy({ left: direction * track.current.clientWidth, behavior: "smooth" });

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={() => scroll(-1)} aria-label="Previous set of home recommendations">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={styles.arrow} onClick={() => scroll(1)} aria-label="Next set of home recommendations">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.track} ref={track}>
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} badge={badge} />
        ))}
      </div>
    </section>
  );
}
