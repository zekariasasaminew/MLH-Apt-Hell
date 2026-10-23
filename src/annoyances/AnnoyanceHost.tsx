"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { usePain } from "@/pain/PainProvider";
import { annoyances } from "./registry";
import { isActive } from "./types";

export function AnnoyanceHost() {
  const pathname = usePathname();
  const { pain, ready, bump } = usePain();
  const [dismissed, setDismissed] = useState<{ pathname: string; ids: string[] }>({ pathname, ids: [] });

  if (!ready) return null;

  const dismissedHere = dismissed.pathname === pathname ? dismissed.ids : [];
  const active = annoyances.filter(
    (annoyance) => !dismissedHere.includes(annoyance.id) && isActive(annoyance, pain, pathname),
  );

  return active.map(({ id, Component }) => (
    <Component
      key={id}
      pain={pain}
      bump={bump}
      dismiss={() => setDismissed({ pathname, ids: [...dismissedHere, id] })}
    />
  ));
}
