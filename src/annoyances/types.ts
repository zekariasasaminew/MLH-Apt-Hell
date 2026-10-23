import type { ComponentType } from "react";

export type AnnoyanceProps = {
  pain: number;
  /** Add pain, e.g. when the user interacts with the annoyance in a way that should cost them. */
  bump: (amount: number) => void;
  /** Hide this annoyance until the next page view. */
  dismiss: () => void;
};

export type Annoyance = {
  /** Unique kebab-case id, same as the annoyance's folder name. */
  id: string;
  /** GitHub handle of whoever owns it. */
  owner: string;
  /** Shows once pain >= minPain. Use TIERS from src/pain/pain-cookie.ts. */
  minPain: number;
  /** Optional: stops showing once pain >= maxPain (so it can be replaced by something worse). */
  maxPain?: number;
  /**
   * Where it shows. "/search" matches exactly, "/listing/*" matches "/listing/" and anything below.
   * Omit to show on every page.
   */
  routes?: string[];
  Component: ComponentType<AnnoyanceProps>;
};

export function matchesRoute(pathname: string, routes: string[] | undefined): boolean {
  if (!routes) return true;
  return routes.some((route) =>
    route.endsWith("/*") ? pathname.startsWith(route.slice(0, -1)) : pathname === route,
  );
}

export function isActive(annoyance: Annoyance, pain: number, pathname: string): boolean {
  if (pain < annoyance.minPain) return false;
  if (annoyance.maxPain !== undefined && pain >= annoyance.maxPain) return false;
  return matchesRoute(pathname, annoyance.routes);
}
