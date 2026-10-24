"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCaptcha } from "@/captcha/CaptchaProvider";

/** Shows the enter-rent CAPTCHA over the page on mount; cancelling sends you home. */
export function RentCaptchaGate() {
  const router = useRouter();
  const { requireCaptcha } = useCaptcha();
  const asked = useRef(false);

  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    requireCaptcha("enter-rent").then((passed) => {
      if (!passed) router.replace("/");
    });
  }, [requireCaptcha, router]);

  return null;
}
