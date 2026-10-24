"use client";

import { CheckboxRound } from "../checkbox-wobble";
import { RentWord } from "../landlord-gauntlet/RentWord";
import { RotateHouse } from "../landlord-gauntlet/RotateHouse";
import { LandlordFeeling } from "../password-boss/LandlordFeeling";
import { NestedCheckbox } from "../password-boss/NestedCheckbox";
import { RoundSequence } from "../RoundSequence";
import type { Captcha } from "../types";

const rounds = [
  { id: "landlord-feeling", Component: LandlordFeeling },
  { id: "rent-word", Component: RentWord },
  { id: "rotate-house", Component: RotateHouse },
  { id: "checkbox", Component: CheckboxRound },
  { id: "nested-checkbox", Component: NestedCheckbox },
];

const cancelBoss: Captcha = {
  id: "cancel-boss",
  Component: ({ onPass }) => (
    <RoundSequence rounds={rounds} onPass={onPass} progress="estimated" heading="Before you cancel, verify you are a former customer." />
  ),
};

export default cancelBoss;
