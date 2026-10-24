import { hashString, mulberry32 } from "@/app/rent/_lib/seeded-random";
import styles from "./DistortedText.module.css";

const CHAR_WIDTH = 30;

type DistortedTextProps = {
  text: string;
  /** One layer is drawn per font, all on top of each other. */
  fonts?: string[];
  label?: string;
};

/** Draws text as wobbly SVG glyphs with noise lines so it reads as a CAPTCHA. */
export function DistortedText({ text, fonts = ["Georgia, serif"], label = "Distorted text" }: DistortedTextProps) {
  const random = mulberry32(hashString(text));
  const width = text.length * CHAR_WIDTH + 24;
  const glyphs = text.split("").map((char, index) => ({
    char,
    x: 14 + index * CHAR_WIDTH,
    y: 44 + (random() - 0.5) * 12,
    rotate: (random() - 0.5) * 36,
    skew: (random() - 0.5) * 30,
  }));
  const noise = Array.from({ length: 5 }, () => ({
    y1: random() * 60,
    y2: random() * 60,
  }));

  return (
    <svg viewBox={`0 0 ${width} 64`} className={styles.text} role="img" aria-label={`${label}. Type what you see.`}>
      <rect width={width} height="64" className={styles.paper} />
      {glyphs.map((glyph, index) =>
        fonts.map((font) => (
          <text
            key={`${index}-${font}`}
            x={glyph.x}
            y={glyph.y}
            fontFamily={font}
            fontSize="36"
            fontWeight="700"
            className={styles.glyph}
            opacity={fonts.length > 1 ? 0.7 : 1}
            transform={`rotate(${glyph.rotate} ${glyph.x + 10} ${glyph.y - 12}) skewX(${glyph.skew})`}
          >
            {glyph.char}
          </text>
        )),
      )}
      {noise.map((line, index) => (
        <line key={index} x1="0" y1={line.y1} x2={width} y2={line.y2} className={styles.noise} />
      ))}
    </svg>
  );
}
