"use client";

import Image from "next/image";
import { useState } from "react";
import type { RentalReport, SignalSeverity } from "@/ai/rental-report";
import styles from "./GemmaRealityCheck.module.css";

type ListingInput = {
  id: string;
  street: string;
  photo: string;
};

type InspectionResponse = {
  report: RentalReport;
  source: "gemma" | "demo";
  model: string;
  warning?: string;
};

const severityLabels: Record<SignalSeverity, string> = {
  low: "Worth asking",
  medium: "Look closer",
  high: "Get specifics",
};

export function GemmaRealityCheck({ listing }: { listing: ListingInput }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<InspectionResponse | null>(null);
  const [error, setError] = useState("");

  async function inspectListing() {
    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/gemma/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });
      if (!response.ok) throw new Error("The inspection desk lost this listing.");
      const payload = await response.json() as InspectionResponse;
      setResult(payload);
      setStatus("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The inspection failed unexpectedly.");
      setStatus("error");
    }
  }

  return (
    <section className={styles.shell} aria-labelledby="gemma-check-title">
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>GEMMA 4 MULTIMODAL INSPECTION</p>
          <h2 id="gemma-check-title">Rental Reality Check</h2>
          <p>
            Let Gemma compare the listing photo with the landlord&apos;s fine print and generate the questions
            everyone remembers after paying the application fee.
          </p>
        </div>
        <button className={styles.inspectButton} type="button" onClick={inspectListing} disabled={status === "loading"}>
          {status === "loading" ? <><span className={styles.spinner} /> Reading between the pixels…</> : "Inspect with Gemma 4"}
        </button>
      </div>

      {status === "idle" && (
        <div className={styles.promise}>
          <span>01</span> Photo evidence
          <span>02</span> Fine-print translation
          <span>03</span> Questions worth asking
        </div>
      )}

      {status === "error" && <p className={styles.error} role="alert">{error}</p>}

      {result && (
        <div className={styles.report} aria-live="polite">
          <header className={styles.reportHeader}>
            <div>
              <span className={result.source === "gemma" ? styles.liveBadge : styles.demoBadge}>
                {result.source === "gemma" ? "LIVE GEMMA ANALYSIS" : "DETERMINISTIC DEMO"}
              </span>
              <p>{result.report.summary}</p>
              {result.warning && <small>{result.warning}</small>}
            </div>
            <div className={styles.score} aria-label={`Hell Score ${result.report.hellScore} out of 100`}>
              <strong>{result.report.hellScore}</strong>
              <span>HELL<br />SCORE</span>
            </div>
          </header>

          <div className={styles.analysisGrid}>
            <figure className={styles.photo}>
              <Image src={listing.photo} alt={`Listing photo for ${listing.street}`} fill sizes="(max-width: 760px) 100vw, 44vw" />
              {result.report.visibleSignals.map((signal, index) => (
                <span
                  className={styles.pin}
                  style={{ left: `${signal.xPercent}%`, top: `${signal.yPercent}%` }}
                  key={`${signal.label}-${index}`}
                  title={signal.label}
                >
                  {index + 1}
                </span>
              ))}
              <figcaption>Gemma&apos;s visual pointers are prompts for inspection, not diagnoses.</figcaption>
            </figure>

            <div className={styles.signals}>
              <h3>What deserves a closer look</h3>
              {result.report.visibleSignals.map((signal, index) => (
                <article className={`${styles.signal} ${styles[`severity${signal.severity}`]}`} key={`${signal.label}-${index}`}>
                  <span>{index + 1}</span>
                  <div>
                    <p><b>{signal.label}</b><small>{severityLabels[signal.severity]} · {signal.confidence}% confidence</small></p>
                    <p>{signal.evidence}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.bottomGrid}>
            <section>
              <h3>Landlord-to-human translation</h3>
              {result.report.euphemismTranslations.map((item) => (
                <blockquote key={`${item.original}-${item.translation}`}>
                  <span>“{item.original}”</span>
                  <p>{item.translation}</p>
                </blockquote>
              ))}
            </section>
            <section>
              <h3>Ask before applying</h3>
              <ol>
                {result.report.questionsForLandlord.map((question) => <li key={question}>{question}</li>)}
              </ol>
            </section>
          </div>

          <footer className={styles.reportFooter}>
            <span>Powered by {result.model}</span>
            <button type="button" onClick={inspectListing} disabled={status === "loading"}>Run the inspection again</button>
          </footer>
        </div>
      )}
    </section>
  );
}

