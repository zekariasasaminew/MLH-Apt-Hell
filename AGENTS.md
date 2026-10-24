<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Hellow: source of truth for humans and agents

Read this whole file before writing code. If something here conflicts with your own defaults, this file wins.
If you change how a shared system works, update this file in the same PR.

## What we are building

**Hellow** is a parody of Zillow for an MLH hackathon. The landing page looks like Zillow's homepage, and every flow
behind it is as frustrating as we can make it.

Product rules:

1. **Maximum annoyance, always.** There are no levels, no settings and no ramp. Every annoyance is on from the first
   page load, so build each one at full strength.
2. **Frustration is everywhere.** Every page and every flow should be hostile: search, listings, sign-in, the
   application, the footer, everything.
3. **Pages do not need to match each other.** Inconsistent UI is itself one of the annoyances. A page can use its
   own fonts, colors or layout, or simply look like it was built by a different company. The homepage keeps its
   Zillow look and is the bait.
4. **It must stay demoable.** Annoying, never broken. See "Hard limits".

## Stack

- Next.js 16 (App Router, Turbopack, **Cache Components enabled**), React 19, TypeScript.
- Plain CSS Modules plus the tokens in `src/app/globals.css`. No Tailwind, no UI libraries unless the team agrees.
- **No database, no backend services.** State lives in the URL, cookies you name yourself, and in-memory React
  state. Nothing is ever submitted anywhere real.
- Fake data lives in `src/data/listings.ts`. Photos come from `images.unsplash.com` via `next/image`.
- Deployed on Vercel. Every PR gets a preview URL.

Commands:

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # the only CI check; must pass before you open a PR
```

## Repo map

```
src/
  app/
    layout.tsx              root layout: AnnoyanceHost (shared, edit rarely)
    globals.css             design tokens (shared, edit rarely)
    page.tsx                homepage (Zillow clone)
    rent/                   /rent              rental search results (zekariasasaminew)
    search/                 /search            Buy listings; ?type=sell is the simulated seller flow
    listing/[id]/           /listing/:id       (unclaimed placeholder)
    signin/                 /signin            (unclaimed placeholder)
    apply/                  /apply             (unclaimed placeholder)
  components/
    site/                   shared Zillow chrome: SiteHeader, SiteFooter, Logo, ListingCard, Placeholder
    home/                   homepage-only sections
  annoyances/
    types.ts                Annoyance type + route matching
    registry.ts             list of every annoyance (one line each)
    AnnoyanceHost.tsx       renders every annoyance whose routes match
    <annoyance-id>/         one folder per annoyance
  filters/
    rent-filters.ts         RentFilters type, parse / serialize / apply / paginate (pure)
    useRentFilters.ts       URL-backed filter hook + FilterControlProps
  captcha/
    actions.ts              action name to CAPTCHA id (difficulty lives here)
    registry.ts             list of every CAPTCHA (one line each)
    CaptchaProvider.tsx     useCaptcha() and the modal
    <captcha-id>/           one folder per CAPTCHA
  data/listings.ts          60 fake Quad Cities rentals + the cities list
```

## Annoyance model

There is no pain level, no tier and no configuration. Every annoyance is always on at full strength, from the first
page load. Don't add a setting, a cookie-driven ramp or a gentler variant; if you are tempted to build a milder
version of something, build the harsher one instead.

## Two ways to add frustration

### 1. In-page hostility (most work goes here)

Inside the page or component you own, make the thing hostile by default: move buttons, reorder fields, change copy,
swap styles, add steps. This is how you make a specific page worse.

### 2. Global annoyances (overlays, popups, toasts, banners)

For things that float above any page, add an annoyance:

1. Create `src/annoyances/<your-id>/index.tsx` (plus `styles.module.css`). Copy `rent-went-up/` as a template.
2. Default-export an `Annoyance`:
   ```tsx
   const myAnnoyance: Annoyance = {
     id: "my-annoyance",          // same as the folder name
     owner: "your-github-handle",
     routes: ["/listing/*"],      // optional: "/x" exact, "/x/*" prefix; omit for every page
     Component: MyAnnoyance,      // receives { dismiss }
   };
   ```
3. Add one import and one line to `src/annoyances/registry.ts`, keeping the list alphabetical.

`dismiss()` hides it until the next page view; it comes back after that (on purpose). If you need it to stay gone,
store that in your own cookie named `hellow_<your-id>`.

The `popup-apocalypse` manager is always mounted to track active session time. It shows no ads until
five minutes of visible-tab use after the first interaction. Its timer and completed dismissals use sessionStorage
(`hellow_popup-apocalypse`) across navigation; at most four fictional ads appear at once. In development, use
the “Demo popup apocalypse” button to trigger/reset it immediately. Every ad has an accessible dismissal.

## Working in parallel (4 people, 4 agents)

- **One issue, one branch, one PR.** Branch names: `<area>/<short-description>`, e.g. `annoyance/fake-captcha`,
  `page/apply-step-2`.
- **Stay in your lane.** Edit only the folders your issue is about. Each page and annoyance has its own folder and
  CSS module so PRs don't collide.
- **Shared files** (`layout.tsx`, `globals.css`, `annoyances/types.ts`, `components/site/*`,
  `data/listings.ts`): keep changes small and additive. Don't rename or reformat things other people use. If you
  must change a shared API, say so in the PR description and update this file.
- **`registry.ts` is the one place everyone touches.** One line per annoyance, alphabetical, so merges stay trivial.
- Never push to `main`. It is protected; everything goes through a PR.
- Before opening a PR: `git fetch && git rebase origin/main`, then `npm run build`. CI runs the same build.
- Small commits, imperative messages that say why ("Make the apply button dodge the cursor").
- No new dependencies without telling the team in the PR description.

## What /rent does

Every effect is always on. Nothing is configurable.

- Page-level effects: `RentPage.tsx` (expensive-first sort, page 2 repeats page 1, sponsored filler, self-sorting
  list, filter amnesia, every card links to one listing), `ResultsHeader.tsx` (inflated count), `Pagination.tsx`
  (fake "412" pages), `RentMap.tsx` (grayscale map, swapped zoom buttons, shy pins).
- Per-card effects: `_components/ResultsGrid.tsx` (price creep, ghost listings, urgency badges, income gate, tags,
  sagging cards).
- One file per standalone effect in `src/app/rent/_effects/` (save-search modal, income calculator, filters form,
  Geocities banner). The Geocities restyle is `geocities.module.css`, targeting `data-rent="..."` attributes.
- Randomness is seeded (`_lib/seeded-random.ts`) so a demo repeats. Modals close on Escape, nothing touches the
  history stack, and moving effects check `prefers-reduced-motion`.
- Map: Leaflet with OpenStreetMap tiles, loaded client-only (`RentMapLoader.tsx`). Keep the attribution.

## The rent filter contract

Buy and Sell use the existing `/search?type=buy` and `/search?type=sell` navigation links. Buy renders the same `RentPage` with `mode="buy"`, so its theme, map, cards, and annoyances stay in sync with Rent.
Its URL filters use the same keys as Rent (`q`, `city`, `min`, `max`, `sort`, `page`); in Buy, `min` and `max` are
purchase amounts. Fictional sale prices derive from demo rentals in `src/data/property-market.ts`.
The shared filter hook retains `type=buy` while navigating `/search`. `MarketProvider` supplies display wording
and the seven-digit purchase budget to child controls without changing `FilterControlProps`.
Buy cards use `/listing/:id?intent=buy`; the shared details page reads that intent inside Suspense to show
purchase pricing and retain intent on application links. Sell only uses in-memory state and publishes nothing. Legacy `/search?type=rent`
links redirect to `/rent` while retaining their filters. Keep server search-parameter reads inside Suspense.

All /rent filters live in the URL query string (`?city=moline-il&max=1200&sort=price-asc&page=2`), so Back, refresh
and shared links work. Never keep filter state anywhere else.

- `src/filters/rent-filters.ts`: pure functions, safe on server and client. `parseRentFilters`, `toSearchParams`,
  `applyRentFilters`, `paginate`, `PAGE_SIZE`.
- `src/filters/useRentFilters.ts`: client hook returning `{ filters, setFilters, clearFilters }`. `setFilters(patch)`
  merges a patch, resets to page 1 unless the patch sets `page`, and pushes a history entry. Call it from a component
  inside a `<Suspense>` boundary.
- Swappable controls live in their own files and all take `FilterControlProps` (`{ filters, setFilters }`):
  - `src/app/rent/_components/filters/PriceFilter.tsx`: the slot machine (#9) replaces this.
  - `src/app/rent/_components/filters/LocationFilter.tsx`: the globe (#5) replaces this.

  Replace the file's contents, keep the exported name and props, and call `setFilters({ maxRent })` or
  `setFilters({ city })` when the user confirms. Changing the props or the `RentFilters` shape is a contract change:
  say so in the PR and update this section.
- City slugs and the city list come from `cities` in `src/data/listings.ts`.

## CAPTCHAs

Risky actions are gated by fake CAPTCHAs. Difficulty is fixed per action in `src/captcha/actions.ts` (no levels, no
counters, no cookies). The same action always gets the same CAPTCHA.

Gate an action with one line at the call site (the component must be a client component):

```tsx
const { requireCaptcha } = useCaptcha();
if (!(await requireCaptcha("change-password"))) return;
```

`requireCaptcha(action, context?)` resolves `true` on pass and `false` on cancel or Escape. Optional `context` is
`{ listingId }`. To gate a page on entry, mount a small client component that calls it on mount (see
`src/app/rent/RentCaptchaGate.tsx`) so the page still prerenders.

Add a CAPTCHA:

1. Create `src/captcha/<id>/index.tsx` (plus `styles.module.css`) that default-exports a `Captcha`
   (`{ id, Component }`, the component gets `{ onPass, onCancel, context }`). Multi-step ones compose rounds with
   `RoundSequence`; rounds receive `{ onPass }`.
2. Add one import and one line to `src/captcha/registry.ts`, alphabetical.
3. Map an action to the id in `src/captcha/actions.ts`.

Limits every CAPTCHA keeps:

- Always solvable: use `useAttempts(onPass)` so the third failed attempt on a round passes anyway
  ("Fine. You're too human to verify.").
- The provider renders the modal with a visible Cancel, and Escape cancels. No `beforeunload`, no history changes.
- Drag, rotate and slider mechanics have a keyboard path and a plain text label.
- Dodging, drifting and fading check `prefers-reduced-motion` and fall back to static versions.
- Everything is local React, CSS and SVG. No external scripts, no network calls, no real personal data.

## Hard limits (keep it demoable and safe)

- Never trap the user for real: no infinite `alert()` loops, no disabling the browser back button, no
  `beforeunload` traps, nothing that freezes the tab. A judge must be able to leave or reset.
- No real data collection. No real payment fields, no SSN/ID inputs that look real, no sending anything to any
  external service. Fake forms keep their values in component state or cookies only.
- No real Zillow assets: no Zillow logo, name in UI, photos or copied listing data. The brand is **Hellow**.
- No sounds that autoplay at high volume, no flashing content (seizure risk).
- Keep the footer disclaimer that Hellow is a parody not affiliated with Zillow.

## Next.js 16 gotchas in this repo

- **Cache Components is on.** Reading `cookies()`, `headers()`, `searchParams` or `params` in a server component
  must happen inside a `<Suspense>` boundary (see `src/app/search/page.tsx`), or come from `generateStaticParams`
  (see `src/app/listing/[id]/page.tsx`). Otherwise the build fails.
- `next/image` from new hosts needs an entry in `images.remotePatterns` in `next.config.ts`.
- Typed route props: use the global `PageProps<"/route">` and `LayoutProps<"/route">` helpers.
