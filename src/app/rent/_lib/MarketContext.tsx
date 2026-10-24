"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MarketMode } from "@/data/property-market";

const MarketContext = createContext<MarketMode>("rent");
export function MarketProvider({ mode, children }: { mode: MarketMode; children: ReactNode }) {
  return <MarketContext.Provider value={mode}>{children}</MarketContext.Provider>;
}
export const useMarket = () => useContext(MarketContext);
