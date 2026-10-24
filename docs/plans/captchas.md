# Action-gating CAPTCHAs

Difficulty is a fixed property of each action (see `src/captcha/actions.ts`). No levels, counters or cookies.

| Action | Gate | CAPTCHA id | Difficulty |
| --- | --- | --- | --- |
| `enter-rent` | `RentCaptchaGate` mounted in `src/app/rent/page.tsx` (covers header link, hero search, "Find rentals") | `checkbox-wobble` | easy |
| `open-listing` | `handleNavigate` in `src/app/rent/_components/ResultsGrid.tsx` | `house-grid` | easy |
| `save-listing` | heart `onClick` in `src/app/rent/_components/RentCard.tsx` | `slider-gap` | medium |
| `save-search` | `onSaveSearch` in `src/app/rent/RentPage.tsx` | `slider-gap` | medium |
| `schedule-tour` | `save()` in `src/app/listing/analog-tours/TourScheduler.tsx` | `creeping-rent` | hard |
| `contact-agent` | callback button in `src/app/listing/rotary-contact/RotaryContact.tsx` | `landlord-gauntlet` | insane |
| `change-password` | `submit()` in `src/app/signin/page.tsx` and a new "Change password" button in the Login & Security section of `src/app/account/page.tsx` | `password-boss` | insane boss |
| `cancel-subscription` | "Confirm Cancellation" in `src/app/account/CancelSubscriptionFlow.tsx` | `cancel-boss` | insane |

## Decisions

- Call sites pass the action name; `actions.ts` maps it to a CAPTCHA id, so swapping one is a one-line change.
- `requireCaptcha(action, context?)` takes an optional `{ listingId }` so `creeping-rent` can show the real listing rent without changing teammates' props.
- The Login & Security section had no password-change control, so a single "Change password" button was added there to hold the gate.
- Issue #8 ("Brainrot additions") lists a "Captcha from Hell" idea, but no captcha code exists in `src/`. Nothing to reuse.
- `/rent` is gated by an overlay on mount (not a route block), so the page still prerenders. Cancel replaces the URL with `/`.
- Every round gives up after 3 failures ("Fine. You're too human to verify.") and passes. Escape and a visible Cancel always abort.
