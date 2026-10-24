"use client";

import { useState } from "react";
import styles from "./spin.module.css";

type SpinResult = {
  headline: string;
  description: string;
  translations: { said: string; meant: string }[];
  fees: { name: string; amount: number }[];
  hellowScore: number;
  model: string;
};

type Payload = { mimeType: string; data: string } | { sampleUrl: string };

const SAMPLE_URL = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=75";
const MAX_SIDE = 1024;

async function shrinkToJpeg(file: File): Promise<{ mimeType: string; data: string; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const preview = canvas.toDataURL("image/jpeg", 0.8);
  return { mimeType: "image/jpeg", data: preview.split(",")[1], preview };
}

export function ListingSpinner() {
  const [preview, setPreview] = useState<string | null>(null);
  const [payload, setPayload] = useState<Payload | null>(null);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [truth, setTruth] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setResult(null);
    setError(null);
    try {
      const { preview: url, mimeType, data } = await shrinkToJpeg(file);
      setPreview(url);
      setPayload({ mimeType, data });
    } catch {
      setError("Hellow could not read that file. Try a real photo of a real disappointment.");
    }
  }

  function useSample() {
    setResult(null);
    setError(null);
    setPreview(SAMPLE_URL);
    setPayload({ sampleUrl: SAMPLE_URL });
  }

  async function spin() {
    if (!payload) return;
    setBusy(true);
    setError(null);
    setTruth(false);
    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify("sampleUrl" in payload ? payload : { image: payload }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? "Spinning failed. Please pay a retry fee.");
      else setResult(json);
    } catch {
      setError("Spinning failed. Please pay a retry fee.");
    } finally {
      setBusy(false);
    }
  }

  const feeTotal = result?.fees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0) ?? 0;

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>POWERED BY GEMMA 4 (MULTIMODAL)</p>
        <h1>Hellow Listing Spinner</h1>
        <p>
          Upload a photo of your apartment. Gemma 4 looks at it, finds every flaw, and writes the listing that hides
          them. Then it reveals what the listing really means.
        </p>

        <div className={styles.drop}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Apartment to spin" className={styles.preview} />
          ) : (
            <span>No photo yet. Hellow is used to disappointment.</span>
          )}
        </div>

        <div className={styles.row}>
          <label className={styles.button}>
            Choose photo
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} hidden />
          </label>
          <button type="button" className={styles.buttonGhost} onClick={useSample}>
            Use a sample apartment
          </button>
          <button type="button" className={styles.button} onClick={spin} disabled={!payload || busy}>
            {busy ? "Gemma is squinting at your wallpaper..." : "Spin this listing"}
          </button>
        </div>
        <p className={styles.fine}>
          The photo is sent to Google&apos;s Gemini API to run Gemma 4 and is not stored by Hellow. Parody project, not
          affiliated with Zillow.
        </p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
      </section>

      {result && (
        <section className={styles.card} aria-live="polite">
          <p className={styles.eyebrow}>{truth ? "WHAT IT REALLY MEANS" : "THE LISTING"}</p>
          <h2>{result.headline}</h2>
          <p className={styles.copy}>{result.description}</p>

          <ul className={styles.translations}>
            {result.translations.map((t) => (
              <li key={t.said}>
                <b>&ldquo;{t.said}&rdquo;</b>
                {truth && <span> means: {t.meant}</span>}
              </li>
            ))}
          </ul>

          <h3>Move-in costs</h3>
          <ul className={styles.fees}>
            {result.fees.map((fee) => (
              <li key={fee.name}><span>{fee.name}</span><b>${fee.amount}</b></li>
            ))}
            <li className={styles.total}><span>Total, before rent</span><b>${feeTotal}</b></li>
          </ul>

          <p className={styles.score}>
            Hellow Score: <b>{result.hellowScore}</b>/100 {truth ? "(it was always this bad)" : ""}
          </p>
          <button type="button" className={styles.buttonGhost} onClick={() => setTruth((v) => !v)}>
            {truth ? "Back to the lies" : "Translate the realtor-speak"}
          </button>
          <p className={styles.fine}>
            {result.model === "offline-fallback" ? "Gemma was unreachable, so this is a canned spin." : `Written by ${result.model}.`}
          </p>
        </section>
      )}
    </main>
  );
}
