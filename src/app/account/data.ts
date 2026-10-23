export type BrainrotAvatar = {
  id: string;
  glyph: string;
  name: string;
  title: string;
  rarity: "Common" | "Cursed" | "Unhinged" | "Condemned";
  catchphrase: string;
  biography: string;
  housingAura: number;
  mortgageResistance: number;
  landlordEnergy: number;
  specialAbility: string;
  theme: "wood" | "coffee" | "banana" | "beige" | "hoa" | "boss";
};

export const AVATARS: BrainrotAvatar[] = [
  {
    id: "tung-sahur",
    glyph: "🪵",
    name: "Tung Tung Tung Sahur",
    title: "Knocker of Uninspected Doors",
    rarity: "Unhinged",
    catchphrase: "TUNG TUNG TUNG, YOUR RENT IS DUE.",
    biography: "Appears at dawn whenever a listing calls a hallway a bedroom.",
    housingAura: 67,
    mortgageResistance: 13,
    landlordEnergy: 92,
    specialAbility: "Wakes an entire open house with one wooden bonk.",
    theme: "wood",
  },
  {
    id: "ballerina-cappuccina",
    glyph: "☕",
    name: "Ballerina Cappuccina",
    title: "Principal Dancer of the Kitchen Nook",
    rarity: "Cursed",
    catchphrase: "Your budget lacks foam and emotional depth.",
    biography: "Pirouettes through closing costs while spilling espresso on the lease.",
    housingAura: 88,
    mortgageResistance: 44,
    landlordEnergy: 17,
    specialAbility: "Turns every floor plan into an interpretive dance.",
    theme: "coffee",
  },
  {
    id: "chimpanzini-bananini",
    glyph: "🍌",
    name: "Chimpanzini Bananini",
    title: "Fruit Inspector General",
    rarity: "Common",
    catchphrase: "This escrow is not ripe.",
    biography: "Keeps emergency potassium inside a legally questionable pantry.",
    housingAura: 42,
    mortgageResistance: 67,
    landlordEnergy: 31,
    specialAbility: "Converts notification badges into bananas.",
    theme: "banana",
  },
  {
    id: "sentient-beige-carpet",
    glyph: "🟫",
    name: "Sentient Beige Carpet",
    title: "Keeper of the Security Deposit",
    rarity: "Condemned",
    catchphrase: "The stain was already here.",
    biography: "Born beneath a rental inspection and powered by unrecoverable deposits.",
    housingAura: 67,
    mortgageResistance: 2,
    landlordEnergy: 999,
    specialAbility: "Conceals structural damage during open houses.",
    theme: "beige",
  },
  {
    id: "hoa-capybara",
    glyph: "🦫",
    name: "HOA Enforcement Capybara",
    title: "Deputy Assistant Lawn Ornament Auditor",
    rarity: "Unhinged",
    catchphrase: "Your whimsy requires committee approval.",
    biography: "Calmly issues citations for mailbox individuality and unauthorized joy.",
    housingAura: 12,
    mortgageResistance: 81,
    landlordEnergy: 100,
    specialAbility: "Schedules an emergency meeting in six to eight weeks.",
    theme: "hoa",
  },
  {
    id: "mortgage-final-boss",
    glyph: "🏦",
    name: "Mortgage Payment Final Boss",
    title: "Devourer of Thirty-Year Terms",
    rarity: "Condemned",
    catchphrase: "YOUR APR HAS ENTERED PHASE TWO.",
    biography: "A sentient amortization table with three health bars and no mercy.",
    housingAura: 99,
    mortgageResistance: 999,
    landlordEnergy: 67,
    specialAbility: "Summons an unexpected escrow adjustment.",
    theme: "boss",
  },
];

export const VOICE_LINES = [
  "Your budget has failed the vibe check.",
  "The algorithm hungers.",
  "Three bathrooms? In this economy?",
  "The HOA has detected whimsy.",
  "Luxury is a mindset. Plumbing is optional.",
  "Congratulations! Nothing meaningful has changed.",
  "A nearby property lowered its price by twelve dollars.",
];

export const PERSONALITIES = [
  "Chaotic Tenant",
  "Neutral Property Goblin",
  "Open-House Cryptid",
  "Financially Delulu",
  "Preapproved Menace",
  "Studio-Apartment Warlord",
];

