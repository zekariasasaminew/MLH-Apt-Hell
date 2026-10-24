"use client";

import { useEffect, useRef, useState } from "react";
import { hashString, mulberry32 } from "@/app/rent/_lib/seeded-random";
import { useReducedMotion } from "@/app/rent/_lib/useReducedMotion";
import type { RoundProps } from "../types";
import { GIVE_UP_MESSAGE, useAttempts } from "../useAttempts";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const TILE_COUNT = 16;
const MAX_REFRESHES = 2;
const FADE_MS = 450;

type Face = { landlord: boolean; eyeGap: number; eyeSize: number; smile: number; tone: number };

function makeFace(tile: number, generation: number): Face {
  const random = mulberry32(hashString(`face:${tile}:${generation}`));
  return {
    landlord: random() < 0.25,
    eyeGap: 11 + random() * 2,
    eyeSize: 2.4 + random() * 0.6,
    smile: 5 + random() * 2,
    tone: 36 + Math.floor(random() * 3),
  };
}

function FaceSvg({ face }: { face: Face }) {
  return (
    <svg viewBox="0 0 60 60" className={styles.face} aria-hidden="true">
      <circle cx="30" cy="30" r="24" fill={`hsl(${face.tone} 55% 72%)`} />
      <circle cx={30 - face.eyeGap} cy="26" r={face.eyeSize} fill="#2a2a33" />
      <circle cx={30 + face.eyeGap} cy="26" r={face.eyeSize} fill="#2a2a33" />
      <path d={`M 20 38 Q 30 ${38 + face.smile} 40 38`} stroke="#2a2a33" strokeWidth="2" fill="none" />
      {face.landlord && <rect x="33" y="38.5" width="2.5" height="2.5" fill="#d4af37" />}
    </svg>
  );
}

/** Round (a): select every landlord. They look alike and tiles replace themselves after clicks, up to twice. */
export function LandlordFaces({ onPass }: RoundProps) {
  const reducedMotion = useReducedMotion();
  const [generations, setGenerations] = useState<number[]>(() => Array(TILE_COUNT).fill(0));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [fading, setFading] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const refreshes = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { gaveUp, fail } = useAttempts(onPass);

  useEffect(() => () => clearTimeout(timer.current), []);

  const faces = generations.map((generation, tile) => makeFace(tile, generation));

  const replace = (tile: number) =>
    setGenerations((current) => current.map((generation, index) => (index === tile ? generation + 1 : generation)));

  const click = (tile: number) => {
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(tile)) next.add(tile);
      return next;
    });
    if (refreshes.current >= MAX_REFRESHES) return;
    refreshes.current += 1;
    if (reducedMotion) {
      replace(tile);
      return;
    }
    setFading(tile);
    timer.current = setTimeout(() => {
      replace(tile);
      setFading(null);
    }, FADE_MS);
  };

  const verify = () => {
    const correct = faces.every((face, tile) => face.landlord === selected.has(tile));
    if (correct) {
      onPass();
      return;
    }
    fail();
    setMessage("Not quite. Landlords are good at blending in.");
  };

  return (
    <div>
      <h2 className={shared.prompt}>Select every tile containing the landlord.</h2>
      <p className={shared.hint}>Look for the gold tooth.</p>
      <div className={styles.faceGrid} role="group" aria-label="Face tiles">
        {faces.map((face, tile) => (
          <button
            key={tile}
            type="button"
            className={`${styles.faceTile} ${selected.has(tile) ? styles.selected : ""} ${fading === tile ? styles.fading : ""}`}
            aria-pressed={selected.has(tile)}
            aria-label={`Face ${tile + 1}`}
            onClick={() => click(tile)}
          >
            <FaceSvg face={face} />
          </button>
        ))}
      </div>
      <p className={shared.message} role="status">
        {gaveUp ? GIVE_UP_MESSAGE : message}
      </p>
      <div className={shared.actions}>
        <button type="button" className={shared.primary} disabled={gaveUp} onClick={verify}>
          Verify
        </button>
      </div>
    </div>
  );
}
