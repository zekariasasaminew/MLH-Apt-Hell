"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import type { RoundProps } from "./types";
import shared from "./shared.module.css";

export type Round = { id: string; Component: ComponentType<RoundProps> };

type RoundSequenceProps = {
  rounds: Round[];
  onPass: () => void;
  heading?: string;
  progress?: "exact" | "estimated" | "none";
};

/** Runs rounds one after another and passes when the last one does. */
export function RoundSequence({ rounds, onPass, heading, progress = "exact" }: RoundSequenceProps) {
  const [index, setIndex] = useState(0);
  const { id, Component } = rounds[index];
  const label = `Round ${index + 1} of ${rounds.length}${progress === "estimated" ? " (estimated)" : ""}`;

  return (
    <div>
      {heading && <h2 className={shared.prompt}>{heading}</h2>}
      {progress !== "none" && (
        <>
          <progress className={shared.progress} value={index + 1} max={rounds.length} aria-label={label} />
          <span className={shared.progressLabel}>{label}</span>
        </>
      )}
      <Component key={id} onPass={() => (index + 1 >= rounds.length ? onPass() : setIndex(index + 1))} />
    </div>
  );
}
