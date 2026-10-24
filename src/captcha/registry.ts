import cancelBoss from "./cancel-boss";
import checkboxWobble from "./checkbox-wobble";
import creepingRent from "./creeping-rent";
import houseGrid from "./house-grid";
import landlordGauntlet from "./landlord-gauntlet";
import passwordBoss from "./password-boss";
import sliderGap from "./slider-gap";
import type { Captcha } from "./types";

/** Every CAPTCHA in the app. Add yours on its own line and keep the list alphabetical. */
export const captchas: Captcha[] = [
  cancelBoss,
  checkboxWobble,
  creepingRent,
  houseGrid,
  landlordGauntlet,
  passwordBoss,
  sliderGap,
];
