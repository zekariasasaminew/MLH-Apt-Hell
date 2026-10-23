"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { cities, listings } from "@/data/listings";
import { applyRentFilters, paginate, PAGE_SIZE, type RentFilters } from "@/filters/rent-filters";
import { useRentFilters } from "@/filters/useRentFilters";
import { EmptyState } from "./_components/EmptyState";
import { FilterBar } from "./_components/FilterBar";
import { Pagination } from "./_components/Pagination";
import { ResultsGrid, type CardItem } from "./_components/ResultsGrid";
import { ResultsHeader } from "./_components/ResultsHeader";
import { RentMapLoader } from "./_components/RentMapLoader";
import { ToastStack, type Toast } from "./_components/ToastStack";
import { FiltersForm } from "./_effects/FiltersForm";
import { GeocitiesBanner } from "./_effects/GeocitiesBanner";
import { SaveSearchModal } from "./_effects/SaveSearchModal";
import { PROMOTED_LINK_TARGET, promotedListings } from "./_lib/promoted";
import { hashString, seededShuffle } from "./_lib/seeded-random";
import { useReducedMotion } from "./_lib/useReducedMotion";
import styles from "./rent.module.css";
import geo from "./geocities.module.css";

const QUAD_CITIES: [number, number] = [41.515, -90.52];
const SELF_SORT_MS = 8000;
const AMNESIA_COOLDOWN_MS = 15000;

const AMNESIA_TARGETS: [keyof RentFilters, string][] = [
  ["maxRent", "Price"],
  ["minRent", "Price"],
  ["beds", "Beds"],
  ["baths", "Baths"],
  ["homeTypes", "Property type"],
  ["pets", "Pets"],
  ["laundry", "In-unit laundry"],
  ["parking", "Parking"],
  ["availableBy", "Available by"],
  ["city", "Location"],
  ["q", "Location"],
];

export function RentPage() {
  const { filters, setFilters, clearFilters } = useRentFilters();
  const reducedMotion = useReducedMotion();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [shuffleTick, setShuffleTick] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const toastTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const lastAmnesiaAt = useRef(0);
  const amnesiaCount = useRef(0);
  const listPane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const toast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current.slice(-2), { id, message }]);
    const timer = setTimeout(() => {
      toastTimers.current.delete(timer);
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4000);
    toastTimers.current.add(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (!reducedMotion) setShuffleTick((tick) => tick + 1);
      toast("Prices updated");
    }, SELF_SORT_MS);
    return () => clearInterval(timer);
  }, [reducedMotion, toast]);

  const sort = filters.sort === "recommended" ? "price-desc" : filters.sort;
  const matching = useMemo(() => applyRentFilters(listings, { ...filters, sort }), [filters, sort]);
  const paged = paginate(matching, filters.page);

  const cardItems = useMemo<CardItem[]>(() => {
    let visible = paged.items;
    if (paged.page === 2) visible = seededShuffle(paginate(matching, 1).items, hashString(`page2:${matching.length}`));
    if (shuffleTick > 0) visible = seededShuffle(visible, hashString(`tick:${shuffleTick}`));

    const items: CardItem[] = visible.map((listing) => ({ listing, href: `/listing/${listings[0].id}` }));
    let inserted = 0;
    for (let position = 3; position <= items.length && inserted < promotedListings.length; position += 4) {
      items.splice(position, 0, { listing: promotedListings[inserted], href: `/listing/${PROMOTED_LINK_TARGET}` });
      inserted++;
    }
    return items;
  }, [paged.items, paged.page, matching, shuffleTick]);

  const mapCenter = useMemo<[number, number]>(
    () => cities.find((city) => city.slug === filters.city)?.center ?? QUAD_CITIES,
    [filters.city],
  );
  const mapZoom = filters.city ? 13 : 11;

  const selectPin = useCallback(
    (id: string) => {
      setSelectedId(id);
      setMobileView("list");
      const index = matching.findIndex((listing) => listing.id === id);
      if (index >= 0) {
        const targetPage = Math.floor(index / PAGE_SIZE) + 1;
        if (targetPage !== paged.page) setFilters({ page: targetPage });
      }
    },
    [matching, paged.page, setFilters],
  );

  useEffect(() => {
    if (!selectedId) return;
    const card = listPane.current?.querySelector(`[data-listing-id="${selectedId}"]`);
    card?.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
  }, [selectedId, cardItems, reducedMotion]);

  const handleUserDrag = useCallback(() => {
    const now = Date.now();
    if (now - lastAmnesiaAt.current < AMNESIA_COOLDOWN_MS) return;
    const active = AMNESIA_TARGETS.filter(([key]) => filters[key] !== undefined);
    if (active.length === 0) return;
    lastAmnesiaAt.current = now;
    const [key, label] = active[amnesiaCount.current++ % active.length];
    setFilters({ [key]: undefined });
    toast(`We cleared ${label} to show you more homes`);
  }, [filters, setFilters, toast]);

  return (
    <div className={`${styles.root} ${geo.geo}`} data-rent="root">
      <GeocitiesBanner />
      <FilterBar filters={filters} setFilters={setFilters} onSaveSearch={() => setSaveOpen(true)} />
      <div className={styles.split}>
        <div className={`${styles.mapPane} ${mobileView === "map" ? styles.paneShown : ""}`}>
          <RentMapLoader
            items={matching}
            hoveredId={hoveredId}
            selectedId={selectedId}
            onHover={setHoveredId}
            onSelect={selectPin}
            center={mapCenter}
            zoom={mapZoom}
            onUserDrag={handleUserDrag}
          />
        </div>
        <div ref={listPane} className={`${styles.listPane} ${mobileView === "list" ? styles.paneShown : ""}`} data-rent="listpane">
          <ResultsHeader filters={filters} count={matching.length} onSort={(next) => setFilters({ sort: next })} />
          <FiltersForm filters={filters} setFilters={setFilters} />
          {matching.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <ResultsGrid items={cardItems} highlightedId={hoveredId ?? selectedId} onHover={setHoveredId} />
          )}
          <Pagination page={paged.page} pageCount={paged.pageCount} onPage={(next) => setFilters({ page: next })} />
          <SiteFooter />
        </div>
      </div>
      <button type="button" className={styles.viewToggle} onClick={() => setMobileView((view) => (view === "list" ? "map" : "list"))}>
        {mobileView === "list" ? "Map" : "List"}
      </button>
      <ToastStack toasts={toasts} />
      {saveOpen && <SaveSearchModal onClose={() => setSaveOpen(false)} />}
    </div>
  );
}
