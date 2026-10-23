import Image from "next/image";
import Link from "next/link";
import { formatRent, type Listing } from "@/data/listings";
import styles from "./ListingCard.module.css";

export function ListingCard({ listing, badge }: { listing: Listing; badge?: string }) {
  const label = badge ?? listing.badge;

  return (
    <article className={styles.card}>
      <Link href={`/listing/${listing.id}`} className={styles.link}>
        <div className={styles.photo}>
          <Image src={listing.photo} alt={listing.street} fill sizes="345px" />
          {label && <span className={styles.badge}>{label}</span>}
        </div>
        <div className={styles.body}>
          <span className={styles.price}>{formatRent(listing.rent)}</span>
          <div className={styles.details}>
            <span>
              <b>{listing.beds}</b> bds
            </span>
            <span>
              <b>{listing.baths}</b> ba
            </span>
            <span>
              <b>{listing.sqft.toLocaleString("en-US")}</b> sqft
            </span>
            <span>{listing.status}</span>
          </div>
          <address className={styles.address}>
            {listing.street}, {listing.city}, {listing.state}, {listing.zip}
          </address>
          <p className={styles.finePrint}>{listing.finePrint}</p>
        </div>
      </Link>
      <button className={styles.save} aria-label={`Save ${listing.street}`}>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            d="M12 20.5 4.2 12.9a4.9 4.9 0 0 1 7-6.9l.8.8.8-.8a4.9 4.9 0 0 1 7 6.9L12 20.5Z"
            fill="rgba(0,0,0,0.35)"
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>
      </button>
    </article>
  );
}
