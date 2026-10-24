"use client";

import { useEffect, useRef, useState } from "react";
import { getListing } from "@/data/listings";
import { DistortedText } from "../DistortedText";
import type { Captcha, CaptchaProps } from "../types";
import { GIVE_UP_MESSAGE, useAttempts } from "../useAttempts";
import shared from "../shared.module.css";

const FALLBACK_RENT = 1450;
const ACCEPT_WINDOW_SECONDS = 10;

const format = (rent: number) => `$${rent.toLocaleString("en-US")}`;

/** Type the listing's rent. It creeps up $1 each second; any value shown in the last 10 seconds is accepted. */
function CreepingRent({ onPass, context }: CaptchaProps) {
  const baseRent = (context.listingId && getListing(context.listingId)?.rent) || FALLBACK_RENT;
  const startedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const { gaveUp, fail } = useAttempts(onPass);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const current = Math.floor((Date.now() - startedAt.current) / 1000);
    const typed = Number(answer.replace(/\D/g, ""));
    const creep = typed - baseRent;
    if (answer && creep >= 0 && creep >= current - ACCEPT_WINDOW_SECONDS && creep <= current) {
      onPass();
      return;
    }
    fail();
    setMessage("Wrong. The rent has already moved on.");
  };

  return (
    <form onSubmit={submit}>
      <h2 className={shared.prompt}>Type the monthly rent shown below.</h2>
      <DistortedText text={format(baseRent + elapsed)} label="The current monthly rent" />
      <label className={shared.hint}>
        Rent amount
        <input className={shared.field} inputMode="numeric" autoComplete="off" value={answer} onChange={(event) => setAnswer(event.target.value)} />
      </label>
      <p className={shared.hint}>It goes up $1 every second. Values from the last 10 seconds still count.</p>
      <p className={shared.message} role="status">
        {gaveUp ? GIVE_UP_MESSAGE : message}
      </p>
      <div className={shared.actions}>
        <button type="submit" className={shared.primary} disabled={gaveUp}>
          Verify
        </button>
      </div>
    </form>
  );
}

const creepingRent: Captcha = { id: "creeping-rent", Component: CreepingRent };

export default creepingRent;
