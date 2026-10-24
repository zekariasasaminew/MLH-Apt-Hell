"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/data/listings";
import { money, salePrice } from "./market";
import styles from "./page.module.css";

export function BuyHomes({ homes }: { homes: Listing[] }) {
  const [selected, setSelected] = useState<Listing | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);
  return <>
    <div className={styles.grid}>{homes.map(home => <article key={home.id} className={styles.card}>
      <div className={styles.photo}><Image src={home.photo} alt={home.street} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" /><span>Fictional sale</span></div>
      <div className={styles.cardBody}><h2>{money(salePrice(home))}</h2><p>{home.beds} beds · {home.baths} baths · {home.sqft.toLocaleString("en-US")} sqft</p><p>{home.street}<br />{home.city}, {home.state} {home.zip}</p><button onClick={() => { setAcknowledged(false); setSelected(home); }}>View home and emotional costs</button></div>
    </article>)}</div>
    <dialog ref={dialog} className={styles.dialog} onClose={() => setSelected(null)}>
      {selected && <><form method="dialog"><button className={styles.close} aria-label="Close home details">×</button></form><h2>{selected.street}</h2><p>{selected.city}, {selected.state}</p><h3>{money(salePrice(selected))}</h3><p>{selected.beds} beds · {selected.baths} baths · {selected.sqft.toLocaleString("en-US")} sqft</p><p>Imaginary closing fee: {money(Math.round(salePrice(selected) * .067))}. Optimism sold separately.</p><label className={styles.check}><input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} /> I understand the kitchen may be emotionally load-bearing.</label>{acknowledged ? <Link className={styles.primary} href={`/apply?listing=${selected.id}&intent=buy`}>Start a simulated application</Link> : <p>Approve the completely unnecessary disclosure to continue.</p>}<p className={styles.note}>This is a fictional purchase scenario based on a demo rental. No home is actually for sale.</p></>}
    </dialog>
  </>;
}
