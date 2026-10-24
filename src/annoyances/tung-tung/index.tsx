"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Annoyance, AnnoyanceProps } from "../types";
import styles from "./styles.module.css";

const MASCOT_WIDTH = 144;
const MASCOT_HEIGHT = 216;
const EDGE_GUTTER = 18;
const DISRUPT_EVERY = 3;

const REMARKS = [
  "Tung tung… not that one.",
  "That button looked load-bearing.",
  "I live here now.",
  "Great click. Would be a shame if—",
  "Tung Tung says: not yet.",
];

const ROUTE = [
  [0.08, 0.18],
  [0.74, 0.12],
  [0.58, 0.68],
  [0.18, 0.62],
  [0.42, 0.36],
] as const;

type Position = { x: number; y: number };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function TungTung({ dismiss }: AnnoyanceProps) {
  const pathname = usePathname();
  const [position, setPosition] = useState<Position>({ x: 42, y: 132 });
  const [remark, setRemark] = useState(REMARKS[0]);
  const [blocking, setBlocking] = useState(false);
  const routeStep = useRef(0);
  const eligibleClicks = useRef(0);
  const releaseTimer = useRef<number | null>(null);

  const moveAlongRoute = useCallback(() => {
    if (typeof window === "undefined") return;
    const [xRatio, yRatio] = ROUTE[routeStep.current % ROUTE.length];
    routeStep.current += 1;
    const maxX = Math.max(EDGE_GUTTER, window.innerWidth - MASCOT_WIDTH - EDGE_GUTTER);
    const maxY = Math.max(EDGE_GUTTER, window.innerHeight - MASCOT_HEIGHT - EDGE_GUTTER);
    setPosition({
      x: EDGE_GUTTER + xRatio * (maxX - EDGE_GUTTER),
      y: EDGE_GUTTER + yRatio * (maxY - EDGE_GUTTER),
    });
  }, []);

  useEffect(() => {
    if (pathname === "/") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setPosition({
        x: Math.max(EDGE_GUTTER, window.innerWidth - MASCOT_WIDTH - EDGE_GUTTER),
        y: Math.max(EDGE_GUTTER, window.innerHeight - MASCOT_HEIGHT - EDGE_GUTTER),
      });
      return;
    }

    moveAlongRoute();
    const interval = window.setInterval(moveAlongRoute, 1900);
    return () => window.clearInterval(interval);
  }, [moveAlongRoute, pathname]);

  useEffect(() => {
    if (pathname === "/") return;
    eligibleClicks.current = 0;

    function interruptClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-tung-tung-ignore]")) return;

      const control = target.closest<HTMLElement>("button, a, input[type='submit'], [role='button']");
      if (!control || control.hasAttribute("disabled") || control.getAttribute("aria-disabled") === "true") return;

      eligibleClicks.current += 1;
      if (eligibleClicks.current % DISRUPT_EVERY !== 0) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = control.getBoundingClientRect();
      const x = clamp(
        rect.left + rect.width / 2 - MASCOT_WIDTH / 2,
        EDGE_GUTTER,
        Math.max(EDGE_GUTTER, window.innerWidth - MASCOT_WIDTH - EDGE_GUTTER),
      );
      const y = clamp(
        rect.top + rect.height / 2 - MASCOT_HEIGHT * 0.68,
        EDGE_GUTTER,
        Math.max(EDGE_GUTTER, window.innerHeight - MASCOT_HEIGHT - EDGE_GUTTER),
      );

      setPosition({ x, y });
      setRemark(REMARKS[eligibleClicks.current % REMARKS.length]);
      setBlocking(true);

      if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
      releaseTimer.current = window.setTimeout(() => setBlocking(false), 1250);
    }

    document.addEventListener("click", interruptClick, true);
    return () => document.removeEventListener("click", interruptClick, true);
  }, [pathname]);

  useEffect(() => () => {
    if (releaseTimer.current) window.clearTimeout(releaseTimer.current);
  }, []);

  if (pathname === "/") return null;

  return (
    <div className={styles.stage} data-tung-tung-ignore>
      <div
        className={`${styles.mascot} ${blocking ? styles.blocking : ""}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      >
        <div className={styles.bubble} aria-hidden={!blocking}>
          {blocking ? remark : "tung tung tung…"}
        </div>
        <button
          type="button"
          className={styles.dismiss}
          onClick={dismiss}
          aria-label="Shoo Tung Tung away until the next page"
        >
          shoo
        </button>
        <Image
          className={styles.image}
          src="/mascot/tung-tung.webp"
          alt=""
          width={1024}
          height={1536}
        />
      </div>
      <p className={styles.live} aria-live="polite">
        {blocking ? `${remark} Tung Tung blocked that control.` : ""}
      </p>
    </div>
  );
}

const tungTung: Annoyance = {
  id: "tung-tung",
  owner: "njoseph2",
  Component: TungTung,
};

export default tungTung;