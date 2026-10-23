/** The single map of gated action to CAPTCHA id. Call sites use the action name, never the id. */
export const actions = {} as const satisfies Record<string, string>;

export type CaptchaAction = keyof typeof actions;
