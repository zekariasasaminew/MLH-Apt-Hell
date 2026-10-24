"use client";

import { useEffect, useMemo, useState } from "react";
import { useCaptcha } from "@/captcha/CaptchaProvider";
import styles from "./page.module.css";

type Step = "entry" | "reason" | "paperwork" | "riddles" | "cats" | "hold" | "catch" | "confirm" | "success";

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
const PAPERWORK = [
  "I asked my emotional-support landlord for permission.",
  "I understand the beige will miss me personally.",
  "I have returned all seventeen imaginary key fobs.",
  "I accept that Kevin the cat may retain my forwarding address.",
  "I am cancelling during approved HOA moonlight hours.",
  "I solemnly swear this is not a vibe-based emergency.",
];
const DODGE_LABELS = [
  "Cancel Subscription",
  "Wait, You Found Me?",
  "Surely You Have Better Things to Do",
  "Absolutely Not Over Here",
  "Your Cursor Has Been Reported",
  "Fine. Cancel It. Maybe.",
  "THE BUTTON HAS TIRED",
];
const HOLD_PROGRESS = [7, 19, 46, 83, 97, 42, 88, 99, 100];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

export function CancelSubscriptionFlow({ onClose }: { onClose: () => void }) {
  const { requireCaptcha } = useCaptcha();
  const [step, setStep] = useState<Step>("entry");
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [reasonRejections, setReasonRejections] = useState(0);
  const [paperwork, setPaperwork] = useState<number[]>([]);
  const [notaryAttempts, setNotaryAttempts] = useState(0);
  const [seatedCats, setSeatedCats] = useState<string[]>([]);
  const [catPets, setCatPets] = useState<Record<string, number>>({});
  const [holdTick, setHoldTick] = useState(0);
  const [dodges, setDodges] = useState(0);
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [finalArmed, setFinalArmed] = useState(false);
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
    const assist = setTimeout(() => setSeatedCats(CATS.slice(0, 3)), 22000);
    const advance = setTimeout(() => setStep("hold"), 26000);
    return () => { clearTimeout(assist); clearTimeout(advance); };
  }, [step]);

  useEffect(() => {
    if (step !== "hold" || holdTick >= HOLD_PROGRESS.length - 1) return;
    const timer = setTimeout(() => setHoldTick((value) => value + 1), 670);
    return () => clearTimeout(timer);
  }, [step, holdTick]);

  useEffect(() => {
    if (step !== "catch" || reducedMotion || dodges >= 6) return;
    const lock = setTimeout(() => setDodges(6), 9000);
    return () => clearTimeout(lock);
  }, [step, reducedMotion, dodges]);

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
    if (seatedCats.includes(cat)) return;
    const requiredPets = cat === "Kevin" ? 3 : 2;
    const nextPets = (catPets[cat] ?? 0) + 1;
    setCatPets((current) => ({ ...current, [cat]: nextPets }));
    setMessage(nextPets >= requiredPets ? `${cat} has reluctantly joined the union.` : `${cat} detected cancellation intent and fled. Chase them.`);
    if (reducedMotion || nextPets >= requiredPets) {
      setSeatedCats((current) => [...current, cat]);
    }
  }

  function dodge() {
    if (reducedMotion || dodges >= 6) return;
    setDodges((value) => Math.min(6, value + 1));
  }

  function submitReason() {
    if (!reason) return;
    if (reasonRejections < 2) {
      const next = reasonRejections + 1;
      setReasonRejections(next);
      setReason("");
      setMessage(next === 1 ? "REJECTED: reason was too understandable. Please choose a worse one." : "REJECTED AGAIN: Retention Goblin requests additional betrayal.");
      return;
    }
    setMessage("");
    setStep("paperwork");
  }

  function notarize() {
    if (paperwork.length < PAPERWORK.length) return;
    if (notaryAttempts === 0) {
      setNotaryAttempts(1);
      setMessage("NOTARY REJECTED: your checkmarks were emotionally unsigned. Please submit the identical form again.");
      return;
    }
    setMessage("");
    setStep("riddles");
  }

  const escapeHatch = step !== "entry" && step !== "confirm" ? (
    <button className={styles.escapeHatch} onClick={() => setStep("confirm")}>
      Accessibility escape hatch: skip directly to final review
    </button>
  ) : null;

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
            <p>The Account Council requires seven forms of proof that you possess sufficient brainrot resistance.</p>
            <div className={styles.ordealPreview}>
              <b>ESTIMATED WAIT: 67 business eternities</b>
              <span>Reason tribunal → paperwork → riddles → cats → hold music → runaway button → oath</span>
            </div>
            <button className={styles.dangerButton} onClick={() => setStep("reason")}>Begin the Seven-Stage Cancellation Ritual</button>
            <button className={styles.escapeHatch} onClick={() => setStep("confirm")}>Accessibility escape hatch: go to final review</button>
          </div>
        )}

        {step === "reason" && (
          <div className={styles.stack}>
            <p className={styles.stepCounter}>STAGE 1/7 — RETENTION TRIBUNAL · REJECTIONS {reasonRejections}/2</p>
            <label htmlFor="cancel-reason">Why are you abandoning premium beige?</label>
            <select id="cancel-reason" value={reason} onChange={(event) => setReason(event.target.value)}>
              <option value="" disabled>Select your betrayal</option>
              <option>The mascot knows too much</option>
              <option>I discovered houses cost money</option>
              <option>Three raccoons advised me to cancel</option>
              <option>The subscription failed the vibe check</option>
            </select>
            {message && <p className={styles.feedback} role="status">{message}</p>}
            <button className={styles.primaryButton} disabled={!reason} onClick={submitReason}>Submit Reason to the Retention Goblin</button>
            {escapeHatch}
          </div>
        )}

        {step === "paperwork" && (
          <div className={styles.stack}>
            <p className={styles.stepCounter}>STAGE 2/7 — FORM 67-B: PRE-CANCELLATION VIBES AFFIDAVIT</p>
            <p>Check every legally meaningless statement. The notary will reject it once on principle.</p>
            <div className={styles.paperwork}>
              {PAPERWORK.map((item, index) => (
                <label key={item} className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={paperwork.includes(index)}
                    onChange={() => setPaperwork((current) => current.includes(index) ? current.filter((value) => value !== index) : [...current, index])}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {message && <p className={styles.feedback} role="status">{message}</p>}
            <button className={styles.primaryButton} disabled={paperwork.length < PAPERWORK.length} onClick={notarize}>
              {notaryAttempts ? "Resubmit the Exact Same Affidavit" : `Notarize ${paperwork.length}/${PAPERWORK.length} Statements`}
            </button>
            {escapeHatch}
          </div>
        )}

        {step === "riddles" && (
          <div className={styles.stack}>
            <p className={styles.stepCounter}>STAGE 3/7 — RIDDLE {riddleIndex + 1} OF {RIDDLES.length}</p>
            <p className={styles.riddle}>{RIDDLES[riddleIndex].prompt}</p>
            <label htmlFor="riddle-answer">Your suspicious answer</label>
            <input id="riddle-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitRiddle()} />
            {message && <p className={styles.feedback} role="status">{message}</p>}
            <button className={styles.primaryButton} onClick={submitRiddle}>Submit to the Riddle HOA</button>
            {escapeHatch}
          </div>
        )}

        {step === "cats" && (
          <div className={styles.stack}>
            <p className={styles.stepCounter}>STAGE 4/7 — FELINE RETENTION COMMITTEE</p>
            <p>Herd three cats onto the cancellation button. Each cat flees at least once. Kevin requires three separate negotiations.</p>
            <div className={styles.catArena} aria-label="Cat herding arena">
              {CATS.map((cat, index) => (
                <button
                  key={cat}
                  className={`${styles.cat} ${seatedCats.includes(cat) ? styles.catSeated : ""} ${cat === "Kevin" ? styles.kevin : ""}`}
                  style={{
                    "--cat-x": `${5 + ((index * 19) + ((catPets[cat] ?? 0) * 31)) % 76}%`,
                    "--cat-y": `${12 + ((index * 23) + ((catPets[cat] ?? 0) * 29)) % 58}%`,
                  } as React.CSSProperties}
                  onClick={() => seatCat(cat)}
                  aria-pressed={seatedCats.includes(cat)}
                >
                  <span aria-hidden="true">{cat === "Kevin" ? "🙀" : "🐈"}</span>
                  <span>{cat} · {(catPets[cat] ?? 0)}/{cat === "Kevin" ? 3 : 2}</span>
                </button>
              ))}
              <div className={styles.catTarget}>CANCEL<br />BUTTON<br />{seatedCats.length}/3 cats</div>
            </div>
            {message && <p className={styles.feedback} role="status">{message}</p>}
            <button className={styles.primaryButton} disabled={seatedCats.length < 3} onClick={() => setStep("hold")}>
              {seatedCats.length < 3 ? "Pspspsps… more cats required" : "Join the Cancellation Call Queue"}
            </button>
            {escapeHatch}
          </div>
        )}

        {step === "hold" && (
          <div className={styles.stack}>
            <p className={styles.stepCounter}>STAGE 5/7 — PRIORITY CANCELLATION HOTLINE</p>
            <div className={styles.holdMusic}>
              <span aria-hidden="true">📞🎷🐀</span>
              <b>♪ YOUR CANCELLATION IS IMPORTANT TO SOMEONE ♪</b>
              <p>Estimated callers ahead of you: {67 - holdTick}</p>
              <div className={styles.holdBar} aria-label={`Hold queue ${HOLD_PROGRESS[holdTick]} percent`}>
                <span style={{ width: `${HOLD_PROGRESS[holdTick]}%` }} />
              </div>
              <strong>{HOLD_PROGRESS[holdTick]}%</strong>
              {holdTick === 5 && <em>Connection lost. Reconnecting to the same hold music…</em>}
            </div>
            <button className={styles.primaryButton} disabled={holdTick < HOLD_PROGRESS.length - 1} onClick={() => setStep("catch")}>
              {holdTick < HOLD_PROGRESS.length - 1 ? "Please continue holding against your will" : "A Button Representative Is Available"}
            </button>
            {escapeHatch}
          </div>
        )}

        {step === "catch" && (
          <div className={styles.catchZone}>
            <p className={styles.stepCounter}>STAGE 6/7 — PHYSICAL BUTTON CONTAINMENT</p>
            <p>Escape attempts remaining: {6 - dodges}</p>
            <p className={styles.feedback}>THE CANCEL BUTTON HAS BEEN LOCATED</p>
            <button
              className={styles.runawayCancel}
              style={{ transform: `translate(${[0, 145, -125, 90, -70, 130, 0][dodges]}px, ${[0, 42, 95, 125, 35, 82, 0][dodges]}px) rotate(${[0, 4, -7, 6, -4, 8, 0][dodges]}deg)` }}
              onPointerEnter={dodge}
              onFocus={() => setDodges(6)}
              onClick={() => dodges >= 6 || reducedMotion ? setStep("confirm") : dodge()}
            >
              {DODGE_LABELS[dodges]}
            </button>
            {dodges >= 3 && <button className={styles.textButton} onClick={() => setDodges(6)}>File Form PSPS-67 to pin the button down</button>}
            {escapeHatch}
          </div>
        )}

        {step === "confirm" && (
          <div className={styles.stack}>
            <p className={styles.stepCounter}>STAGE 7/7 — THE FINAL FINAL FINAL OATH</p>
            <p className={styles.feedback}>THE CANCEL BUTTON HAS BEEN CONTAINED. LEGAL HAS REQUESTED AN OATH.</p>
            <dl className={styles.receipt}>
              <div><dt>Plan</dt><dd>Hellow Premium Regret</dd></div>
              <div><dt>Cancellation date</dt><dd>Today</dd></div>
              <div><dt>Next charge</dt><dd>None</dd></div>
              <div><dt>Data deletion</dt><dd>Not included</dd></div>
            </dl>
            <label htmlFor="cancel-oath">Type <strong>CANCEL 67</strong> using your finest landlord font</label>
            <input id="cancel-oath" value={confirmPhrase} onChange={(event) => { setConfirmPhrase(event.target.value); setFinalArmed(false); }} autoComplete="off" />
            <label className={styles.checkRow}>
              <input type="checkbox" checked={confirmChecked} onChange={(event) => { setConfirmChecked(event.target.checked); setFinalArmed(false); }} />
              <span>I understand Kevin will receive custody of my unused premium beige.</span>
            </label>
            <button
              className={styles.dangerButton}
              disabled={normalize(confirmPhrase) !== "cancel 67" || !confirmChecked}
              onClick={async () => {
                if (!finalArmed) return setFinalArmed(true);
                if (await requireCaptcha("cancel-subscription")) setStep("success");
              }}
            >
              {finalArmed ? "YES, ACTUALLY EVICT MY SUBSCRIPTION" : "Confirm Cancellation (Allegedly)"}
            </button>
            {finalArmed && <p className={styles.feedback} role="status">This is the final confirmation. We ran out of smaller finals.</p>}
            <button className={styles.secondaryButton} onClick={onClose}>Keep Subscription</button>
          </div>
        )}
      </div>
    </div>
  );
}

