"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const SEGMENTS = 12;
const SLICE = 360 / SEGMENTS;
const SPIN_MS = 5200;
const MAX_DAYS_AHEAD = 90;

const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const shortLabel = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const longLabel = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

function randomDates() {
  const offsets = new Set<number>();
  while (offsets.size < SEGMENTS) offsets.add(1 + Math.floor(Math.random() * MAX_DAYS_AHEAD));
  return [...offsets].map(offset => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return toIso(d);
  });
}

function wedge(index: number) {
  const point = (deg: number) => {
    const rad = (deg - 90) * Math.PI / 180;
    return `${150 + 140 * Math.cos(rad)} ${150 + 140 * Math.sin(rad)}`;
  };
  return `M150 150 L${point(index * SLICE)} A140 140 0 0 1 ${point((index + 1) * SLICE)} Z`;
}

/** Button that opens a prize wheel; spinning it picks a random tour date and reports it through onPick. */
export function DateWheel({ value, onPick }: { value: string; onPick: (iso: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function open() {
    setDates(randomDates());
    setLanded(null);
    dialog.current?.showModal();
  }
  function close() {
    if (spinning) return;
    dialog.current?.close();
  }
  function spin() {
    if (spinning) return;
    const winner = Math.floor(Math.random() * SEGMENTS);
    const underPointer = winner * SLICE + SLICE * (0.15 + Math.random() * 0.7);
    setLanded(null);
    setSpinning(true);
    setRotation(r => Math.ceil(r / 360) * 360 + 360 * 6 + ((360 - underPointer) % 360));
    timer.current = setTimeout(() => {
      setSpinning(false);
      setLanded(dates[winner]);
    }, SPIN_MS);
  }
  function accept() {
    if (!landed) return;
    onPick(landed);
    dialog.current?.close();
  }

  return <>
    <button type="button" className={styles.wheelOpen} onClick={open}>{value ? longLabel(value) : "Spin the wheel to get a date"}</button>
    <dialog ref={dialog} className={styles.wheelDialog} aria-label="Spin the wheel for your tour date" onCancel={e => { if (spinning) e.preventDefault(); }}>
      <h3>Spin for your tour date</h3>
      <p>Fate chooses. Your calendar was not consulted.</p>
      <div className={styles.wheelStage}>
        <div className={styles.wheelPointer} aria-hidden="true" />
        <svg className={styles.wheel} viewBox="0 0 300 300" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.6, 0.1, 1)` : "none" }}>
          {dates.map((iso, i) => <g key={iso}>
            <path d={wedge(i)} fill={`hsl(${i * SLICE + 8} 85% ${i % 2 ? 58 : 50}%)`} stroke="#fff" strokeWidth="3" />
            <text x="150" y="42" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" stroke="#0006" strokeWidth="0.6" transform={`rotate(${i * SLICE + SLICE / 2} 150 150)`}>{shortLabel(iso)}</text>
          </g>)}
          <circle cx="150" cy="150" r="22" fill="#fffdf3" stroke="#28364a" strokeWidth="5" />
        </svg>
      </div>
      <p aria-live="polite" className={styles.wheelResult}>{spinning ? "Spinning..." : landed ? `The wheel chose ${longLabel(landed)}` : "Press spin."}</p>
      <div>
        <button type="button" onClick={spin} disabled={spinning}>{landed ? "Spin again" : "Spin"}</button>
        <button type="button" onClick={accept} disabled={!landed || spinning}>Use this date</button>
        <button type="button" onClick={close} disabled={spinning}>Cancel</button>
      </div>
    </dialog>
  </>;
}
