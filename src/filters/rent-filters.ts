import type { HomeType, Listing } from "@/data/listings";

export const PAGE_SIZE = 20;

export const SORT_KEYS = ["recommended", "price-asc", "price-desc", "newest", "beds", "sqft"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const HOME_TYPES: HomeType[] = ["Apartment", "House", "Townhome", "Condo"];

export type RentFilters = {
  /** City slug, e.g. "rock-island-il". */
  city?: string;
  /** Free-text location: street, city, state or ZIP. */
  q?: string;
  minRent?: number;
  maxRent?: number;
  /** Minimum bedrooms. 0 means studio or larger, which is the same as unset. */
  beds?: number;
  /** Minimum bathrooms. */
  baths?: number;
  homeTypes?: HomeType[];
  pets?: "cats" | "dogs";
  /** In-unit laundry only. */
  laundry?: boolean;
  parking?: boolean;
  /** ISO date: only listings available on or before it. */
  availableBy?: string;
  sort: SortKey;
  /** 1-based. */
  page: number;
};

export const DEFAULT_FILTERS: RentFilters = { sort: "recommended", page: 1 };

type ParamReader = { get(name: string): string | null };

const toNumber = (raw: string | null): number | undefined => {
  if (raw === null || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

export function parseRentFilters(params: ParamReader): RentFilters {
  const sort = params.get("sort");
  const types = params.get("types")?.split(",").filter((type): type is HomeType => HOME_TYPES.includes(type as HomeType));
  const pets = params.get("pets");
  const page = toNumber(params.get("page"));

  return {
    city: params.get("city") || undefined,
    q: params.get("q")?.trim() || undefined,
    minRent: toNumber(params.get("min")),
    maxRent: toNumber(params.get("max")),
    beds: toNumber(params.get("beds")),
    baths: toNumber(params.get("baths")),
    homeTypes: types && types.length > 0 ? types : undefined,
    pets: pets === "cats" || pets === "dogs" ? pets : undefined,
    laundry: params.get("laundry") === "1" ? true : undefined,
    parking: params.get("parking") === "1" ? true : undefined,
    availableBy: params.get("by") || undefined,
    sort: SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : DEFAULT_FILTERS.sort,
    page: page && page >= 1 ? Math.floor(page) : DEFAULT_FILTERS.page,
  };
}

/** Serializes filters to a query string, leaving out anything that is unset or default. */
export function toSearchParams(filters: RentFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.q) params.set("q", filters.q);
  if (filters.minRent !== undefined) params.set("min", String(filters.minRent));
  if (filters.maxRent !== undefined) params.set("max", String(filters.maxRent));
  if (filters.beds) params.set("beds", String(filters.beds));
  if (filters.baths) params.set("baths", String(filters.baths));
  if (filters.homeTypes?.length) params.set("types", filters.homeTypes.join(","));
  if (filters.pets) params.set("pets", filters.pets);
  if (filters.laundry) params.set("laundry", "1");
  if (filters.parking) params.set("parking", "1");
  if (filters.availableBy) params.set("by", filters.availableBy);
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}

function matches(listing: Listing, filters: RentFilters): boolean {
  if (filters.city && listing.citySlug !== filters.city) return false;
  if (filters.q) {
    const haystack = `${listing.street} ${listing.city} ${listing.state} ${listing.zip}`.toLowerCase();
    if (!haystack.includes(filters.q.toLowerCase())) return false;
  }
  if (filters.minRent !== undefined && listing.rent < filters.minRent) return false;
  if (filters.maxRent !== undefined && listing.rent > filters.maxRent) return false;
  if (filters.beds && listing.beds < filters.beds) return false;
  if (filters.baths && listing.baths < filters.baths) return false;
  if (filters.homeTypes && !filters.homeTypes.includes(listing.homeType)) return false;
  if (filters.pets && listing.pets !== filters.pets && listing.pets !== "both") return false;
  if (filters.laundry && listing.laundry !== "in-unit") return false;
  if (filters.parking && !listing.parking) return false;
  if (filters.availableBy && listing.availableFrom > filters.availableBy) return false;
  return true;
}

const comparators: Record<SortKey, (a: Listing, b: Listing) => number> = {
  recommended: (a, b) => a.listedDaysAgo - b.listedDaysAgo,
  "price-asc": (a, b) => a.rent - b.rent,
  "price-desc": (a, b) => b.rent - a.rent,
  newest: (a, b) => a.listedDaysAgo - b.listedDaysAgo,
  beds: (a, b) => b.beds - a.beds,
  sqft: (a, b) => b.sqft - a.sqft,
};

/** Filters and sorts. Ties break on id so the order is stable between renders. */
export function applyRentFilters(listings: Listing[], filters: RentFilters): Listing[] {
  const compare = comparators[filters.sort];
  return listings.filter((listing) => matches(listing, filters)).sort((a, b) => compare(a, b) || a.id.localeCompare(b.id));
}

export function paginate<T>(items: T[], page: number): { items: T[]; pageCount: number; page: number } {
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  return { items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), pageCount, page: current };
}
