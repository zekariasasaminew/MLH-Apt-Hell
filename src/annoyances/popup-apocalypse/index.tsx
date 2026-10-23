"use client";

import { useEffect, useRef, useState } from "react";
import { TIERS } from "@/pain/pain-cookie";
import type { Annoyance } from "../types";
import styles from "./styles.module.css";

const KEY = "hellow_popup-apocalypse";
const ads = [
  ["Premium Hellow", "Now with 40% fewer emotional breakdowns."],
  ["Newsletter agreement", "It already subscribed you emotionally."],
  ["Extended house warranty", "Your house has been trying to reach you."],
  ["Prove you’re not a realtor", "Which of these is legally a kitchen?"],
  ["You won!", "The opportunity to view another advertisement."],
];
type Session = { elapsed: number; closed: number[]; started: boolean };

export function PopupManager() {
  const [session, setSession] = useState<Session>({ elapsed: 0, closed: [], started: false });
  const [loaded, setLoaded] = useState(false);
  const [stage, setStage] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [read, setRead] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [fake, setFake] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const trash = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (saved && Number.isFinite(saved.elapsed) && Array.isArray(saved.closed)) {
        setSession({ elapsed: Math.max(0, saved.elapsed), closed: saved.closed.filter((id: unknown) => typeof id === "number"), started: !!saved.started });
      }
    } catch { /* Storage is optional. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { sessionStorage.setItem(KEY, JSON.stringify(session)); } catch { /* In-memory fallback. */ }
  }, [loaded, session]);

  useEffect(() => {
    let previous = performance.now();
    let active = !document.hidden;
    const visibility = () => { active = !document.hidden; previous = performance.now(); };
    const start = () => setSession(s => s.started ? s : { ...s, started: true });
    const timer = setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - previous, 2000);
      previous = now;
      if (active) setSession(s => s.started && s.elapsed < 305000 ? { ...s, elapsed: s.elapsed + delta } : s);
    }, 1000);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("pointerdown", start);
    document.addEventListener("keydown", start);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("pointerdown", start);
      document.removeEventListener("keydown", start);
    };
  }, []);

  const triggered = loaded && session.elapsed >= 300000;
  useEffect(() => {
    if (!triggered) return;
    setStage(2);
    const third = setTimeout(() => setStage(3), 1200);
    const fourth = setTimeout(() => setStage(4), 2400);
    return () => { clearTimeout(third); clearTimeout(fourth); };
  }, [triggered]);

  const close = (id: number) => setSession(s => ({ ...s, closed: [...new Set([...s.closed, id])] }));
  const visible = ads.map((_, id) => id).filter(id => !session.closed.includes(id) && (id < stage || (id === 4 && session.closed.length > 0 && stage === 4))).slice(0, 4);

  return <>
    {process.env.NODE_ENV === "development" && <button data-pain-ignore className={styles.demo} onClick={() => setSession({ elapsed: 300000, closed: [], started: true })}>Demo popup apocalypse</button>}
    {triggered && visible.map(id => <aside key={id} role="region" aria-label={ads[id][0]} className={`${styles.popup} ${styles[`position${id}`]}`} style={id === 2 ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : undefined}>
      <small>Fictional sponsored interruption</small><h2>{ads[id][0]}</h2><p>{ads[id][1]}</p>
      {id === 0 && <><p>Our close button is practicing social distancing.</p><div className={styles.runway}><button aria-label="Close Premium Hellow advertisement" style={{ marginLeft: attempts < 4 ? `${(attempts % 3) * 28}%` : 0 }} onPointerEnter={e => { if (e.pointerType === "mouse") setAttempts(n => Math.min(n + 1, 4)); }} onClick={() => close(id)}>×</button></div></>}
      {id === 1 && <><div className={styles.terms} tabIndex={0} aria-label="Fictional terms, scroll to the end" onScroll={e => { const el = e.currentTarget; if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setRead(true); }}>{Array.from({ length: 30 }, (_, n) => <p key={n}>Clause {n + 1}: By closing this advertisement, you agree to receive more advertisements. Your imaginary lawyer has approved this imaginary agreement.</p>)}</div><button disabled={!read} onClick={() => close(id)}>Accept and close</button></>}
      {id === 2 && <><p>Please dispose of advertisements responsibly.</p><button className={styles.drag} onPointerDown={e => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (drag.current) setOffset({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }); }} onPointerUp={e => { const rect = trash.current?.getBoundingClientRect(); if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) close(id); drag.current = null; setOffset({ x: 0, y: 0 }); }} onPointerCancel={() => { drag.current = null; setOffset({ x: 0, y: 0 }); }}>Drag this ad to the trash</button></>}
      {id === 3 && <>{["A sink next to a bed", "A room with cooking facilities", "An optimistic closet"].map((answer, n) => <button key={answer} onClick={() => n === 1 ? close(id) : setFeedback("That’s a $400/month kitchenette surcharge.")}>{answer}</button>)}<p role="status">{feedback}</p></>}
      {id === 4 && <><div>{[0, 1, 2].map(n => <button key={n} aria-label={`Close option ${n + 1}`} onClick={() => n === 2 ? close(id) : setFake(true)}>×</button>)}</div><p role="status">{fake ? "Nice try. Third time’s the charm." : "Only one X has a closing license."}</p></>}
      <button className={styles.accessible} onClick={() => close(id)}>Accessible dismissal: close this advertisement</button>
    </aside>)}
    {triggered && visible.includes(2) && <div ref={trash} className={styles.trash} aria-label="Advertisement trash can">🗑 Drop ad here</div>}
  </>;
}

const popupApocalypse: Annoyance = { id: "popup-apocalypse", owner: "fiatbruno", minPain: TIERS.calm, Component: PopupManager };
export default popupApocalypse;
