# The Rent page (`/rent`), as built

Owner: zekariasasaminew. Zillow's rental search results page, recreated for Hellow, with every annoyance always on.
There are no levels or settings (see `AGENTS.md`, "Annoyance model").

## Layout

```
SiteHeader (shared, 80px)
GeocitiesBanner (marquee, visitor counter, under construction stripes)
FilterBar (56px): location search, For rent menu, Price popover, Save search
├── Map (left, 45%): Leaflet + OpenStreetMap tiles, one price pin per listing
└── Results (right, scrolls)
    ├── title + inflated count + Sort menu
    ├── FiltersForm (31 checkboxes, a few of which really filter)
    ├── 2-column RentCard grid
    ├── Pagination ("1 2 3 ... 412")
    └── SiteFooter
```

On phones the map and list share the screen through a floating Map / List button.

## State

All filters, the sort and the page live in the URL (`src/filters/`, see the filter contract in `AGENTS.md`), so Back,
refresh and shared links work. Price and location are separate files (`PriceFilter.tsx`, `LocationFilter.tsx`) so the
slot machine (#9) and globe (#5) can replace them.

## Effects (all always on)

| Effect | Where |
|---|---|
| "Recommended" sorts most expensive first | `RentPage.tsx` |
| Count reads "4,872 rentals available (showing 60)" | `ResultsHeader.tsx` |
| Fees appear on card hover and keep growing | `ResultsGrid.tsx` |
| Ticking "N people applied today" badges | `_effects/UrgencyBadge.tsx` |
| Save search opens a sign-in wall | `_effects/SaveSearchModal.tsx` |
| Fake promoted listings every 4th card | `RentPage.tsx`, `_lib/promoted.ts` |
| Dragging the map clears one of your filters | `RentPage.tsx` |
| Pagination ends in "... 412"; page 2 repeats page 1 | `Pagination.tsx`, `RentPage.tsx` |
| Rent creeps up $5 each time a card scrolls back into view | `ResultsGrid.tsx` |
| Map pins slide away from the cursor | `RentMap.tsx` |
| List re-sorts every 8 seconds with a "Prices updated" toast | `RentPage.tsx` |
| One in three clicks says "no longer available", then the listing returns $75 pricier | `ResultsGrid.tsx` |
| Income must be 40x rent; the calculator is always $3 short | `_effects/IncomeCalculatorModal.tsx` |
| Filter pills collapse into a 31-checkbox form | `_effects/FiltersForm.tsx` |
| Grayscale map with swapped zoom buttons | `RentMap.tsx` |
| Geocities restyle: Comic Sans, checkerboard, marquee | `geocities.module.css`, `_effects/GeocitiesBanner.tsx` |
| Cards sag and tilt | `ResultsGrid.module.css` |
| Every card links to the same listing | `RentPage.tsx` |
| Absurd tags ("Haunted (friendly)") | `_effects/absurd-tags.ts` |

## Guardrails

- A real listing page is always reachable.
- Escape closes every modal, and nothing touches the history stack or `beforeunload`.
- Timers and observers are cleaned up on unmount; tickers pause while the tab is hidden.
- Moving effects respect `prefers-reduced-motion`.
- Randomness is seeded (`_lib/seeded-random.ts`) so a demo repeats.

## Notes

- Map tiles are OpenStreetMap's standard tiles. CARTO's free tiles stamp "API KEY REQUIRED" on the map.
- The map is loaded client-only (`RentMapLoader.tsx`) because Leaflet needs `window`.
- Verify a change with `npm run build`, then run the production build and check `/rent` at 1440px and 390px.
