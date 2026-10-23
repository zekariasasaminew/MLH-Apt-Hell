"use client";

import { useRef, useState } from "react";
import { cities } from "@/data/listings";
import type { FilterControlProps } from "@/filters/useRentFilters";
import { FilterPopover } from "../FilterPopover";
import styles from "./LocationFilter.module.css";

/** Location picker: a globe you have to spin to find the Quad Cities. */
export function LocationFilter(props: FilterControlProps) {
  const locationKey = `${props.filters.q ?? ""}|${props.filters.city ?? ""}`;
  const city = cities.find(city => city.slug === props.filters.city);
  return <FilterPopover label={city ? `Location: ${city.label}` : "Explore the globe"} active={!!props.filters.city || !!props.filters.q} hideApply>
    <fieldset className={styles.control}><legend>Location</legend>
      <Globe key={locationKey} {...props} />
      <p>Confirmed location: {city?.label ?? props.filters.q ?? "All cities"}</p>
    </fieldset>
  </FilterPopover>;
}

function Globe({ filters, setFilters }: FilterControlProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState(filters.city ?? "");
  const [zooms, setZooms] = useState(0);
  const [message, setMessage] = useState("Find the Quad Cities. They are somewhere on Earth.");
  const pointer = useRef<number | null>(null);
  function changeZoom(delta: number) {
    setZoom(z => Math.max(1, Math.min(2, z + delta)));
    setZooms(n => n + 1);
    if ((zooms + 1) % 3 === 0) { setRotation(r => r + 135); setMessage("Continental drift has been expedited. Please rotate back."); }
  }
  return <>
    <p>{message}</p>
    <div className={styles.globe} onPointerDown={e => { if ((e.target as Element).closest("button")) return; pointer.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (pointer.current !== null) { setRotation(r => r + (e.clientX - pointer.current!) * .7); pointer.current = e.clientX; } }} onPointerUp={() => { pointer.current = null; }} onPointerCancel={() => { pointer.current = null; }}>
      <div className={styles.world} style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}>
        <svg viewBox="0 0 360 360" aria-hidden="true"><circle cx="180" cy="180" r="178" fill="#c4e6ff" />{[70, 125, 180, 235, 290].map(y => <ellipse key={y} cx="180" cy={y} rx={Math.sqrt(180 ** 2 - (y - 180) ** 2)} ry="18" fill="none" stroke="#78abd0" />)}<ellipse cx="180" cy="180" rx="70" ry="178" fill="none" stroke="#78abd0" /><path d="M55 80 110 45 160 80 130 115 150 145 118 165 90 120Z M145 180 185 205 160 300 130 250Z M220 65 300 90 310 155 250 160 230 125 195 150 205 220 235 250 260 190" fill="#7cae78" /></svg>
        <div className={styles.inset}><strong>Quad Cities · schematic inset</strong>{cities.map(city => {
          const [lat, lon] = city.center;
          return <button type="button" key={city.slug} aria-pressed={selected === city.slug} style={{ left: `${12 + (lon + 90.58) / .17 * 65}%`, top: `${24 + (41.525 - lat) / .025 * 55}%` }} onClick={() => setSelected(city.slug)}>{city.label}</button>;
        })}</div>
      </div>
    </div>
    <div className={styles.actions}><button onClick={() => setRotation(r => r - 30)} aria-label="Rotate globe left">↶</button><button onClick={() => setRotation(r => r + 30)} aria-label="Rotate globe right">↷</button><button onClick={() => changeZoom(.25)}>Zoom +</button><button onClick={() => changeZoom(-.25)}>Zoom −</button><button onClick={() => { setRotation(0); setZoom(1); }}>Find Earth again</button></div>
    <p aria-live="polite">Selected: {cities.find(c => c.slug === selected)?.label ?? "None"}</p>
    <button disabled={!selected} onClick={() => setFilters({ city: selected, q: undefined })}>Confirm location</button><button onClick={() => setFilters({ city: undefined, q: undefined })}>All cities</button>
  </>;
}
