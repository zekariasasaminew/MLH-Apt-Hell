"use client";

import { CheckboxRound } from "../checkbox-wobble";
import { RentWord } from "../landlord-gauntlet/RentWord";
import { RotateHouse } from "../landlord-gauntlet/RotateHouse";
import { RoundSequence } from "../RoundSequence";
import type { Captcha } from "../types";
import { LandlordFeeling } from "./LandlordFeeling";
import { NestedCheckbox } from "./NestedCheckbox";

const rounds = [
  { id: "checkbox", Component: CheckboxRound },
  { id: "landlord-feeling", Component: LandlordFeeling },
  { id: "rotate-house", Component: RotateHouse },
  { id: "rent-word", Component: RentWord },
  { id: "nested-checkbox", Component: NestedCheckbox },
];

const passwordBoss: Captcha = {
  id: "password-boss",
  Component: ({ onPass }) => <RoundSequence rounds={rounds} onPass={onPass} progress="estimated" />,
};

export default passwordBoss;
