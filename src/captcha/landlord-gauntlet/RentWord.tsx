"use client";

import { useState } from "react";
import { DistortedText } from "../DistortedText";
import type { RoundProps } from "../types";
import { GIVE_UP_MESSAGE, useAttempts } from "../useAttempts";
import shared from "../shared.module.css";

const WORD = "rent";
const FONTS = ["Georgia, serif", "'Courier New', monospace", "'Brush Script MT', cursive", "Impact, fantasy", "Arial, sans-serif"];

/** Round (c): the word "rent" drawn in five overlapping fonts. */
export function RentWord({ onPass }: RoundProps) {
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const { gaveUp, fail } = useAttempts(onPass);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (answer.trim().toLowerCase() === WORD) {
      onPass();
      return;
    }
    fail();
    setMessage("That is not what it says. Try squinting.");
  };

  return (
    <form onSubmit={submit}>
      <h2 className={shared.prompt}>Type the word you see.</h2>
      <DistortedText text={WORD} fonts={FONTS} label="A four letter word" />
      <label className={shared.hint}>
        Word
        <input className={shared.field} autoComplete="off" value={answer} onChange={(event) => setAnswer(event.target.value)} />
      </label>
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
