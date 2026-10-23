# Plan: the Rent page (`/rent`)

Owner: zekariasasaminew. Status: **built** (PR A merged, phases B to D shipped together in one PR). All five
decisions in section 2 went with the recommendation, so the **[DECIDE]** items below are settled.

Deviations from the plan as built:
- Map tiles are OpenStreetMap's standard tiles. CARTO Voyager now stamps "API KEY REQUIRED" on its tiles.
- On phones the filter pills scroll horizontally (like Zillow's own mobile bar) instead of collapsing into a sheet;
  popovers open full width under the bar, and a floating Map / List button switches panes.
- The hostile "filters become a form" keeps the location and price controls visible so the teammates' globe and
  slot machine stay reachable; the other pills become one 31-checkbox form.
- Every pain effect lives in `rent-pain.ts` (thresholds) plus one file per effect in `_effects/`, or in
  `ResultsGrid.tsx` for per-card ones.

Builder: read `AGENTS.md` first, then this whole file. Work through the phases in order, one PR per phase.

---

## 1. Goal

Zillow's rental search results page (`zillow.com/rock-island-il/rentals/`), recreated for Hellow. At calm pain
it is a believable clone: filter bar, map on the left, two-column grid of rental cards on the right, sort, pages.
As pain rises, the page turns against the user (prices creep, results lie, filters sabotage, the layout falls
apart), until at unhinged it looks like a different, much worse website.

Non-goals for this plan (other people own them, or they are separate issues):

| Thing | Owner / issue | How Rent connects |
|---|---|---|
| Slot-machine max-price filter | fiatbruno, #9 | Replaces `PriceFilter` through the filter contract (section 5) |
| Spinning-globe location search | fiatbruno, #5 | Replaces `LocationFilter` through the filter contract |
| Listing details, scratch-off photos, clock tour, rotary phone | #4, #7, #3 (`/listing/[id]`) | Rent cards link to `/listing/[id]`; nothing else |
| Global ad popups | fiatbruno, #2 | Global, independent of Rent |
| Sell flow, account, sign-up | njoseph2 / fiatbruno | None |
| Rental application (`/apply`) | unclaimed | "Apply instantly" badge links there; building it is a separate issue |

## 2. Decisions to make in review

1. **[DECIDE] Route.** Recommended: a new route **`/rent`** (Zillow uses `/<city>/rentals/`; ours is
   `/rent?city=rock-island-il`). The header "Rent" link and the homepage "Find rentals" button move to `/rent`.
   `/search` stays unclaimed for Buy. Alternative: take over `/search?type=rent` (blurs ownership with whoever
   builds Buy).
2. **[DECIDE] Hero search box.** Hellow is apartment hell, so the homepage search should land on `/rent`.
   Recommended: point the hero form at `/rent` (one-line edit to a shared file, called out in the PR). Alternative:
   leave it on `/search`.
3. **[DECIDE] Map.** Recommended: **Leaflet + react-leaflet** (leaflet 1.9.4, react-leaflet 5.0.0 supports React
   19) with free CARTO "Voyager" raster tiles. No API key, and it looks close to Zillow's Google map. Costs two new
   dependencies (announce in the PR) and needs client-only loading. Alternative: a hand-drawn SVG map of the Quad
   Cities with positioned pins. No dependencies and easy to vandalize at high pain, but it reads as fake at calm,
   which breaks the "starts believable" rule.
4. **[DECIDE] More listings.** 22 listings is too few for a results page with paging, sort and filters. Recommended:
   grow the shared `src/data/listings.ts` to about 60 rentals and add the fields in section 4, in the first PR so
   teammates rebase onto it early. All changes are additive; existing ids and fields stay.
5. **[DECIDE] Paging.** Recommended: numbered pages, 20 per page, like Zillow. That gives the "page 2 is page 1
   again" annoyance something to break.

## 3. Calm-tier spec (the Zillow-faithful version)

Measured from zillow.com on 2026-10-23 at 1440px wide. Use the tokens in `globals.css`; new values below.

**Page structure**

```
SiteHeader (shared, 80px)
FilterBar (56px: 8px vertical padding, 40px controls, bottom border #e8e8ec)
├── Map (left, 45% width, sticky, fills viewport height under the header + filter bar)
└── Results (right, scrolls)
    ├── h1 "Rock Island IL Rental Listings"   display font, 20px/24px, 800
    ├── "47 rentals available"                 display font, 14px, 700
    ├── "Sort: Recommended ▾" (right aligned)  14px, blue, opens a menu
    ├── card grid: 2 columns, 8px gap, 20px side padding
    ├── pagination (‹ 1 2 3 ›)
    └── SiteFooter (shared)
```

**FilterBar** (left to right, 8px gaps):
- Location input: 357x42, 1px border `#7e7f8e`, radius 12px, clear "×" button + search icon. Placeholder
  "Address, neighborhood, city, ZIP". This is `LocationFilter`.
- "For rent ▾": active pill, background `#e2f0ff`, inset 2px `#0041d9` ring, radius 12px, 40px tall, padding 8px 10px.
  Opens a menu (For rent / For sale / Sold). Picking anything else goes to `/search`.
- "Price ▾", "Beds & baths ▾", "Property type ▾", "Filters ▾": white, inset 1px `#7e7f8e` ring, radius 12px,
  40px tall, padding 8px 10px, 16px text. Each opens a popover (white, radius 12px, card shadow, 16px padding)
  with an "Apply" button.
  - Price → `PriceFilter`: min / max rent selects ($0 to $5,000 in $100 steps).
  - Beds & baths: segmented buttons Any / 1+ / 2+ / 3+ / 4+ for each.
  - Property type: checkboxes Apartment / House / Townhome / Condo.
  - Filters: pets (cats / dogs), in-unit laundry, parking, "Available by" date.
- "Save search": blue `#0041d9` button, white bold text, radius 12px, padding 8px 16px. At calm it opens a
  "Sign in to save" toast linking to `/signin`.
- Mobile (under 900px): the location input stays, the four popover buttons collapse into one "Filters" button
  that opens a full-screen sheet, and a floating "Map / List" toggle replaces the split view.

**Map**: Quad Cities, centered near 41.50, -90.55, zoom 12. One pill marker per listing showing short rent
("$1.4K"), white with dark text, which turns blue when you hover the matching card (and the other way around).
Zoom +/- controls bottom right, like Zillow. Clicking a marker scrolls to and highlights its card.

**RentCard** (rent-specific; do not change the shared homepage `ListingCard`):
- 343x289 card, radius 12px, listing shadow, white.
- Photo 186px tall, object-fit cover, with dot indicators (up to 5) and left/right arrows on hover to cycle the
  listing's `photos`.
- Badges top-left (12px/16px, 700, radius 999px, padding 2px 8px): white with dark text for "N days ago", blue
  `#0041d9` for "Apply instantly", orange `#d03c0b` for the listing's own badge. Heart (save) top-right, 56x56.
- Body padding 12px: price in display font 20px/24px 700 ("$825/mo"), then "Fees may apply" 14px inline; a
  "•••" menu button (blue, 32x20) at the far right (Hide / Report, stubs at calm); details line
  "**2** bds | **1** ba | **850** sqft | Apartment for rent" 14px; address 14px/24px `#535364`, one line with
  ellipsis.
- Whole card links to `/listing/[id]`.

**Sort menu**: Recommended (default, by `listedDaysAgo` then id), Price (low to high), Price (high to low),
Newest, Bedrooms, Square feet.

**Empty state**: "No matching results. Try changing your search, such as removing filters or zooming out." plus a
"Remove all filters" link.

**URL is the state.** Every filter, the sort and the page live in the query string, so back/forward, refresh and
shared links all work. Changing a filter resets the page to 1.

## 4. Data changes (shared file, additive)

Add to `Listing` in `src/data/listings.ts`:

```ts
lat: number;
lng: number;
homeType: "Apartment" | "House" | "Townhome" | "Condo";
photos: string[];          // 3 to 5 Unsplash URLs; photos[0] === photo
listedDaysAgo: number;
applyInstantly: boolean;
pets: "cats" | "dogs" | "both" | "none";
laundry: "in-unit" | "shared" | "none";
parking: boolean;
availableFrom: string;     // ISO date
```

- Keep every existing field and id. Keep `photo` (the homepage card uses it).
- Grow to about 60 listings across Rock Island, Moline, East Moline, Silvis, Davenport and Bettendorf, with realistic
  coordinates inside each city. Mostly apartments, so it feels like apartment hunting.
- Photos: reuse the 26 Unsplash ids already verified, and check any new id with
  `curl -s -o /dev/null -w "%{http_code}" "https://images.unsplash.com/photo-<id>?w=100"` before using it (200 only).
- Add `cities` (slug, label, center lat/lng) to the same file; the globe (#5) needs the same list.
- `listing/[id]` still prerenders through `generateStaticParams`, so the new listings get detail pages for free.

## 5. Filter contract (what #9 and #5 plug into)

New shared module `src/filters/` (documented in AGENTS.md in the same PR):

```ts
// src/filters/rent-filters.ts (pure, no React, safe on server and client)
export type SortKey = "recommended" | "price-asc" | "price-desc" | "newest" | "beds" | "sqft";
export type RentFilters = {
  city?: string;            // city slug, e.g. "rock-island-il"
  q?: string;               // free-text location
  minRent?: number;
  maxRent?: number;
  beds?: number;            // minimum
  baths?: number;           // minimum
  homeTypes?: Listing["homeType"][];
  pets?: "cats" | "dogs";
  laundry?: boolean;
  parking?: boolean;
  availableBy?: string;     // ISO date
  sort: SortKey;
  page: number;             // 1-based
};
export const PAGE_SIZE = 20;
export function parseRentFilters(params: URLSearchParams): RentFilters;
export function toSearchParams(filters: RentFilters): URLSearchParams;   // omits defaults
export function applyRentFilters(listings: Listing[], filters: RentFilters): Listing[];  // filter + sort
export function paginate<T>(items: T[], page: number): { items: T[]; pageCount: number };

// src/filters/useRentFilters.ts ("use client")
export function useRentFilters(): {
  filters: RentFilters;
  setFilters: (patch: Partial<RentFilters>) => void;   // router.replace, scroll: false, resets page unless patched
  clearFilters: () => void;
};
```

Replacement slots, each in its own file so a teammate can swap one without touching anything else:

```ts
// src/app/rent/_components/filters/PriceFilter.tsx     -> #9 swaps in the slot machine
// src/app/rent/_components/filters/LocationFilter.tsx  -> #5 swaps in the globe
export type FilterControlProps = { filters: RentFilters; setFilters: (patch: Partial<RentFilters>) => void };
```

Once PR A merges, post on #9 and #5: "the filter contract is in `src/filters/`; replace `PriceFilter.tsx` /
`LocationFilter.tsx`, keep the props".

## 6. Escalation design

Every pain effect is decided in one pure function, so tuning thresholds is a one-file change:

```ts
// src/app/rent/_lib/rent-pain.ts
export type RentEffects = { /* one boolean or number per effect below */ };
export function rentEffects(pain: number): RentEffects;
```

Components read `usePain()` once at the top (`RentPage`), compute `rentEffects(pain)`, and pass flags down. Until
`ready`, use `rentEffects(0)` (no hydration mismatch). Each effect is a small hook or component in
`src/app/rent/_effects/<effect>.tsx`, so effects stay independent and easy to delete.

Pain sources specific to Rent (via `bump`): changing a filter +1, changing sort +1, going to another page of
results +2, opening a card's "•••" menu +1, clicking "Save search" +3.

### Mild (10+): "huh, that's a bit much"
- **Fees reveal.** "Fees may apply" becomes "+ $389 in fees" on hover; the amount grows with pain.
- **Recommended for us.** "Recommended" sort quietly puts the most expensive listings first.
- **Inflated count.** "47 rentals available" becomes "4,812 rentals available (showing 47)".
- **Urgency badges.** Some cards get a white badge "12 people applied today"; the number ticks up while you watch.
- **Sticky Save search.** "Save search" opens a sign-in modal instead of a toast. Its close button is small.

### Annoying (30+): clearly hostile UX
- **Sponsored filler.** Every 4th card is a "Promoted" listing that ignores the filters: a parking spot, a closet
  ("cozy"), a shed. Same card design, so it looks legit.
- **Filter amnesia.** Moving the map resets one random filter (shown as a toast: "We cleared Pets to show you
  more homes").
- **Beds options get weird.** The Beds menu adds "0.5", "Studio-ish", "Couch", "Bunk (shared)".
- **Pagination lies.** Page 2 is page 1 shuffled; the page numbers grow ("1 2 3 … 412").
- **Price creep.** A listing's rent goes up $5 each time its card scrolls back into view (tracked per session).
- **Map pin shyness.** Pins slide a few pixels away from the cursor. They stay clickable via the card.

### Hostile (60+): the site fights back
- **Self-sorting list.** The grid re-sorts itself every ~8 seconds with a "Prices updated" toast.
- **Ghost listings.** Clicking a card has a 1-in-3 chance of showing "This listing is no longer available" for
  2 seconds; the card then comes back with a higher price and an orange "Back on market!" badge.
- **Income gate.** Cards show "Income must be 40x rent". Clicking "Apply instantly" first opens an inline
  calculator that always says you are $3 short.
- **Filters become a form.** The popover filter bar becomes a single vertical stack of 30 checkboxes in a
  different font ("Must have: walls", "Must have: floor", "Ceiling (optional)").
- **Map degradation.** The map tiles switch to a grayscale or hand-sketched style, and zoom +/- are swapped.

### Unhinged (90+): a different, worse website
- **Geocities mode.** Rent switches to its own unhinged stylesheet: tiled background, Comic Sans, marquee header
  "WELCOME 2 HELLOW RENTALZ", visitor counter, under-construction GIF made in CSS. (Pages not matching each other
  is part of the joke.)
- **Gravity cards.** Cards slowly sag and pile up at the bottom of the list (transforms only, so they stay
  clickable; respects reduced motion).
- **All roads lead to one listing.** Every card shows a different photo, but every link goes to the same listing.
- **Absurd listing tags**: "Haunted (friendly)", "Landlord lives in closet", "Bathroom is outside", "Rent payable
  in vibes".

### Guardrails (from AGENTS.md hard limits, applied here)
- A user can always reach a real listing detail page from the grid, at every tier. Other teammates' features live
  there.
- Nothing blocks the browser: no `beforeunload`, no history traps, every modal closes with Escape.
- `prefers-reduced-motion`: anything that moves (gravity, shy pins, reshuffles) falls back to a static version
  with the same joke.
- Timers and observers are cleaned up on unmount; nothing runs while the tab is hidden.
- Randomness is seeded by listing id + pain tier, so a demo is repeatable.

## 7. File layout (everything under paths the Rent owner controls, except where marked)

```
src/filters/rent-filters.ts                 new, shared contract
src/filters/useRentFilters.ts               new, shared contract
src/data/listings.ts                        shared, additive changes (section 4)
src/components/site/SiteHeader.tsx          shared, one link: Rent -> /rent
src/components/home/ActionCards.tsx         shared, one link: Find rentals -> /rent
src/components/home/Hero.tsx                shared, form action -> /rent (if decision 2 = yes)
AGENTS.md                                   shared, add /rent to the repo map + a "Filter contract" section
src/app/rent/
  page.tsx                                  server: metadata + <Suspense><RentPage/></Suspense>
  RentPage.tsx                              client: reads filters + pain, lays out the page
  rent.module.css
  _components/
    FilterBar.tsx, FilterPopover.tsx
    filters/PriceFilter.tsx                 slot for #9
    filters/LocationFilter.tsx              slot for #5
    filters/BedsBathsFilter.tsx, PropertyTypeFilter.tsx, MoreFilters.tsx
    RentMap.tsx                             client-only (next/dynamic, ssr: false) Leaflet map
    RentCard.tsx, ResultsHeader.tsx, SortMenu.tsx, Pagination.tsx, EmptyState.tsx
  _lib/
    rent-pain.ts                            pain -> effects
    seeded-random.ts
  _effects/                                 one file per escalation
  unhinged.module.css
```

## 8. Phases (one PR each, every PR needs one teammate approval)

**PR A: Contract and shell** (small, merge first so #9 and #5 can start)
1. Branch `rent/contract-and-shell` (create it before any edit).
2. Extend `Listing` and grow the data (section 4). Build.
3. Add `src/filters/` with parse / serialize / apply / paginate and `useRentFilters`. Build.
4. Add `/rent` with a plain unstyled list driven by the filters (proves the contract end to end). Build.
5. Repoint the shared links (decisions 1 and 2). Build.
6. Update AGENTS.md (repo map, filter contract section). Commit this plan file too.
7. PR, then comment on #9 and #5 once merged.

**PR B: Calm tier, Zillow-faithful** (section 3)
1. Layout + FilterBar + popovers + LocationFilter / PriceFilter defaults.
2. RentCard with photo dots + badges; results header; sort menu; pagination; empty state.
3. Map (Leaflet), linked hover between pins and cards.
4. Mobile layout (filters sheet, Map/List toggle).
5. Visual check side by side with zillow.com at 1440px and 390px.

**PR C: Mild + Annoying** (section 6). One commit per effect.

**PR D: Hostile + Unhinged** (section 6). One commit per effect.

Each phase: small commits by layer, the build through the heavy-job gate before every commit, rebase on
`origin/main` before pushing.

## 9. Verification (per PR)

- `npm run build` through the gate passes.
- Production server (`npx next start`), then in the `chrome-personal` browser at 1440px and 390px:
  - Calm (`document.cookie = "hellow_pain=0; path=/"`, reload): the page matches the section 3 spec; every
    filter, sort and page change updates the URL and the results; back/forward restores them; refresh keeps them;
    empty state shows; pins and cards highlight each other; no horizontal scroll at 390px.
  - Then set 10, 30, 60, 90 and confirm each tier's effects appear and the previous tier's effects still apply
    (unless replaced). At every tier a listing detail page is still reachable.
  - Reduced motion (DevTools rendering emulation or `browser_emulate_media`): nothing animates and the effects
    still read.
- Console: no hydration warnings and no React key warnings on `/rent`.
- Stop the preview server when done.

## 10. Risks

- **Leaflet and SSR.** Leaflet touches `window`; load it only on the client (`next/dynamic` with `ssr: false`) and
  import `leaflet/dist/leaflet.css` there. If CARTO tiles fail, fall back to OSM's standard tiles.
- **Cache Components.** `/rent` reads `searchParams`; keep the page shell static and read the params inside
  `<Suspense>` (same pattern as `/search`).
- **Shared-file conflicts.** `listings.ts` and the header are shared; land PR A fast and keep its diff additive.
- **Teammate swaps.** If #9 or #5 change `FilterControlProps`, that is a contract change: update AGENTS.md in the
  same PR.
