import { listings, type Listing } from "@/data/listings";

const base = listings[0];

const promoted = (
  id: string,
  rent: number,
  street: string,
  sqft: number,
  photoIndex: number,
  finePrint: string,
  place: Pick<Listing, "city" | "citySlug" | "zip"> = { city: base.city, citySlug: base.citySlug, zip: base.zip },
): Listing => ({
  ...base,
  ...place,
  id,
  rent,
  beds: 0,
  baths: 0,
  sqft,
  street,
  status: "For rent",
  badge: "Promoted",
  photo: listings[photoIndex].photo,
  photos: [listings[photoIndex].photo],
  finePrint,
  homeType: "Apartment",
  applyInstantly: true,
  listedDaysAgo: 0,
});

/** Fake sponsored cards that ignore every filter. Each links to a real listing page. */
export const promotedListings: Listing[] = [
  promoted("promoted-parking", 150, "Lot C, Space 14", 160, 6, "Sponsored. Covered-ish parking space, tenant supplies car."),
  promoted("promoted-closet", 640, "Closet, 2nd Floor, 1520 3rd Ave", 24, 7, "Sponsored. Cozy. Hangers included, vertical living encouraged."),
  promoted("promoted-shed", 480, "Shed behind 2210 9th St", 80, 16, "Sponsored. Has Wi-Fi if you stand near the fence."),
  promoted("promoted-storage", 365, "Storage Unit 117", 50, 2, "Sponsored. Great views of other storage units.", {
    city: "Moline",
    citySlug: "moline-il",
    zip: "61265",
  }),
];

export const PROMOTED_LINK_TARGET = listings[0].id;
