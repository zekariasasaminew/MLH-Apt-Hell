"use client";

import dynamic from "next/dynamic";

/** Leaflet touches `window`, so the map only ever loads in the browser. */
export const RentMapLoader = dynamic(() => import("./RentMap"), {
  ssr: false,
  loading: () => <div style={{ height: "100%", background: "#e6efe2" }} aria-label="Loading map" />,
});
