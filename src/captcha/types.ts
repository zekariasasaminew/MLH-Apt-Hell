import type { ComponentType } from "react";

/** Extra facts a CAPTCHA may need about the action being gated. */
export type CaptchaContext = { listingId?: string };

export type CaptchaProps = {
  onPass: () => void;
  onCancel: () => void;
  context: CaptchaContext;
};

export type Captcha = {
  id: string;
  Component: ComponentType<CaptchaProps>;
};

/** A single step of a multi-step CAPTCHA. */
export type RoundProps = { onPass: () => void };
