"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type Appointment = { date: string; minutes: number };
const wrap = (n: number) => ((Math.round(n) % 1440) + 1440) % 1440;
function timeLabel(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
export function TourScheduler({ listingId, street }: { listingId: string; street: string }) {
  const [minutes, setMinutes] = useState(600);
  const [date, setDate] = useState("");
  const [review, setReview] = useState(false);
  const [saved, setSaved] = useState<Appointment | null>(null);
  const [storageWarning, setStorageWarning] = useState("");
  const gesture = useRef<{ hand: string; angle: number; minutes: number } | null>(null);
  const key = `hellow_tour_${listingId}`;
  useEffect(() => {
    try {
      const cookie = document.cookie.split("; ").find(c => c.startsWith(`${key}=`));
      if (cookie) {
        const value = JSON.parse(decodeURIComponent(cookie.slice(key.length + 1)));
        if (/^\d{4}-\d{2}-\d{2}$/.test(value.date) && Number.isInteger(value.minutes) && value.minutes >= 0 && value.minutes < 1440) setSaved(value);
      }
    } catch { /* Invalid cookies do not block scheduling. */ }
  }, [key]);
  function angle(svg: SVGSVGElement, x: number, y: number) {
    const rect = svg.getBoundingClientRect();
    return Math.atan2(y - rect.top - rect.height / 2, x - rect.left - rect.width / 2) * 180 / Math.PI;
  }
  function save() {
    const appointment = { date, minutes };
    setSaved(appointment); setReview(false);
    try { document.cookie = `${key}=${encodeURIComponent(JSON.stringify(appointment))}; path=/; max-age=2592000; SameSite=Lax`; }
    catch { setStorageWarning("Cookie storage is unavailable; this confirmation will last until you leave the page."); }
  }
  if (saved) return <section className={styles.panel} aria-live="polite"><h2>Your simulated tour is requested</h2><p>{street}</p><p><time dateTime={`${saved.date}T${timeLabel(saved.minutes)}`}>{saved.date} at {timeLabel(saved.minutes)} (property local time)</time></p><p>Our imaginary agent has penciled you in using imaginary pencils. No booking was sent.</p><p>{storageWarning}</p><button onClick={() => { setDate(saved.date); setMinutes(saved.minutes); setSaved(null); }}>Schedule another pretend tour</button></section>;
  return <section className={styles.panel}><h2>Request a tour</h2><p>Choose a date and property-local time. This is a simulation.</p>
    <label>Tour date <input type="date" required value={date} onChange={e => { setDate(e.target.value); setReview(false); }} /></label>
    <><p>Rotate either hand. The minute hand also moves the hour hand. Apparently clocks still exist.</p>
      <svg className={styles.clock} viewBox="0 0 300 300" role="group" aria-label="Analog appointment clock" onPointerDown={e => {
        const hand = (e.target as Element).getAttribute("data-hand");
        if (!hand) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        gesture.current = { hand, angle: angle(e.currentTarget, e.clientX, e.clientY), minutes };
      }} onPointerMove={e => {
        const g = gesture.current; if (!g) return;
        const next = angle(e.currentTarget, e.clientX, e.clientY);
        const delta = ((next - g.angle + 540) % 360) - 180;
        g.angle = next; g.minutes += delta * (g.hand === "hour" ? 2 : 1 / 6);
        setMinutes(wrap(g.minutes)); setReview(false);
      }} onPointerUp={() => { gesture.current = null; }} onPointerCancel={() => { gesture.current = null; }}>
        <circle cx="150" cy="150" r="145" fill="#fffdf3" stroke="#28364a" strokeWidth="8" />
        {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <text key={i} x={150 + Math.sin(a) * 118} y={157 - Math.cos(a) * 118} textAnchor="middle" fontSize="20">{i || 12}</text>; })}
        <line data-hand="hour" x1="150" y1="150" x2="150" y2="76" stroke="#28364a" strokeWidth="16" strokeLinecap="round" transform={`rotate(${minutes / 2} 150 150)`} />
        <line data-hand="minute" x1="150" y1="150" x2="150" y2="40" stroke="#1261d3" strokeWidth="12" strokeLinecap="round" transform={`rotate(${minutes * 6} 150 150)`} />
        <circle cx="150" cy="150" r="10" fill="#ac5c22" pointerEvents="none" />
      </svg>
      <div>{[-60, -1, 1, 60].map(delta => <button key={delta} onClick={() => { setMinutes(m => wrap(m + delta)); setReview(false); }}>{delta > 0 ? "+" : ""}{delta} {Math.abs(delta) === 60 ? "min (hour hand)" : "min"}</button>)}<button onClick={() => { setMinutes(m => wrap(m + 720)); setReview(false); }}>Switch AM / PM</button></div>
    </>
    <p aria-live="polite">Selected: {date || "Choose a date"} at {timeLabel(minutes)} ({minutes < 720 ? "AM" : "PM"})</p>
    {review ? <><p>Confirm that you have checked your calendar, your other calendar, and the calendar you ignore.</p><button onClick={save}>Confirm simulated tour for {date} at {timeLabel(minutes)}</button><button onClick={() => setReview(false)}>Back to clock</button></> : <button disabled={!date} onClick={() => setReview(true)}>Request simulated tour</button>}
  </section>;
}
