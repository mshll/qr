import { emptyData, typeLabels, type QrData, type QrType } from "./qr/types";
import { defaultStyle, type QrStyle } from "./qr/style";

export interface QrState {
  type: QrType;
  data: QrData;
  style: QrStyle;
}

export function initialState(type: QrType): QrState {
  return { type, data: emptyData, style: defaultStyle };
}

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

// Copies only keys that exist in `base` with a matching primitive type, so a hand-edited hash can't inject junk
function pick<T extends object>(base: T, input: unknown): T {
  if (!input || typeof input !== "object") return base;
  const out = { ...base };
  for (const key of Object.keys(base) as (keyof T)[]) {
    const value = (input as Record<keyof T, unknown>)[key];
    if (value !== undefined && typeof value === typeof base[key] && typeof value !== "object") {
      out[key] = value as T[keyof T];
    }
  }
  return out;
}

// The hash is shared and lands in browser history, so secrets and uploaded images stay out of it
export function toHash(state: QrState): string {
  const data = { ...state.data[state.type] };
  if (state.type === "wifi") (data as QrData["wifi"]).password = "";
  const style = {
    ...state.style,
    logo: state.style.logo?.kind === "icon" ? state.style.logo : null,
  };
  const styleDiff = Object.fromEntries(
    Object.entries(style).filter(
      ([key, value]) =>
        JSON.stringify(value) !== JSON.stringify(defaultStyle[key as keyof QrStyle]),
    ),
  );
  return toBase64Url(JSON.stringify({ t: state.type, d: data, s: styleDiff }));
}

export function fromHash(hash: string): QrState | null {
  try {
    const raw = JSON.parse(fromBase64Url(hash.replace(/^#/, "")));
    if (!(raw.t in typeLabels)) return null;
    const type = raw.t as QrType;
    const style = pick(defaultStyle, raw.s);
    const logo = raw.s?.logo;
    if (logo?.kind === "icon" && typeof logo.id === "string")
      style.logo = { kind: "icon", id: logo.id };
    const gradient = raw.s?.gradient;
    if (gradient && typeof gradient.to === "string" && typeof gradient.rotation === "number") {
      style.gradient = {
        type: gradient.type === "radial" ? "radial" : "linear",
        to: gradient.to,
        rotation: gradient.rotation,
      };
    }
    return { type, data: { ...emptyData, [type]: pick(emptyData[type], raw.d) }, style };
  } catch {
    return null;
  }
}

export function describe(state: QrState): string {
  const { type, data } = state;
  switch (type) {
    case "url":
      return data.url.value.trim().replace(/^https?:\/\//, "");
    case "text":
      return data.text.value.trim().split("\n")[0];
    case "wifi":
      return data.wifi.ssid;
    case "vcard":
      return (
        [data.vcard.firstName, data.vcard.lastName].filter(Boolean).join(" ") || data.vcard.org
      );
    case "email":
      return data.email.to || data.email.subject;
    case "sms":
      return data.sms.phone;
    case "phone":
      return data.phone.phone;
    case "location":
      return `${data.location.lat}, ${data.location.lng}`;
    case "event":
      return data.event.title;
  }
}

export function filenameFor(state: QrState): string {
  const slug = describe(state)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `qr-${slug || state.type}`;
}
