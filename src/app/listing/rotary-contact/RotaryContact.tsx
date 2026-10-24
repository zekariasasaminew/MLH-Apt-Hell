"use client";

import { useRef, useState } from "react";
import { useCaptcha } from "@/captcha/CaptchaProvider";
import styles from "./styles.module.css";

export function RotaryContact() {
  const { requireCaptcha } = useCaptcha();
  const [number, setNumber] = useState("");
  const [muted, setMuted] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [returning, setReturning] = useState(false);
  const [message, setMessage] = useState("");
  const gesture = useRef<{ digit: string; previous: number; total: number; target: number } | null>(null);
  const dial = useRef<HTMLDivElement>(null);
  const audio = useRef<AudioContext | null>(null);
  function angle(x: number, y: number) {
    const rect = dial.current!.getBoundingClientRect();
    return Math.atan2(y - rect.top - rect.height / 2, x - rect.left - rect.width / 2) * 180 / Math.PI;
  }
  function enter(digit: string) {
    setNumber(n => n.length < 10 ? n + digit : n);
    setMessage("");
    if (!muted) {
      const ctx = audio.current ??= new AudioContext();
      void ctx.resume();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = 480;
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + 0.12);
    }
  }
  return <section className={styles.panel}>
    <h2>Contact the agent</h2><p>Simulated request. Use an imaginary 10-digit number; it stays on this page.</p>
    <>
      <p>Drag a numbered hole clockwise to the brass stop, then release. Keyboard: focus a digit and press Enter.</p>
      <button type="button" onClick={() => setMuted(m => !m)}>Sound: {muted ? "muted" : "on"}</button>
      <div ref={dial} className={styles.phone}>
        <div className={`${styles.ring} ${returning ? styles.returning : ""}`} style={{ transform: `rotate(${rotation}deg)` }} onTransitionEnd={() => setReturning(false)}>
          {"1234567890".split("").map((digit, index) => {
            const degrees = 35 + index * 27;
            const radians = degrees * Math.PI / 180;
            return <button key={digit} type="button" aria-label={`Dial ${digit}`} className={styles.hole} style={{ left: 115 + Math.sin(radians) * 96, top: 115 - Math.cos(radians) * 96 }} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enter(digit); } }} onPointerDown={e => { if (number.length === 10 || returning) return; e.currentTarget.setPointerCapture(e.pointerId); gesture.current = { digit, previous: angle(e.clientX, e.clientY), total: 0, target: 350 - degrees }; }} onPointerMove={e => {
              const current = gesture.current;
              if (!current) return;
              const next = angle(e.clientX, e.clientY);
              const delta = ((next - current.previous + 540) % 360) - 180;
              current.previous = next;
              current.total = Math.max(0, Math.min(current.target, current.total + delta));
              setRotation(current.total);
            }} onPointerUp={() => { const g = gesture.current; if (!g) return; if (g.total >= g.target - 8) enter(g.digit); else setMessage("The operator requests a more committed rotation."); gesture.current = null; setReturning(true); setRotation(0); setTimeout(() => setReturning(false), 500); }} onPointerCancel={() => { gesture.current = null; setRotation(0); }}>{digit}</button>;
          })}
          <span className={styles.center}>HELLOW<br />OPERATOR</span>
        </div><span className={styles.stop}>▰</span>
      </div>
      <output aria-live="polite">{number || "No digits dialed"} ({number.length}/10)</output>
      <button type="button" onClick={() => { setNumber(""); setMessage("The operator erased the entire number. Please redial."); }}>Ask operator to erase mistakes (all digits)</button>
    </>
    <button type="button" disabled={number.length !== 10} onClick={async () => { if (await requireCaptcha("contact-agent")) setMessage("Request simulated! Our agent will call you back sometime between yesterday and the heat death of the universe."); }}>Request a pretend callback</button>
    <p role="status">{message}</p>
  </section>;
}
