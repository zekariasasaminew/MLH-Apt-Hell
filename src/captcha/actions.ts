/** The single map of gated action to CAPTCHA id. Call sites use the action name, never the id. */
export const actions = {
  "contact-agent": "landlord-gauntlet",
  "enter-rent": "checkbox-wobble",
  "open-listing": "house-grid",
  "save-listing": "slider-gap",
  "save-search": "slider-gap",
  "schedule-tour": "creeping-rent",
} as const satisfies Record<string, string>;

export type CaptchaAction = keyof typeof actions;
