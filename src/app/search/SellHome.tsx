"use client";

import Link from "next/link";
import { useState } from "react";
import { listings } from "@/data/listings";
import { money, salePrice } from "./market";
import styles from "./page.module.css";

export function SellHome() {
  const [id, setId] = useState(listings[0].id);
  const [stage, setStage] = useState<"estimate" | "review" | "complete">("estimate");
  const [acknowledgement, setAcknowledgement] = useState("");
  const [agreed, setAgreed] = useState(false);
  const home = listings.find(home => home.id === id)!;
  const price = salePrice(home);
  const fees = Math.round(price * .067);
  return <section className={styles.seller}>
    <p className={styles.eyebrow}>The Hellow seller experience</p><h1>Sell your home. Keep the paperwork.</h1><p>Choose a fictional property. No real address, contact information, or listing is submitted.</p>
    {stage === "complete" ? <div role="status"><h2>Your pretend listing is ready</h2><p>{home.street}, {home.city}, {home.state}</p><p>Imaginary asking price: <strong>{money(price)}</strong></p><p>Imaginary proceeds after fictional fees: <strong>{money(price - fees)}</strong></p><p>Our imaginary agent will be in touch as soon as they finish their imaginary lunch. Nothing was published.</p><button onClick={() => { setStage("estimate"); setAcknowledgement(""); setAgreed(false); }}>Start another pretend sale</button><Link href="/search?type=buy">Browse homes instead</Link></div> : <>
      <label className={styles.field}>Select a demo property<select value={id} disabled={stage === "review"} onChange={e => setId(e.target.value)}>{listings.map(home => <option key={home.id} value={home.id}>{home.street}, {home.city}</option>)}</select></label>
      <div className={styles.quote}><span>Hellowstimate (entirely made up)</span><strong>{money(price)}</strong><p>{home.beds} beds · {home.baths} baths · {home.sqft.toLocaleString("en-US")} sqft</p><p>Administrative vibes fee: {money(fees)}</p></div>
      {stage === "estimate" ? <button className={styles.primary} onClick={() => setStage("review")}>Get my unnecessarily detailed selling plan</button> : <form onSubmit={e => { e.preventDefault(); if (agreed && acknowledgement === "I accept imaginary fees") setStage("complete"); }}><h2>Department of Unnecessary Confirmations</h2><p>To approve the fictional {money(fees)} fee, type <strong>I accept imaginary fees</strong>.</p><label className={styles.field}>Fee acknowledgement<input value={acknowledgement} autoComplete="off" onChange={e => setAcknowledgement(e.target.value)} /></label><label className={styles.check}><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} /> I certify that this house has at least one house-shaped quality.</label><button className={styles.primary} disabled={!agreed || acknowledgement !== "I accept imaginary fees"}>Confirm pretend listing</button><button type="button" onClick={() => { setStage("estimate"); setAcknowledgement(""); setAgreed(false); }}>Back to property selection</button></form>}
    </>}
  </section>;
}
