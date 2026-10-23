"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Listing } from "@/data/listings";
import styles from "./RentCard.module.css";

export type RentCardProps = {
  listing: Listing;
  href: string;
  /** Rent to display, which creeps away from the listing's own rent. */
  rent: number;
  highlighted: boolean;
  /** Replaces "Fees may apply" while the card is hovered. */
  feeLabel?: string;
  extraBadges?: React.ReactNode;
  extraBody?: React.ReactNode;
  overlay?: React.ReactNode;
  onHover: (id: string | null) => void;
  onNavigate: (event: React.MouseEvent) => void;
  cardRef?: (element: HTMLElement | null) => void;
};

export function RentCard({
  listing,
  href,
  rent,
  highlighted,
  feeLabel,
  extraBadges,
  extraBody,
  overlay,
  onHover,
  onNavigate,
  cardRef,
}: RentCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const photos = listing.photos.slice(0, 5);
  const promoted = listing.badge === "Promoted";

  const step = (direction: 1 | -1) => setPhotoIndex((index) => (index + direction + photos.length) % photos.length);

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${highlighted ? styles.highlighted : ""}`}
      data-rent="card"
      data-listing-id={listing.id}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={styles.photo}>
        <Image src={photos[photoIndex]} alt={listing.street} fill sizes="344px" />
        <div className={styles.badges}>
          {listing.badge && <span className={`${styles.badge} ${promoted ? styles.promoted : styles.orange}`}>{listing.badge}</span>}
          {listing.listedDaysAgo >= 1 && listing.listedDaysAgo <= 14 && (
            <span className={`${styles.badge} ${styles.white}`}>
              {listing.listedDaysAgo} day{listing.listedDaysAgo === 1 ? "" : "s"} ago
            </span>
          )}
          {listing.applyInstantly && !promoted && <span className={`${styles.badge} ${styles.blue}`}>Apply instantly</span>}
          {extraBadges}
        </div>
        <button type="button" className={styles.heart} aria-label={`${saved ? "Unsave" : "Save"} ${listing.street}`} aria-pressed={saved} onClick={() => setSaved((value) => !value)}>
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
            <path
              d="M12 20.5 4.2 12.9a4.9 4.9 0 0 1 7-6.9l.8.8.8-.8a4.9 4.9 0 0 1 7 6.9L12 20.5Z"
              fill={saved ? "#e5242b" : "rgba(0,0,0,0.35)"}
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        </button>
        {photos.length > 1 && (
          <>
            <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label="Previous photo" onClick={() => step(-1)}>
              ‹
            </button>
            <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next photo" onClick={() => step(1)}>
              ›
            </button>
            <ul className={styles.dots} aria-hidden="true">
              {photos.map((photo, index) => (
                <li key={photo} className={index === photoIndex ? styles.dotOn : styles.dot} />
              ))}
            </ul>
          </>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.priceRow}>
          <span className={styles.price}>${rent.toLocaleString("en-US")}/mo</span>
          <span className={styles.fees} data-swap={feeLabel ? "" : undefined}>
            <span className={styles.feesDefault}>Fees may apply</span>
            {feeLabel && <span className={styles.feesHover}>{feeLabel}</span>}
          </span>
          <div className={styles.menuWrap}>
            <button
              type="button"
              className={styles.more}
              aria-label="More options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              •••
            </button>
            {menuOpen && (
              <ul className={styles.menu} onMouseLeave={() => setMenuOpen(false)}>
                <li>
                  <button type="button" onClick={() => setMenuOpen(false)}>
                    Hide this listing
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setMenuOpen(false)}>
                    Report listing
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className={styles.details}>
          <span>
            <b>{listing.beds === 0 ? "Studio" : listing.beds}</b>
            {listing.beds === 0 ? "" : listing.beds === 1 ? " bd" : " bds"}
          </span>
          <span>
            <b>{listing.baths}</b> ba
          </span>
          <span>
            <b>{listing.sqft.toLocaleString("en-US")}</b> sqft
          </span>
          <span>{listing.homeType === "Apartment" ? "Apartment for rent" : `${listing.homeType} for rent`}</span>
        </div>
        <Link href={href} className={styles.link} onClick={onNavigate}>
          <address className={styles.address}>
            {listing.street}, {listing.city}, {listing.state} {listing.zip}
          </address>
        </Link>
        {extraBody}
      </div>
      {overlay}
    </article>
  );
}
