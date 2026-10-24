import checkboxWobble from "./checkbox-wobble";
import houseGrid from "./house-grid";
import sliderGap from "./slider-gap";
import type { Captcha } from "./types";

/** Every CAPTCHA in the app. Add yours on its own line and keep the list alphabetical. */
export const captchas: Captcha[] = [
  checkboxWobble,
  houseGrid,
  sliderGap,
];
