"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Listing } from "@/data/listings";
import styles from "./styles.module.css";

function ScratchPhoto({ listing, zoom }: { listing: Listing; zoom: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const [percent, setPercent] = useState(0);
  const revealed = percent >= 45;
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    const gradient = ctx.createLinearGradient(0, 0, 600, 380);
    gradient.addColorStop(0, "#aaaeb3"); gradient.addColorStop(.5, "#e2e3e5"); gradient.addColorStop(1, "#93979d");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 600, 380);
    ctx.strokeStyle = "#ffffff44";
    for (let y = 0; y < 380; y += 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(600, y + 40); ctx.stroke(); }
    ctx.fillStyle = "#333"; ctx.font = "bold 24px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO VIEW YOUR FUTURE", 300, 170);
    ctx.font = "16px sans-serif"; ctx.fillText("Listing photos now require manual labor.", 300, 210);
  }, []);
  function scratch(e: PointerEvent<HTMLCanvasElement>) {
    if (!previous.current && e.type !== "pointerdown") return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const point = { x: (e.clientX - rect.left) * 600 / rect.width, y: (e.clientY - rect.top) * 380 / rect.height };
    const ctx = el.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 48; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(previous.current?.x ?? point.x, previous.current?.y ?? point.y); ctx.lineTo(point.x + .01, point.y); ctx.stroke();
    previous.current = point;
  }
  function measure() {
    previous.current = null;
    const pixels = canvas.current?.getContext("2d")?.getImageData(0, 0, 600, 380).data;
    if (!pixels) return;
    let clear = 0, samples = 0;
    for (let i = 3; i < pixels.length; i += 64) { samples++; if (pixels[i] < 128) clear++; }
    setPercent(Math.round(clear / samples * 100));
  }
  return <>
    <div className={styles.photo}>
      <Image src={listing.photo} alt={`${listing.street}${zoom ? ", enlarged exterior detail" : ", exterior"}`} fill sizes="(max-width: 700px) 100vw, 800px" style={{ objectFit: "cover", transform: zoom ? "scale(1.3)" : undefined }} />
      {!revealed && <canvas ref={canvas} width={600} height={380} aria-label="Scratch-off photo covering. Drag to reveal or use the reveal button." onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); scratch(e); }} onPointerMove={scratch} onPointerUp={measure} onPointerCancel={measure} />}
    </div>
    <p role="status">{revealed ? "Congratulations, you unlocked an exterior! The kitchen remains theoretical." : `${percent}% scratched. Reveal 45% to unlock the rest.`}</p>{!revealed && <button onClick={() => setPercent(100)}>Reveal photo without scratching</button>}
  </>;
}

export function ScratchGallery({ listing }: { listing: Listing }) {
  const [photo, setPhoto] = useState(0);
  const [reset, setReset] = useState(0);
  return <section className={styles.gallery} aria-label="Property photos">
    <ScratchPhoto key={`${listing.id}-${photo}-${reset}`} listing={listing} zoom={photo === 1} />
    <div className={styles.controls}>{["Exterior", "Exterior detail"].map((label, index) => <button key={label} aria-pressed={photo === index} onClick={() => setPhoto(index)}>{label}</button>)}<button onClick={() => setReset(n => n + 1)}>Reset scratch layer</button></div>
  </section>;
}
