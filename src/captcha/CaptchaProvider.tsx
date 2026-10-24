"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { actions } from "./actions";
import type { CaptchaAction } from "./actions";
import { captchas } from "./registry";
import type { Captcha, CaptchaContext } from "./types";
import styles from "./CaptchaProvider.module.css";

type RequireCaptcha = (action: CaptchaAction, context?: CaptchaContext) => Promise<boolean>;

type Active = { captcha: Captcha; context: CaptchaContext };

const Context = createContext<RequireCaptcha | null>(null);

/** Returns `requireCaptcha(action)`, which resolves true when the CAPTCHA is passed and false when cancelled. */
export function useCaptcha(): { requireCaptcha: RequireCaptcha } {
  const requireCaptcha = useContext(Context);
  if (!requireCaptcha) throw new Error("useCaptcha must be used inside CaptchaProvider");
  return useMemo(() => ({ requireCaptcha }), [requireCaptcha]);
}

export function CaptchaProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Active | null>(null);
  const resolver = useRef<((passed: boolean) => void) | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  const finish = useCallback((passed: boolean) => {
    resolver.current?.(passed);
    resolver.current = null;
    setActive(null);
    opener.current?.focus?.();
  }, []);

  const requireCaptcha = useCallback<RequireCaptcha>((action, context = {}) => {
    return new Promise<boolean>((resolve) => {
      const captcha = captchas.find((item) => item.id === actions[action]);
      if (resolver.current || !captcha) {
        resolve(!captcha);
        return;
      }
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      resolver.current = resolve;
      setActive({ captcha, context });
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    dialog.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, finish]);

  const Active = active?.captcha.Component;

  return (
    <Context.Provider value={requireCaptcha}>
      {children}
      {active && Active && (
        <div className={styles.backdrop}>
          <div ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-label="Human verification" tabIndex={-1}>
            <p className={styles.eyebrow}>Hellow Human Verification</p>
            <Active key={active.captcha.id} context={active.context} onPass={() => finish(true)} onCancel={() => finish(false)} />
            <button type="button" className={styles.cancel} onClick={() => finish(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Context.Provider>
  );
}
