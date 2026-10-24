"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_ATTEMPTS = 3;
export const GIVE_UP_MESSAGE = "Fine. You're too human to verify.";
const GIVE_UP_DELAY_MS = 1600;

/** Counts failures on a round; the third failure passes the round anyway so nobody is stuck. */
export function useAttempts(onPass: () => void) {
  const [failures, setFailures] = useState(0);
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onPassRef = useRef(onPass);

  useEffect(() => {
    onPassRef.current = onPass;
  }, [onPass]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const fail = useCallback(() => {
    if (count.current >= MAX_ATTEMPTS) return;
    count.current += 1;
    setFailures(count.current);
    if (count.current >= MAX_ATTEMPTS) {
      timer.current = setTimeout(() => onPassRef.current(), GIVE_UP_DELAY_MS);
    }
  }, []);

  return { failures, gaveUp: failures >= MAX_ATTEMPTS, fail };
}
