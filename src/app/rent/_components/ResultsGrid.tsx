"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/data/listings";
import { absurdTagsFor } from "../_effects/absurd-tags";
import { IncomeCalculatorModal } from "../_effects/IncomeCalculatorModal";
import { UrgencyBadge } from "../_effects/UrgencyBadge";
import type { RentEffects } from "../_lib/rent-pain";
import { hashString, mulberry32 } from "../_lib/seeded-random";
import { RentCard } from "./RentCard";
import styles from "./ResultsGrid.module.css";

export type CardItem = { listing: Listing; href: string };

type Props = {
  items: CardItem[];
  effects: RentEffects;
  highlightedId: string | null;
  onHover: (id: string | null) => void;
  onBump: (amount: number) => void;
};

const MAX_CREEP = 40;
const GHOST_MS = 2000;

/** Applies the per-card effects (creep, ghosts, urgency, income gate, tags) around the calm RentCard. */
export function ResultsGrid({ items, effects, highlightedId, onHover, onBump }: Props) {
  const grid = useRef<HTMLUListElement>(null);
  const clicks = useRef<Record<string, number>>({});
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const [creep, setCreep] = useState<Record<string, number>>({});
  const [ghosts, setGhosts] = useState<Record<string, boolean>>({});
  const [backOnMarket, setBackOnMarket] = useState<Record<string, number>>({});
  const [incomeFor, setIncomeFor] = useState<Listing | null>(null);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const idsKey = items.map((item) => item.listing.id).join(",");

  useEffect(() => {
    if (!effects.priceCreep || !grid.current) return;
    const wentOut = new Set<string>();
    const seen = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).dataset.listingId;
        if (!id) return;
        if (entry.isIntersecting) {
          if (wentOut.delete(id)) setCreep((state) => ({ ...state, [id]: Math.min(MAX_CREEP, (state[id] ?? 0) + 1) }));
          seen.add(id);
        } else if (seen.has(id)) {
          wentOut.add(id);
        }
      });
    });
    grid.current.querySelectorAll("[data-rent=card]").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [effects.priceCreep, idsKey]);

  const handleNavigate = (event: React.MouseEvent, id: string) => {
    if (!effects.ghostListings || id.startsWith("promoted-")) return;
    const count = (clicks.current[id] = (clicks.current[id] ?? 0) + 1);
    if (mulberry32(hashString(`${id}:${count}`))() >= 1 / 3) return;

    event.preventDefault();
    setGhosts((state) => ({ ...state, [id]: true }));
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setGhosts((state) => ({ ...state, [id]: false }));
      setBackOnMarket((state) => ({ ...state, [id]: (state[id] ?? 0) + 75 }));
    }, GHOST_MS);
    timers.current.add(timer);
  };

  return (
    <>
      <ul ref={grid} className={styles.grid}>
        {items.map(({ listing, href }, index) => {
          const promoted = listing.badge === "Promoted";
          const rent = listing.rent + 5 * (creep[listing.id] ?? 0) + (backOnMarket[listing.id] ?? 0);
          const seed = hashString(listing.id);
          const sag = Math.min(70, 6 + index * 3);

          return (
            <li
              key={listing.id}
              className={effects.gravityCards ? styles.sag : undefined}
              style={
                effects.gravityCards
                  ? ({ "--sag": `${sag}px`, "--tilt": `${(index % 2 === 0 ? 1 : -1) * ((seed % 3) + 1)}deg` } as React.CSSProperties)
                  : undefined
              }
            >
              <RentCard
                listing={listing}
                href={href}
                rent={rent}
                highlighted={highlightedId === listing.id}
                feeLabel={effects.feesOnHover && !promoted ? `+ $${effects.feeAmount + (seed % 120)} in fees` : undefined}
                extraBadges={
                  <>
                    {backOnMarket[listing.id] ? <span className={styles.backBadge}>Back on market!</span> : null}
                    {effects.urgencyBadges && !promoted && seed % 3 === 0 ? <UrgencyBadge seed={seed} /> : null}
                  </>
                }
                extraBody={
                  <>
                    {effects.incomeGate && !promoted && (
                      <div className={styles.income}>
                        <span>Income must be 40x rent ({`$${(rent * 40).toLocaleString("en-US")}`}/yr)</span>
                        {listing.applyInstantly && (
                          <button
                            type="button"
                            className={styles.applyButton}
                            onClick={() => {
                              onBump(2);
                              setIncomeFor(listing);
                            }}
                          >
                            Apply instantly
                          </button>
                        )}
                      </div>
                    )}
                    {effects.absurdTags && !promoted && (
                      <ul className={styles.tags}>
                        {absurdTagsFor(listing.id).map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                  </>
                }
                overlay={ghosts[listing.id] ? <div className={styles.ghost}>This listing is no longer available</div> : null}
                onHover={onHover}
                onNavigate={(event) => handleNavigate(event, listing.id)}
                onMenuOpen={() => onBump(1)}
              />
            </li>
          );
        })}
      </ul>
      {incomeFor && <IncomeCalculatorModal listing={incomeFor} onClose={() => setIncomeFor(null)} />}
    </>
  );
}
