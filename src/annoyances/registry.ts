import cookieConsent from "./cookie-consent";
import rentWentUp from "./rent-went-up";
import type { Annoyance } from "./types";

/** Every annoyance in the app. Add yours on its own line and keep the list alphabetical. */
export const annoyances: Annoyance[] = [
  cookieConsent,
  rentWentUp,
];
