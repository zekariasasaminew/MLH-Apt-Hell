"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export function MortgageChallenge() {
  const [housePlaced, setHousePlaced] = useState(false);
  const [complete, setComplete] = useState(false);

  return <main className={styles.main}>
    {complete ? <section className={styles.success} aria-live="polite">
      <span aria-hidden="true">🏠💸🎉</span>
      <p className={styles.eyebrow}>MORTGAGE EMOTIONALLY APPROVED</p>
      <h1>Your imaginary mortgage is approved!</h1>
      <p>Unfortunately, you still cannot afford any of our houses. No loan application was submitted.</p>
      <Link className={styles.submit} href="/">Return to Hellow</Link>
      <button className={styles.submit} onClick={() => { setHousePlaced(false); setComplete(false); }}>Acquire another imaginary mortgage</button>
    </section> : <section className={styles.mortgageGame} aria-labelledby="mortgage-title">
      <p className={styles.eyebrow}>FINAL EMOTIONAL CLOSING</p>
      <h1 id="mortgage-title">Drag the tiny house into the oversized mortgage contract</h1>
      <p>Before we approve your imaginary mortgage, please confirm that you are emotionally prepared for homeownership.</p>
      <p>Keyboard and touch users may select the house, then approve the contract.</p>
      <div className={styles.dragZone}>
        <button type="button" draggable aria-label="Place tiny house in mortgage contract" aria-pressed={housePlaced} onDragStart={event => event.dataTransfer.setData("text/plain", "house")} onClick={() => setHousePlaced(true)} className={housePlaced ? styles.housePlaced : styles.house}>🏠<span>{housePlaced ? "Property encumbered" : "Tiny house"}</span></button>
        <div className={styles.contract} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === "house") setHousePlaced(true); }}><b>30-YEAR MORTGAGE CONTRACT</b><small>Page 1 of 67,000</small><span role="status">{housePlaced ? "🏠 ACCEPTED" : "DROP ASSET HERE"}</span></div>
      </div>
      <button className={styles.submit} disabled={!housePlaced} onClick={() => setComplete(true)}>I am emotionally prepared for homeownership</button>
    </section>}
  </main>;
}
