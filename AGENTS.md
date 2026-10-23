<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Hellow: source of truth for humans and agents

Read this whole file before writing code. If something here conflicts with your own defaults, this file wins.
If you change how a shared system works, update this file in the same PR.

## What we are building

**Hellow** is a parody of Zillow for an MLH hackathon. The landing page looks like Zillow's homepage: clean, calm,
trustworthy. Then, the more someone uses the site, the more frustrating it gets, until it is absurd.

Product rules:

1. **Start clean, end absurd.** A first-time visitor must see a polished, believable rental site. Frustration ramps
   up with the **pain level** (see below), never all at once.
2. **Frustration is everywhere.** Every page and every flow should have ways to get worse: search, listings,
   sign-in, the application, the footer, everything.
3. **Pages do not need to match each other.** Inconsistent UI is itself one of the annoyances. A page can switch
   fonts, colors or layout entirely once pain is high, or simply look like it was built by a different company.
   The homepage stays Zillow-like at low pain.
4. **It must stay demoable.** Annoying, never broken. See "Hard limits".

## Stack

- Next.js 16 (App Router, Turbopack, **Cache Components enabled**), React 19, TypeScript.
- Plain CSS Modules plus the tokens in `src/app/globals.css`. No Tailwind, no UI libraries unless the team agrees.
- **No database, no backend services.** State lives in cookies (and in-memory React state). Nothing is ever
  submitted anywhere real.
- Fake data lives in `src/data/listings.ts`. Photos come from `images.unsplash.com` via `next/image`.
- Deployed on Vercel. Every PR gets a preview URL.

Commands:

```bash
npm install
npm run dev      # http://localhost:3000, the pain meter shows bottom-left
npm run build    # the only CI check; must pass before you open a PR
```

## Repo map

```
src/
  app/
    layout.tsx              root layout: PainProvider, AnnoyanceHost, PainMeter (shared, edit rarely)
    globals.css             design tokens (shared, edit rarely)
    page.tsx                homepage (Zillow clone)
    rent/                   /rent              rental search results (zekariasasaminew)
    search/                 /search            (unclaimed placeholder, meant for Buy)
    listing/[id]/           /listing/:id       (unclaimed placeholder)
    signin/                 /signin            (unclaimed placeholder)
    apply/                  /apply             (unclaimed placeholder)
  components/
    site/                   shared Zillow chrome: SiteHeader, SiteFooter, Logo, ListingCard, Placeholder
    home/                   homepage-only sections
  pain/
    pain-cookie.ts          cookie name, TIERS, per-click / per-page-view amounts
    PainProvider.tsx        usePain() hook
    PainMeter.tsx           dev overlay
  annoyances/
    types.ts                Annoyance type + route matching
    registry.ts             list of every annoyance (one line each)
    AnnoyanceHost.tsx       renders active annoyances
    <annoyance-id>/         one folder per annoyance
  filters/
    rent-filters.ts         RentFilters type, parse / serialize / apply / paginate (pure)
    useRentFilters.ts       URL-backed filter hook + FilterControlProps
  data/listings.ts          60 fake Quad Cities rentals + the cities list
```

## The pain system

A single number from 0 to 100 stored in the `hellow_pain` cookie (30 day expiry).

- Every click anywhere: **+1**. Every page view (route change): **+3**. Values live in `src/pain/pain-cookie.ts`.
- Anything can add more with `bump(n)`, e.g. submitting a form, opening a dropdown, failing a captcha.
- Clicks inside an element with the `data-pain-ignore` attribute do not count.

Shared tiers (always use these instead of magic numbers):

| Tier       | Pain | Feel                                                         |
|------------|------|--------------------------------------------------------------|
| `calm`     | 0    | Looks exactly like Zillow. At most a normal cookie banner.   |
| `mild`     | 10   | Small, plausible annoyances. "Huh, that's a bit much."       |
| `annoying` | 30   | Clearly hostile UX patterns.                                 |
| `hostile`  | 60   | The site is actively fighting the user.                      |
| `unhinged` | 90   | Absurd. Layout falls apart, nothing behaves.                 |

Reading pain in a page or component (client component only):

```tsx
"use client";
import { usePain } from "@/pain/PainProvider";
import { TIERS } from "@/pain/pain-cookie";

export function ApplyButton() {
  const { pain, ready, bump } = usePain();
  const evasive = ready && pain >= TIERS.annoying;
  // ...
}
```

`ready` is false during server render and until the cookie is read. Render the calm version until `ready` is true,
otherwise you get hydration mismatches.

Testing: the **PainMeter** (bottom-left in `npm run dev`, or Ctrl+Shift+P on a deployed site) shows the level and has
+10 / -10 / reset buttons. You can also set the cookie by hand: `document.cookie = "hellow_pain=75; path=/"`.

## Two ways to add frustration

### 1. In-page degradation (most work goes here)

Inside the page or component you own, call `usePain()` and change behavior by tier: move buttons, reorder fields,
change copy, swap styles, add steps. This is how you make a specific page worse.

### 2. Global annoyances (overlays, popups, toasts, banners)

For things that float above any page, add an annoyance:

1. Create `src/annoyances/<your-id>/index.tsx` (plus `styles.module.css`). Copy `rent-went-up/` as a template.
2. Default-export an `Annoyance`:
   ```tsx
   const myAnnoyance: Annoyance = {
     id: "my-annoyance",          // same as the folder name
     owner: "your-github-handle",
     minPain: TIERS.annoying,     // shows from here
     maxPain: TIERS.unhinged,     // optional: stops here (replace it with something worse)
     routes: ["/listing/*"],      // optional: "/x" exact, "/x/*" prefix; omit for every page
     Component: MyAnnoyance,      // receives { pain, bump, dismiss }
   };
   ```
3. Add one import and one line to `src/annoyances/registry.ts`, keeping the list alphabetical.

`dismiss()` hides it until the next page view; it comes back after that (on purpose). If you need it to stay gone,
store that in your own cookie named `hellow_<your-id>`.

The `popup-apocalypse` manager is mounted at the calm tier to track active session time. It shows no ads until
five minutes of visible-tab use after the first interaction. Its timer and completed dismissals use sessionStorage
(`hellow_popup-apocalypse`) across navigation; at most four fictional ads appear at once. In development, use
the “Demo popup apocalypse” button to trigger/reset it immediately. Every ad has an accessible dismissal.

## Working in parallel (4 people, 4 agents)

- **One issue, one branch, one PR.** Branch names: `<area>/<short-description>`, e.g. `annoyance/fake-captcha`,
  `page/apply-step-2`.
- **Stay in your lane.** Edit only the folders your issue is about. Each page and annoyance has its own folder and
  CSS module so PRs don't collide.
- **Shared files** (`layout.tsx`, `globals.css`, `pain/*`, `annoyances/types.ts`, `components/site/*`,
  `data/listings.ts`): keep changes small and additive. Don't rename or reformat things other people use. If you
  must change a shared API, say so in the PR description and update this file.
- **`registry.ts` is the one place everyone touches.** One line per annoyance, alphabetical, so merges stay trivial.
- Never push to `main`. It is protected; everything goes through a PR.
- Before opening a PR: `git fetch && git rebase origin/main`, then `npm run build`. CI runs the same build.
- Small commits, imperative messages that say why ("Make the apply button dodge the cursor at hostile pain").
- No new dependencies without telling the team in the PR description.

## How /rent escalates

`src/app/rent/_lib/rent-pain.ts` has one pure function, `rentEffects(pain)`, that returns a flag per effect. Change a
threshold there and nothing else. `RentPage.tsx` calls `usePain()` once, computes the effects (all off until the
cookie is read) and passes them down. Effects stack: everything from lower tiers stays on.

- Page-level effects: `RentPage.tsx` (expensive-first sort, lying pagination, sponsored filler, self-sorting list,
  filter amnesia), `FilterBar.tsx` / `ResultsHeader.tsx` (inflated count, form-style filters).
- Per-card effects: `_components/ResultsGrid.tsx` (price creep, ghost listings, urgency badges, income gate, tags).
- One file per standalone effect in `src/app/rent/_effects/` (save-search modal, income calculator, filters form,
  Geocities banner). The unhinged restyle is `unhinged.module.css`, targeting `data-rent="..."` attributes.
- Randomness is seeded (`_lib/seeded-random.ts`) so a demo repeats. Modals close on Escape, nothing touches the
  history stack, and moving effects check `prefers-reduced-motion`.
- Map: Leaflet with OpenStreetMap tiles, loaded client-only (`RentMapLoader.tsx`). Keep the attribution.

## The rent filter contract

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
- Pain is client-side. If a server component needs it, read the `hellow_pain` cookie with `cookies()` inside
  Suspense and parse it with `parsePain()` from `src/pain/pain-cookie.ts`.
- `next/image` from new hosts needs an entry in `images.remotePatterns` in `next.config.ts`.
- Typed route props: use the global `PageProps<"/route">` and `LayoutProps<"/route">` helpers.
