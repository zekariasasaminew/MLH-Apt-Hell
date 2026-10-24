import type { Listing } from "@/data/listings";

/** Fictional purchase scenarios derived from the demo rentals, never real valuations. */
export const salePrice = (listing: Listing) => listing.rent * 180;
export const money = (amount: number) => `$${amount.toLocaleString("en-US")}`;
