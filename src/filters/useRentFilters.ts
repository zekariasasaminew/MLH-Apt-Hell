"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DEFAULT_FILTERS, parseRentFilters, toSearchParams, type RentFilters } from "./rent-filters";

/** Props every swappable filter control on /rent receives. */
export type FilterControlProps = {
  filters: RentFilters;
  setFilters: (patch: Partial<RentFilters>) => void;
};

/**
 * Rent filters, kept in the URL so back, forward, refresh and shared links all work.
 * Each change pushes a history entry, so Back steps through earlier filters.
 * The component using this must sit inside a <Suspense> boundary.
 */
export function useRentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const filters = useMemo(() => parseRentFilters(new URLSearchParams(query)), [query]);

  const navigate = useCallback(
    (next: RentFilters) => {
      const params = toSearchParams(next);
      if (pathname === "/search") params.set("type", "buy");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  /** Merges a patch into the current filters. Resets to page 1 unless the patch sets `page`. */
  const setFilters = useCallback(
    (patch: Partial<RentFilters>) => navigate({ ...filters, page: 1, ...patch }),
    [filters, navigate],
  );

  const clearFilters = useCallback(() => navigate({ ...DEFAULT_FILTERS, sort: filters.sort }), [filters.sort, navigate]);

  return { filters, setFilters, clearFilters };
}
