"use client";

import { usePathname } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  clampPain,
  PAIN_PER_CLICK,
  PAIN_PER_PAGE_VIEW,
  readPainCookie,
  tierOf,
  type Tier,
  writePainCookie,
} from "./pain-cookie";

type PainApi = {
  /** Current pain level, 0 to 100. Always 0 during server render and until `ready`. */
  pain: number;
  tier: Tier;
  /** False until the cookie has been read on the client. Don't render pain-dependent UI before this. */
  ready: boolean;
  bump: (amount: number) => void;
  reset: () => void;
};

const PainContext = createContext<PainApi | null>(null);

/** Elements inside `[data-pain-ignore]` don't add pain when clicked (e.g. the debug meter). */
export const PAIN_IGNORE_ATTR = "data-pain-ignore";

export function PainProvider({ children }: { children: React.ReactNode }) {
  const painRef = useRef<number | null>(null);
  const [pain, setPain] = useState(0);
  const [ready, setReady] = useState(false);

  const commit = useCallback((next: number) => {
    painRef.current = next;
    writePainCookie(next);
    setPain(next);
    setReady(true);
  }, []);

  const bump = useCallback(
    (amount: number) => commit(clampPain((painRef.current ?? readPainCookie()) + amount)),
    [commit],
  );
  const reset = useCallback(() => commit(0), [commit]);

  useEffect(() => {
    if (painRef.current === null) commit(readPainCookie());
  }, [commit]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(`[${PAIN_IGNORE_ATTR}]`)) return;
      bump(PAIN_PER_CLICK);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [bump]);

  const api = useMemo(() => ({ pain, tier: tierOf(pain), ready, bump, reset }), [pain, ready, bump, reset]);

  return (
    <PainContext.Provider value={api}>
      <Suspense>
        <PageViewTracker onPageView={() => bump(PAIN_PER_PAGE_VIEW)} />
      </Suspense>
      {children}
    </PainContext.Provider>
  );
}

function PageViewTracker({ onPageView }: { onPageView: () => void }) {
  const pathname = usePathname();
  const lastCounted = useRef<string | null>(null);

  useEffect(() => {
    if (lastCounted.current === pathname) return;
    lastCounted.current = pathname;
    onPageView();
  }, [pathname, onPageView]);

  return null;
}

export function usePain(): PainApi {
  const api = useContext(PainContext);
  if (!api) throw new Error("usePain must be used inside <PainProvider>");
  return api;
}
