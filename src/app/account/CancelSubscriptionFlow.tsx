"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Step = "entry" | "reason" | "riddles" | "cats" | "catch" | "confirm" | "success";

const RIDDLES = [
  {
    prompt: "I am greater than 66, less than 68, and somehow present in every form. What am I?",
    answers: ["67", "sixty seven", "sixtyseven"],
    hint: "The sacred number is having a main-character moment.",
  },
  {
    prompt: "I am painted over but still conduct electricity. What am I?",
    answers: ["outlet", "electrical outlet", "socket"],
    hint: "The landlord special lives in the wall.",
  },
  {
    prompt: "We wear one trench coat, raid one trash can, and share one account. Who are we?",
    answers: ["raccoons", "three raccoons", "raccoons in a trench coat"],
    hint: "There are three of them and they wash their little hands.",
  },
];

const CATS = ["Mortgage", "Escrow", "Deposit", "HOA", "Kevin"];
const DODGE_LABELS = [
  "Cancel Subscription",
  "Wait, You Found Me?",
  "Surely You Have Better Things to Do",
  "Fine. Cancel It.",
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

export function CancelSubscriptionFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("entry");
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [seatedCats, setSeatedCats] = useState<string[]>([]);
  const [dodges, setDodges] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [restored, setRestored] = useState(false);
  const confirmation = useMemo(() => "EVICT-006767", []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hellow_cancel_draft");
      if (stored) {
        const draft = JSON.parse(stored) as { step?: Step; riddleIndex?: number; attempts?: number; seatedCats?: string[]; dodges?: number };
        if (draft.step) setStep(draft.step);
        if (typeof draft.riddleIndex === "number") setRiddleIndex(draft.riddleIndex);
        if (typeof draft.attempts === "number") setAttempts(draft.attempts);
        if (Array.isArray(draft.seatedCats)) setSeatedCats(draft.seatedCats);
        if (typeof draft.dodges === "number") setDodges(draft.dodges);
      }
    } catch {
      localStorage.removeItem("hellow_cancel_draft");
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    localStorage.setItem("hellow_cancel_draft", JSON.stringify({ step, riddleIndex, attempts, seatedCats, dodges }));
  }, [step, riddleIndex, attempts, seatedCats, dodges, restored]);

  useEffect(() => {
    if (step !== "cats") return;
    const assist = setTimeout(() => setSeatedCats(CATS.slice(0, 3)), 25000);
    const advance = setTimeout(() => setStep("catch"), 28000);
    return () => { clearTimeout(assist); clearTimeout(advance); };
  }, [step]);

  function submitRiddle() {
    const riddle = RIDDLES[riddleIndex];
    const correct = riddle.answers.some((candidate) => normalize(candidate) === normalize(answer));
    if (correct || attempts >= 2) {
      if (riddleIndex === RIDDLES.length - 1) setStep("cats");
      else setRiddleIndex((value) => value + 1);
      setAnswer("");
      setAttempts(0);
      setMessage(correct ? "The council reluctantly accepts this." : "The Goblin Takes Pity on You.");
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setMessage(nextAttempts === 1 ? riddle.hint : `Answer revealed: ${riddle.answers[0]}`);
  }

  function seatCat(cat: string) {
    setSeatedCats((current) => current.includes(cat) ? current : [...current, cat]);
  }

  function dodge() {
    if (reducedMotion || dodges >= 3) return;
    setDodges((value) => Math.min(3, value + 1));
  }

  if (step === "success") {
    return (
      <div className={styles.cancelModal} role="dialog" aria-modal="true" aria-labelledby="cancel-success-title">
        <div className={styles.evictedCard}>
          <span className={styles.bigGlyph} aria-hidden="true">🐈‍⬛🎉</span>
          <p className={styles.eyebrow}>ACHIEVEMENT: HERDED CATS, SAVED MONEY</p>
          <h2 id="cancel-success-title">YOUR SUBSCRIPTION HAS BEEN SUCCESSFULLY EVICTED</h2>
          <dl className={styles.receipt}>
            <div><dt>Effective</dt><dd>Immediately-ish</dd></div>
            <div><dt>Next charge</dt><dd>None</dd></div>
            <div><dt>Reference</dt><dd>{confirmation}</dd></div>
            <div><dt>Brainrot survived</dt><dd>67%</dd></div>
          </dl>
          <button className={styles.primaryButton} onClick={onClose}>Return to Account</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cancelModal} role="dialog" aria-modal="true" aria-labelledby="cancel-title">
      <div className={styles.cancelCard}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close cancellation flow">×</button>
        <p className={styles.eyebrow}>PREMIUM REGRET RETENTION DEPARTMENT</p>
        <h2 id="cancel-title">SO YOU HAVE CHOSEN FINANCIAL RESPONSIBILITY</h2>

        {step === "entry" && (
          <div className={styles.stack}>
            <p>The Account Council requires proof that you possess sufficient brainrot resistance.</p>
            <button className={styles.dangerButton} onClick={() => setStep("reason")}>Begin the Cancellation Ritual</button>
            <button className={styles.textButton} onClick={() => setStep("confirm")}>Skip the nonsense and cancel</button>
          </div>
        )}

        {step === "reason" && (
          <div className={styles.stack}>
            <label htmlFor="cancel-reason">Why are you abandoning premium beige?</label>
            <select id="cancel-reason" defaultValue="" onChange={(event) => event.target.value && setStep("riddles")}>
              <option value="" disabled>Select your betrayal</option>
              <option>The mascot knows too much</option>
              <option>I discovered houses cost money</option>
              <option>Three raccoons advised me to cancel</option>
              <option>The subscription failed the vibe check</option>
            </select>
          </div>
        )}

        {step === "riddles" && (
          <div className={styles.stack}>
            <p className={styles.stepCounter}>Riddle {riddleIndex + 1} of {RIDDLES.length}</p>
            <p className={styles.riddle}>{RIDDLES[riddleIndex].prompt}</p>
            <label htmlFor="riddle-answer">Your suspicious answer</label>
            <input id="riddle-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitRiddle()} />
            {message && <p className={styles.feedback} role="status">{message}</p>}
            <button className={styles.primaryButton} onClick={submitRiddle}>Submit to the Riddle HOA</button>
            <button className={styles.textButton} onClick={() => setStep("cats")}>Skip Brainrot Trial</button>
          </div>
        )}

        {step === "cats" && (
          <div className={styles.stack}>
            <p>Herd three cats onto the cancellation button. Click a cat and whisper pspspsps.</p>
            <div className={styles.catArena} aria-label="Cat herding arena">
              {CATS.map((cat, index) => (
                <button
                  key={cat}
                  className={`${styles.cat} ${seatedCats.includes(cat) ? styles.catSeated : ""} ${cat === "Kevin" ? styles.kevin : ""}`}
                  style={{ "--cat-x": `${8 + (index * 19) % 78}%`, "--cat-y": `${18 + (index * 23) % 55}%` } as React.CSSProperties}
                  onClick={() => seatCat(cat)}
                  aria-pressed={seatedCats.includes(cat)}
                >
                  <span aria-hidden="true">{cat === "Kevin" ? "🙀" : "🐈"}</span>
                  <span>{cat}</span>
                </button>
              ))}
              <div className={styles.catTarget}>CANCEL<br />BUTTON<br />{seatedCats.length}/3 cats</div>
            </div>
            <button className={styles.primaryButton} disabled={seatedCats.length < 3} onClick={() => setStep("catch")}>
              {seatedCats.length < 3 ? "Pspspsps… more cats required" : "The cats approve. Continue."}
            </button>
            <button className={styles.textButton} onClick={() => { setSeatedCats(CATS.slice(0, 3)); setStep("catch"); }}>Skip Cat Bureaucracy</button>
          </div>
        )}

        {step === "catch" && (
          <div className={styles.catchZone}>
            <p>Escape attempts remaining: {3 - dodges}</p>
            <p className={styles.feedback}>THE CANCEL BUTTON HAS BEEN LOCATED</p>
            <button
              className={styles.runawayCancel}
              style={{ transform: `translate(${[0, 115, -90, 0][dodges]}px, ${[0, 45, 85, 0][dodges]}px)` }}
              onPointerEnter={dodge}
              onFocus={() => setDodges(3)}
              onClick={() => dodges >= 3 || reducedMotion ? setStep("confirm") : dodge()}
            >
              {DODGE_LABELS[dodges]}
            </button>
            <button className={styles.textButton} onClick={() => setStep("confirm")}>Lock the button in place</button>
          </div>
        )}

        {step === "confirm" && (
          <div className={styles.stack}>
            <p className={styles.feedback}>THE CANCEL BUTTON HAS BEEN CONTAINED</p>
            <dl className={styles.receipt}>
              <div><dt>Plan</dt><dd>Hellow Premium Regret</dd></div>
              <div><dt>Cancellation date</dt><dd>Today</dd></div>
              <div><dt>Next charge</dt><dd>None</dd></div>
              <div><dt>Data deletion</dt><dd>Not included</dd></div>
            </dl>
            <button className={styles.dangerButton} onClick={() => setStep("success")}>Confirm Cancellation</button>
            <button className={styles.secondaryButton} onClick={onClose}>Keep Subscription</button>
          </div>
        )}
      </div>
    </div>
  );
}

