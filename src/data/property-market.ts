import { listings, type Listing } from "./listings";

export type MarketMode = "rent" | "buy";
/** Fictional sale scenarios; the shared filter contract calls its monetary field `rent`. */
export const salePrice = (listing: Listing) => listing.rent * 180;
export const money = (amount: number) => `$${amount.toLocaleString("en-US")}`;
export const asPurchaseListing = (listing: Listing): Listing => ({ ...listing, rent: salePrice(listing) });
export const purchaseListings = listings.map(asPurchaseListing);
