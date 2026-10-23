import type { ComponentType } from "react";

export type AnnoyanceProps = {
  /** Hide this annoyance until the next page view. */
  dismiss: () => void;
};

export type Annoyance = {
  /** Unique kebab-case id, same as the annoyance's folder name. */
  id: string;
  /** GitHub handle of whoever owns it. */
  owner: string;
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
