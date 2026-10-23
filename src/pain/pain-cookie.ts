export const PAIN_COOKIE = "hellow_pain";
export const MAX_PAIN = 100;

/** Pain added automatically by PainProvider. Pages and annoyances can add more with `bump`. */
export const PAIN_PER_CLICK = 1;
export const PAIN_PER_PAGE_VIEW = 3;

/** Shared thresholds so everyone's annoyances escalate on the same scale. */
export const TIERS = {
  calm: 0,
  mild: 10,
  annoying: 30,
  hostile: 60,
  unhinged: 90,
} as const;

export type Tier = keyof typeof TIERS;

export function tierOf(pain: number): Tier {
  const reached = (Object.keys(TIERS) as Tier[]).filter((tier) => pain >= TIERS[tier]);
  return reached[reached.length - 1];
}

export function clampPain(pain: number): number {
  return Math.min(MAX_PAIN, Math.max(0, Math.round(pain)));
}

export function parsePain(raw: string | undefined): number {
  const value = Number(raw);
  return Number.isFinite(value) ? clampPain(value) : 0;
}

export function readPainCookie(): number {
  const match = document.cookie.match(new RegExp(`(?:^|; )${PAIN_COOKIE}=([^;]*)`));
  return parsePain(match?.[1]);
}

export function writePainCookie(pain: number): void {
  document.cookie = `${PAIN_COOKIE}=${clampPain(pain)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}
