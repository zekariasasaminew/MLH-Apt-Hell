"use client";

import { useEffect, useRef, useState } from "react";
import type { Annoyance } from "../types";
import styles from "./styles.module.css";

const KEY = "hellow_popup-apocalypse";
const ads = [
  { title: "Premium Hellow", text: "Now with 40% fewer emotional breakdowns.", label: "THE UPGRADE YOU DIDN’T ASK FOR", icon: "✦", tag: "MEMBERS ONLY*" },
  { title: "Newsletter agreement", text: "It already subscribed you emotionally.", label: "DEPARTMENT OF INBOX AFFAIRS", icon: "§", tag: "FORM SPAM–02" },
  { title: "Extended house warranty", text: "Your house has been trying to reach you.", label: "URGENT-ISH SYSTEM NOTICE", icon: "⚠", tag: "ACTION REQUIRED?" },
  { title: "Prove you’re not a realtor", text: "Which of these is legally a kitchen?", label: "THE VIBE CHECK BUREAU", icon: "⌂", tag: "1 QUESTION · 0 MERCY" },
  { title: "You won!", text: "The opportunity to view another advertisement.", label: "EXTREMELY OFFICIAL PRIZE CENTER", icon: "★", tag: "WINNER! (ALLEGEDLY)" },
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
    {process.env.NODE_ENV === "development" && <button className={styles.demo} onClick={() => setSession({ elapsed: 300000, closed: [], started: true })}>Demo popup apocalypse</button>}
    {triggered && visible.map(id => <aside key={id} role="region" aria-label={ads[id].title} className={`${styles.popup} ${styles[`theme${id}`]} ${styles[`position${id}`]}`} style={id === 2 ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : undefined}>
      {id === 2 && <div className={styles.windowBar} aria-hidden="true"><span>house_warranty.exe</span><span>_ □ ×</span></div>}
      <div className={styles.adIdentity}><span className={styles.adIcon} aria-hidden="true">{ads[id].icon}</span><span>{ads[id].label}</span></div>
      <span className={styles.tag}>{ads[id].tag}</span>
      <h2>{ads[id].title}</h2>
      {id === 0 && <div className={styles.metric} aria-hidden="true">40<span>%</span><small>LESS EMOTIONAL DAMAGE</small></div>}
      {id === 1 && <div className={styles.documentStamp} aria-hidden="true">LEGALLY<br />EXHAUSTING</div>}
      {id === 4 && <div className={styles.jackpot} aria-hidden="true"><span>7</span><span>7</span><span>7</span></div>}
      <p className={styles.adCopy}>{ads[id].text}</p>
      {id === 0 && <><p>Our close button is practicing social distancing.</p><div className={styles.runway}><button aria-label="Close Premium Hellow advertisement" style={{ marginLeft: attempts < 4 ? `${(attempts % 3) * 28}%` : 0 }} onPointerEnter={e => { if (e.pointerType === "mouse") setAttempts(n => Math.min(n + 1, 4)); }} onClick={() => close(id)}>×</button></div></>}
      {id === 1 && <><div className={styles.terms} tabIndex={0} aria-label="Fictional terms, scroll to the end" onScroll={e => { const el = e.currentTarget; if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setRead(true); }}>{Array.from({ length: 30 }, (_, n) => <p key={n}>Clause {n + 1}: By closing this advertisement, you agree to receive more advertisements. Your imaginary lawyer has approved this imaginary agreement.</p>)}</div><button disabled={!read} onClick={() => close(id)}>Accept and close</button></>}
      {id === 2 && <><p>Please dispose of advertisements responsibly.</p><button className={styles.drag} onPointerDown={e => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (drag.current) setOffset({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }); }} onPointerUp={e => { const rect = trash.current?.getBoundingClientRect(); if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) close(id); drag.current = null; setOffset({ x: 0, y: 0 }); }} onPointerCancel={() => { drag.current = null; setOffset({ x: 0, y: 0 }); }}>Drag this ad to the trash</button></>}
      {id === 3 && <>{["A sink next to a bed", "A room with cooking facilities", "An optimistic closet"].map((answer, n) => <button className={styles.answer} key={answer} onClick={() => n === 1 ? close(id) : setFeedback("That’s a $400/month kitchenette surcharge.")}><span aria-hidden="true">{String.fromCharCode(65 + n)}</span>{answer}</button>)}<p role="status">{feedback}</p></>}
      {id === 4 && <><div className={styles.fakeButtons}>{[0, 1, 2].map(n => <button key={n} aria-label={`Close option ${n + 1}`} onClick={() => n === 2 ? close(id) : setFake(true)}>×</button>)}</div><p role="status">{fake ? "Nice try. Third time’s the charm." : "Only one X has a closing license."}</p></>}
      <small className={styles.adDisclosure}>FICTIONAL AD · REAL INTERRUPTION</small>
      <button className={styles.accessible} onClick={() => close(id)}>Accessible dismissal: close this advertisement</button>
    </aside>)}
    {triggered && visible.includes(2) && <div ref={trash} className={styles.trash} aria-label="Advertisement trash can"><span aria-hidden="true">🗑</span><span>AD RECYCLING<br /><small>Drop nonsense here</small></span></div>}
  </>;
}

const popupApocalypse: Annoyance = { id: "popup-apocalypse", owner: "fiatbruno", Component: PopupManager };
export default popupApocalypse;
