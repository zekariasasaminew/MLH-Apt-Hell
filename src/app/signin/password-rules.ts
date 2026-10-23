export type PasswordContext = {
  year: number;
  exemptions: boolean;
  demoMode: boolean;
};

export type PasswordRule = {
  id: string;
  level: number;
  label: string;
  explanation: string;
  validate: (password: string, context: PasswordContext) => boolean;
};

const planets = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"];
const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

export const DEMO_PASSWORD = "ZZZHome2026🏠672IVegagtromIA♞Mars🌙😭level#beefed I love paying rent I accept a 30-year mortgage I am financially stable 40+2";

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", level: 1, label: "At least 8 characters", explanation: "A suspiciously normal beginning.", validate: (p) => p.length >= 8 },
  { id: "uppercase", level: 1, label: "Contain an uppercase letter", explanation: "Capital improves curb appeal.", validate: (p) => /[A-Z]/.test(p) },
  { id: "number", level: 1, label: "Contain a number", explanation: "Preferably one you can afford.", validate: (p) => /\d/.test(p) },
  { id: "z", level: 2, label: "Contain the letter Z exactly three times", explanation: "The zoning board insists.", validate: (p) => (p.match(/Z/g) ?? []).length === 3 },
  { id: "year", level: 2, label: "Contain the current year", explanation: "Time is a closing cost.", validate: (p, c) => p.includes(String(c.year)) },
  { id: "house", level: 2, label: "Include a house emoji 🏠", explanation: "Proof of imaginary ownership.", validate: (p) => p.includes("🏠") },
  { id: "prime", level: 2, label: "Contain a prime number", explanation: "The council recommends 67.", validate: (p) => p.includes("67") },
  { id: "roman", level: 2, label: "Include a Roman numeral", explanation: "Your bedroom count deserves gravitas.", validate: (p) => /(IV|IX|V?I{1,3}|X)/.test(p) },
  { id: "mortgage-reverse", level: 2, label: "Contain mortgage spelled backward", explanation: "Reverse the debt. Spiritually.", validate: (p) => p.toLowerCase().includes("egagtrom") },
  { id: "digit-sum", level: 3, label: "All digits must add up to exactly 25", explanation: "Mathematically hostile; an HOA exemption appears after three appeals.", validate: (p, c) => c.exemptions || c.demoMode || (p.match(/\d/g) ?? []).reduce((sum, digit) => sum + Number(digit), 0) === 25 },
  { id: "state", level: 3, label: "Contain a US state abbreviation", explanation: "The house must exist in at least one bureaucracy.", validate: (p) => states.some((state) => p.includes(state)) },
  { id: "chess", level: 3, label: "Include a chess piece symbol", explanation: "The rook has excellent square footage.", validate: (p) => /[♔♕♖♗♘♙♚♛♜♝♞♟]/.test(p) },
  { id: "planet", level: 3, label: "Name a planet that is not Earth", explanation: "Terrestrial property values are unacceptable.", validate: (p) => planets.some((planet) => p.toLowerCase().includes(planet)) },
  { id: "rent", level: 3, label: "Include “I love paying rent”", explanation: "Say it like the security deposit can hear you.", validate: (p) => p.includes("I love paying rent") },
  { id: "moon", level: 3, label: "Include the approved moon phase 🌙", explanation: "No external astronomy APIs were harmed.", validate: (p) => p.includes("🌙") },
  { id: "hex", level: 4, label: "Contain a housing-market hex color", explanation: "#beefed is emotionally accurate.", validate: (p) => /#[0-9a-fA-F]{6}/.test(p) },
  { id: "mortgage", level: 4, label: "Accept a 30-year mortgage", explanation: "Use the exact phrase: I accept a 30-year mortgage", validate: (p) => p.includes("I accept a 30-year mortgage") },
  { id: "cry", level: 5, label: "Contain exactly one crying emoji 😭", explanation: "Additional crying happens off-platform.", validate: (p) => p.split("😭").length - 1 === 1 },
  { id: "stable", level: 5, label: "Claim “I am financially stable”", explanation: "The system will not verify this allegation.", validate: (p) => p.includes("I am financially stable") },
  { id: "palindrome", level: 5, label: "Contain a palindrome of at least three letters", explanation: "The approved loophole is level.", validate: (p) => p.toLowerCase().includes("level") },
  { id: "equation", level: 5, label: "Include an equation that evaluates to 42", explanation: "The market accepts 40+2.", validate: (p) => p.replace(/\s/g, "").includes("40+2") },
  { id: "inflation", level: 5, label: "Inflation Alert: reach 100 characters", explanation: "Your password must now be 20% more exhausting.", validate: (p) => p.length >= 100 },
  { id: "hoa-specials", level: 5, label: "Property Tax Reassessment: add three special characters", explanation: "Emoji and punctuation count as structural ornamentation.", validate: (p) => (p.match(/[^A-Za-z0-9\s]/gu) ?? []).length >= 3 },
];

export function validateRules(password: string, rules: PasswordRule[], context: PasswordContext) {
  return rules.map((rule) => ({ ...rule, passed: rule.validate(password, context) }));
}

