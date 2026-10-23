import { hashString, seededShuffle } from "../_lib/seeded-random";

const TAGS = [
  "Haunted (friendly)",
  "Landlord lives in closet",
  "Bathroom is outside",
  "Rent payable in vibes",
  "Floor optional",
  "Smells like a candle store",
  "Has a door (shared)",
  "Previous tenant never left",
  "Includes one (1) stair",
  "Ceiling fan is load-bearing",
];

/** Two deterministic absurd tags per listing so the demo looks the same every time. */
export function absurdTagsFor(listingId: string): string[] {
  return seededShuffle(TAGS, hashString(listingId)).slice(0, 2);
}
