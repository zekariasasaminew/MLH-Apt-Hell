"use client";

import { RoundSequence } from "../RoundSequence";
import type { Captcha } from "../types";
import { LandlordFaces } from "./LandlordFaces";
import { RentWord } from "./RentWord";
import { RotateHouse } from "./RotateHouse";

const rounds = [
  { id: "landlord-faces", Component: LandlordFaces },
  { id: "rotate-house", Component: RotateHouse },
  { id: "rent-word", Component: RentWord },
];

const landlordGauntlet: Captcha = {
  id: "landlord-gauntlet",
  Component: ({ onPass }) => <RoundSequence rounds={rounds} onPass={onPass} />,
};

export default landlordGauntlet;
