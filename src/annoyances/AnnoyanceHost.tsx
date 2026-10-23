"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { annoyances } from "./registry";
import { matchesRoute } from "./types";

export function AnnoyanceHost() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState<{ pathname: string; ids: string[] }>({ pathname, ids: [] });

  const dismissedHere = dismissed.pathname === pathname ? dismissed.ids : [];
  const active = annoyances.filter(
    (annoyance) => !dismissedHere.includes(annoyance.id) && matchesRoute(pathname, annoyance.routes),
  );

  return active.map(({ id, Component }) => (
    <Component key={id} dismiss={() => setDismissed({ pathname, ids: [...dismissedHere, id] })} />
  ));
}
