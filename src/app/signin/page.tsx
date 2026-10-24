"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DEMO_PASSWORD, PASSWORD_RULES, validateRules } from "./password-rules";
import styles from "./page.module.css";

const STRENGTHS = ["Homeless", "Renting a cardboard box", "Studio with six roommates", "Hellow Dreamer", "Pre-approved by an imaginary bank", "Suburban homeowner", "Landlord with generational wealth", "Real Estate Mogul"];

export default function SignInPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [seconds, setSeconds] = useState(60);
  const [started, setStarted] = useState(false);
  const [expired, setExpired] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [appeals, setAppeals] = useState(0);
  const [exemptions, setExemptions] = useState(false);
  const [complete, setComplete] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  // The hackathon build is intentionally deterministic so prerenders and demos agree.
  const year = 2026;

  const activeRules = PASSWORD_RULES.slice(0, visibleCount);
  const results = useMemo(() => validateRules(password, activeRules, { year, exemptions, demoMode }), [password, activeRules, year, exemptions, demoMode]);
  const passedCount = results.filter((rule) => rule.passed).length;
  const allVisiblePassed = results.length > 0 && results.every((rule) => rule.passed);
  const allRulesPassed = visibleCount === PASSWORD_RULES.length && allVisiblePassed;
  const strengthIndex = Math.min(STRENGTHS.length - 1, Math.floor((passedCount / PASSWORD_RULES.length) * STRENGTHS.length));

  useEffect(() => {
    if (!started || expired || complete) return;
    interval.current = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setExpired(true);
          if (interval.current) clearInterval(interval.current);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [started, expired, complete]);

  useEffect(() => {
    if (!allVisiblePassed || visibleCount >= PASSWORD_RULES.length) return;
    const delay = demoMode ? 180 : 550;
    const timeout = setTimeout(() => {
      setVisibleCount((current) => Math.min(PASSWORD_RULES.length, current + (demoMode ? 5 : 2)));
    }, delay);
    return () => clearTimeout(timeout);
  }, [allVisiblePassed, visibleCount, demoMode]);

  function updatePassword(value: string) {
    setPassword(value);
    if (!started && value) setStarted(true);
  }

  function restart() {
    setPassword("");
    setVisibleCount(3);
    setSeconds(demoMode ? 120 : 60);
    setStarted(false);
    setExpired(false);
    setAppeals(0);
    setExemptions(false);
  }

  function fileAppeal() {
    const next = appeals + 1;
    setAppeals(next);
    if (next >= 3) setExemptions(true);
  }

  function loadDemoPassword() {
    setDemoMode(true);
    setExemptions(true);
    setPassword(DEMO_PASSWORD.replace("2026", String(year)));
    setVisibleCount(PASSWORD_RULES.length);
    setStarted(true);
    setSeconds(120);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (allRulesPassed && name && email) setComplete(true);
    else fileAppeal();
  }

  if (complete) {
    return (
      <>
        <SiteHeader />
        <main className={styles.successPage}>
          <span aria-hidden="true">🏠💸🎉</span>
          <p className={styles.eyebrow}>ACCOUNT EMOTIONALLY APPROVED</p>
          <h1>Congratulations! Your account has been created.</h1>
          <p>Unfortunately, you still cannot afford any of our houses.</p>
          <Link href="/" className={styles.homeLink}>Return to Hellow</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.challenge}>
          <header className={styles.header}>
            <div><p className={styles.eyebrow}>ACCOUNT CREATION / FINANCIAL ENDURANCE</p><h1>The Password Game for People Who Wanted a House</h1><p>It starts normal. That condition will not persist.</p></div>
            <div className={`${styles.timer} ${seconds <= 10 ? styles.timerDanger : ""}`}><span>{seconds}</span><small>SECONDS UNTIL<br />MORTGAGE EXPIRY</small></div>
          </header>

          <div className={styles.modeBar}>
            <label><input type="checkbox" checked={demoMode} onChange={(event) => { setDemoMode(event.target.checked); setSeconds(event.target.checked ? 120 : 60); }} /> Demo acceleration</label>
            <button type="button" onClick={loadDemoPassword}>Use HOA-issued demo password</button>
            <span>Password is game input only; it is never sent or stored.</span>
          </div>

          {expired && (
            <div className={styles.expired} role="alert"><h2>Your mortgage application expired due to excessive thinking.</h2><button onClick={restart}>Reapply for emotional financing</button></div>
          )}

          {!expired && (
            <form className={styles.gameGrid} onSubmit={submit}>
              <div className={styles.formCard}>
                <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Tenant-shaped person" /></label>
                <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="regret@example.com" /></label>
                <label>Password<textarea required autoComplete="off" spellCheck={false} value={password} onChange={(event) => updatePassword(event.target.value)} placeholder="Start typing. It gets worse." /></label>
                <div className={styles.strength}><div style={{ width: `${Math.max(4, (passedCount / PASSWORD_RULES.length) * 100)}%` }} /><p><b>{STRENGTHS[strengthIndex]}</b><span>{passedCount}/{PASSWORD_RULES.length} rules appeased</span></p></div>

                {visibleCount >= 10 && <div className={styles.sabotage}><b>📈 INFLATION ALERT</b><span>Your password has been rezoned for greater length.</span></div>}
                {visibleCount >= 16 && <div className={styles.sabotage}><b>🏘️ HOA VIOLATION</b><span>Special characters now require ornamental approval.</span></div>}
                {visibleCount >= 20 && <div className={styles.sabotage}><b>💳 CREDIT SCORE: 412</b><span>Please add more capital and less hope.</span></div>}

                {!allRulesPassed && visibleCount === PASSWORD_RULES.length && <button type="button" className={styles.appeal} onClick={fileAppeal}>File mathematical compatibility appeal ({appeals}/3)</button>}
                {exemptions && <p className={styles.exemption}>HOA exemption granted: contradictory arithmetic may now coexist.</p>}
                <button className={styles.submit} disabled={!allRulesPassed || !name || !email}>Create Account, Allegedly</button>
              </div>

              <aside className={styles.rules} aria-live="polite">
                <h2>Current deed restrictions</h2>
                {results.map((rule) => <article key={rule.id} className={rule.passed ? styles.rulePassed : styles.ruleFailed}><span aria-hidden="true">{rule.passed ? "✓" : "×"}</span><div><b>{rule.label}</b><p>{rule.explanation}</p></div><small>LEVEL {rule.level}</small></article>)}
                {visibleCount < PASSWORD_RULES.length && <div className={styles.moreRules}>🔒 {PASSWORD_RULES.length - visibleCount} additional rules are hiding behind compliance.</div>}
              </aside>
            </form>
          )}


        </section>
      </main>
    </>
  );
}

