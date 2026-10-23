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
 * The component using this must sit inside a <Suspense> boundary.
 */
export function useRentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const filters = useMemo(() => parseRentFilters(new URLSearchParams(query)), [query]);

  const replace = useCallback(
    (next: RentFilters) => {
      const qs = toSearchParams(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  /** Merges a patch into the current filters. Resets to page 1 unless the patch sets `page`. */
  const setFilters = useCallback(
    (patch: Partial<RentFilters>) => replace({ ...filters, page: 1, ...patch }),
    [filters, replace],
  );

  const clearFilters = useCallback(() => replace({ ...DEFAULT_FILTERS, sort: filters.sort }), [filters.sort, replace]);

  return { filters, setFilters, clearFilters };
}
