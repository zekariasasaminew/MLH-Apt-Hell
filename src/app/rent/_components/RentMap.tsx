"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Listing } from "@/data/listings";
import styles from "./RentMap.module.css";

type PinState = "idle" | "hover" | "selected";

type Props = {
  items: Listing[];
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  center: [number, number];
  zoom: number;
  /** Hostile tier: tiles lose their color. */
  degraded: boolean;
  /** Hostile tier: the + and - buttons are swapped. */
  swapZoom: boolean;
  /** Annoying tier: pins slide away from the cursor. */
  shyPins: boolean;
  /** Called when the person drags the map (not for programmatic moves). */
  onUserDrag: () => void;
};

const iconCache = new Map<string, L.DivIcon>();

function pinIcon(label: string, state: PinState): L.DivIcon {
  const key = `${label}|${state}`;
  let icon = iconCache.get(key);
  if (!icon) {
    icon = L.divIcon({
      className: styles.pinWrap,
      html: `<span class="${styles.pin} ${state === "idle" ? "" : styles[state]}">${label}</span>`,
      iconSize: [54, 28],
      iconAnchor: [27, 14],
    });
    iconCache.set(key, icon);
  }
  return icon;
}

const shortRent = (rent: number) => (rent >= 1000 ? `$${(rent / 1000).toFixed(1)}K` : `$${rent}`);

function Recenter({ center, zoom }: Pick<Props, "center" | "zoom">) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

function PanToSelected({ items, selectedId }: Pick<Props, "items" | "selectedId">) {
  const map = useMap();
  useEffect(() => {
    const target = items.find((item) => item.id === selectedId);
    if (target) map.panTo([target.lat, target.lng], { animate: true });
  }, [map, items, selectedId]);
  return null;
}

function DragWatcher({ onUserDrag }: Pick<Props, "onUserDrag">) {
  useMapEvents({ dragend: onUserDrag });
  return null;
}

function ShyPins({ enabled }: { enabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = map.getContainer();
    const onMove = (event: MouseEvent) => {
      container.querySelectorAll<HTMLElement>(`.${styles.pinWrap}`).forEach((wrap) => {
        const pin = wrap.firstElementChild as HTMLElement | null;
        if (!pin) return;
        const box = wrap.getBoundingClientRect();
        const dx = box.left + box.width / 2 - event.clientX;
        const dy = box.top + box.height / 2 - event.clientY;
        const distance = Math.hypot(dx, dy);
        if (distance < 70 && distance > 0) {
          pin.style.transform = `translate(${(dx / distance) * 14}px, ${(dy / distance) * 14}px)`;
        } else {
          pin.style.transform = "";
        }
      });
    };
    container.addEventListener("mousemove", onMove);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.querySelectorAll<HTMLElement>(`.${styles.pinWrap} > span`).forEach((pin) => (pin.style.transform = ""));
    };
  }, [map, enabled]);
  return null;
}

function ZoomButtons({ swapped }: { swapped: boolean }) {
  const map = useMap();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (box.current) {
      L.DomEvent.disableClickPropagation(box.current);
      L.DomEvent.disableScrollPropagation(box.current);
    }
  }, []);

  return (
    <div ref={box} className={styles.zoom}>
      <button type="button" aria-label="Zoom in" onClick={() => (swapped ? map.zoomOut() : map.zoomIn())}>
        +
      </button>
      <button type="button" aria-label="Zoom out" onClick={() => (swapped ? map.zoomIn() : map.zoomOut())}>
        −
      </button>
    </div>
  );
}

export default function RentMap({ items, hoveredId, selectedId, onHover, onSelect, center, zoom, degraded, swapZoom, shyPins, onUserDrag }: Props) {
  return (
    <div className={`${styles.map} ${degraded ? styles.degraded : ""}`} data-rent="map">
      <MapContainer center={center} zoom={zoom} zoomControl={false} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {items.map((item) => {
          const state: PinState = item.id === selectedId ? "selected" : item.id === hoveredId ? "hover" : "idle";
          return (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={pinIcon(shortRent(item.rent), state)}
              zIndexOffset={state === "idle" ? 0 : 1000}
              eventHandlers={{
                click: () => onSelect(item.id),
                mouseover: () => onHover(item.id),
                mouseout: () => onHover(null),
              }}
            />
          );
        })}
        <Recenter center={center} zoom={zoom} />
        <PanToSelected items={items} selectedId={selectedId} />
        <DragWatcher onUserDrag={onUserDrag} />
        <ShyPins enabled={shyPins} />
        <ZoomButtons swapped={swapZoom} />
      </MapContainer>
    </div>
  );
}
