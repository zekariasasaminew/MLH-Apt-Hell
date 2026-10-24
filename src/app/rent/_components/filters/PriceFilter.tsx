"use client";

import { useEffect, useRef, useState } from "react";
import { applyRentFilters } from "@/filters/rent-filters";
import { listings } from "@/data/listings";
import { purchaseListings } from "@/data/property-market";
import { useMarket } from "../../_lib/MarketContext";
import slotStyles from "./PriceFilter.module.css";
import type { FilterControlProps } from "@/filters/useRentFilters";
import { FilterPopover } from "../FilterPopover";
import styles from "./filters.module.css";

const STEPS = Array.from({ length: 50 }, (_, i) => (i + 1) * 100);
const money = (value: number) => `$${value.toLocaleString("en-US")}`;

function summary({ minRent, maxRent }: FilterControlProps["filters"]) {
  if (minRent === undefined && maxRent === undefined) return "Price";
  if (minRent === undefined) return `Up to ${money(maxRent!)}`;
  if (maxRent === undefined) return `${money(minRent)}+`;
  return `${money(minRent)} - ${money(maxRent)}`;
}

/** Price popover with a plain minimum and a slot machine for the maximum. */
export function PriceFilter({ filters, setFilters }: FilterControlProps) {
  const mode = useMarket();
  const steps = mode === "buy" ? STEPS.map(n => n * 100) : STEPS;
  return (
    <FilterPopover label={summary(filters)} active={filters.minRent !== undefined || filters.maxRent !== undefined} minWidth={154}>
      <div className={styles.row}>
        <label className={styles.field}>
          Minimum
          <select
            value={filters.minRent ?? ""}
            onChange={(event) => setFilters({ minRent: event.target.value ? Number(event.target.value) : undefined })}
          >
            <option value="">No min</option>
            {steps.map((step) => (
              <option key={step} value={step}>
                {money(step)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <SlotMachine key={filters.maxRent ?? "none"} filters={filters} setFilters={setFilters} />
    </FilterPopover>
  );
}

function SlotMachine({ filters, setFilters }: FilterControlProps) {
  const mode = useMarket();
  const reelCount = mode === "buy" ? 7 : 5;
  const defaultBudget = mode === "buy" ? 350000 : 2500;
  const initial = String(Math.min(10 ** reelCount - 1, Math.round(filters.maxRent ?? defaultBudget))).padStart(reelCount, "0").split("").map(Number);
  const [digits, setDigits] = useState(initial);
  const [locked, setLocked] = useState<boolean[]>(Array(reelCount).fill(false));
  const [spinning, setSpinning] = useState<number[]>([]);
  const [muted, setMuted] = useState(true);
  const [feedback, setFeedback] = useState("Pull the lever. Your budget is now a game of chance.");
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const running = useRef(false);
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => () => { timers.current.forEach(clearInterval); void audio.current?.close(); }, []);
  function spin(only?: number) {
    if (running.current) return;
    const indices = digits.map((_, i) => i).filter(i => !locked[i] && (only === undefined || i === only));
    if (!indices.length) { setFeedback("All reels locked. The house always wins, but you may confirm."); return; }
    running.current = true; setSpinning(indices);
    if (!muted) {
      const ctx = audio.current ??= new AudioContext(); void ctx.resume();
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "triangle"; osc.frequency.setValueAtTime(300, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + .3);
      gain.gain.setValueAtTime(.025, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .4);
      osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .4);
    }
    let ticks = 0;
    const timer = setInterval(() => {
      ticks++;
      setDigits(current => current.map((digit, i) => indices.includes(i) ? (digit + 1 + Math.floor(Math.random() * 9)) % 10 : digit));
      if (ticks >= 12) {
        clearInterval(timer); timers.current = timers.current.filter(t => t !== timer);
        running.current = false; setSpinning([]); setFeedback("The reels have spoken. Lock the good digits, retry the rest.");
      }
    }, 65);
    timers.current.push(timer);
  }
  const budget = Number(digits.join(""));
  const count = applyRentFilters(mode === "buy" ? purchaseListings : listings, { ...filters, maxRent: budget }).length;
  return <div className={slotStyles.machine} data-market={mode}>
    <h3>HELL•O•JACKPOT</h3><p>{mode === "buy" ? "Maximum purchase price · seven digits" : "Maximum monthly rent · five digits"}, zero financial advice</p>
    <div className={slotStyles.reels}>{digits.map((digit, i) => <div key={i} className={slotStyles.column}>
      <div className={`${slotStyles.window} ${spinning.includes(i) ? slotStyles.spinning : ""}`} aria-label={`Digit ${i + 1}: ${digit}`}><span>{digit}</span></div>
      <button disabled={running.current} aria-pressed={locked[i]} onClick={() => setLocked(current => current.map((lock, index) => i === index ? !lock : lock))}>{locked[i] ? "🔒" : "Lock"}</button>
      <button disabled={locked[i] || spinning.length > 0} onClick={() => spin(i)} aria-label={`Spin digit ${i + 1}`}>Spin</button>
      <button disabled={locked[i] || spinning.length > 0} onClick={() => setDigits(current => current.map((value, index) => index === i ? (value + 1) % 10 : value))} aria-label={`Advance digit ${i + 1} by one`}>+1</button>
    </div>)}<button className={slotStyles.lever} disabled={spinning.length > 0} onClick={() => spin()} aria-label="Pull the slot machine lever">🔴<br />┃<br />SPIN</button></div>
    <output aria-live="polite">Budget: ${budget.toLocaleString("en-US")}{mode === "rent" ? "/month" : ""}</output>
    <p role="status">{feedback}</p><p>{count === 0 ? "Congratulations! You can now afford absolutely nothing matching these filters." : `${count} actual {mode === "buy" ? "homes" : "rentals"} match this budget and your other filters.`}</p>
    <button disabled={spinning.length > 0} onClick={() => setFilters({ maxRent: budget })}>Confirm ${budget.toLocaleString("en-US")} maximum</button>
    <button onClick={() => { timers.current.forEach(clearInterval); timers.current = []; running.current = false; setSpinning([]); setLocked(Array(reelCount).fill(false)); setDigits(String(defaultBudget).padStart(reelCount, "0").split("").map(Number)); setFeedback("Machine reset. Your dignity is non-refundable."); }}>Reset machine</button>
    <button onClick={() => setFilters({ maxRent: undefined })}>Remove maximum</button><button onClick={() => setMuted(m => !m)}>Sound: {muted ? "muted" : "on"}</button>
    <small>Use +1 to nudge any unlocked reel to an exact budget.</small>
  </div>;
}
