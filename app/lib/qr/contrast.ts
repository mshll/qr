import type { QrStyle } from "./style";

function luminance(hex: string) {
  const n = Number.parseInt(hex.slice(1, 7).padEnd(6, "0"), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: number, b: number) {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Scanners threshold on lightness, so the weakest ink stop decides; inverted codes fail in many older apps
export function contrastWarning(style: QrStyle): string | null {
  const bg = luminance(style.transparent ? "#ffffff" : style.bg);
  const inks = [style.fg, ...(style.gradient ? [style.gradient.to] : [])].map(luminance);
  if (inks.some((ink) => ratio(ink, bg) < 3)) return "Low contrast between code and background";
  if (!style.transparent && inks.some((ink) => ink > bg))
    return "Light code on a dark background: some scanner apps can't read inverted codes";
  if (style.transparent) return "Transparent background: place it on a light surface";
  return null;
}
