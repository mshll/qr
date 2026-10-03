import type { QrData, QrType } from "./types";

export type LinkKind = "url" | "email" | "phone" | "text";

const schemeRe = /^[a-z][a-z0-9+.-]*:/i;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?[\d\s().-]+$/;
const domainRe = /^[^\s/]+\.[a-z]{2,}(?::\d+)?(?:[/?#]\S*)?$/i;

export function detectLink(input: string): { kind: LinkKind; payload: string } {
  const value = input.trim();
  if (!value) return { kind: "url", payload: "" };
  if (emailRe.test(value)) return { kind: "email", payload: `mailto:${value}` };
  if (phoneRe.test(value) && value.replace(/\D/g, "").length >= 6) {
    return { kind: "phone", payload: `tel:${normalizePhone(value)}` };
  }
  if (schemeRe.test(value)) return { kind: "url", payload: value };
  if (domainRe.test(value)) return { kind: "url", payload: `https://${value}` };
  return { kind: "text", payload: value };
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function escapeWifi(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

// vCard (RFC 6350) and iCalendar (RFC 5545) share the same text escaping
function escapeText(value: string) {
  return value.replace(/([\\;,])/g, "\\$1").replace(/\r?\n/g, "\\n");
}

function lines(entries: (string | false)[]) {
  return entries.filter(Boolean).join("\r\n");
}

// Values come from <input type="date"> ("2026-10-02") or <input type="datetime-local"> ("2026-10-02T15:00").
// Times stay floating (no Z) so the event lands at the same wall-clock time for the scanner.
function icalProperty(name: string, value: string, exclusiveEnd = false) {
  if (!value.includes("T")) {
    const date = new Date(`${value}T00:00:00Z`);
    // All-day DTEND is exclusive in iCalendar, users enter the last day inclusive
    if (exclusiveEnd) date.setUTCDate(date.getUTCDate() + 1);
    return `${name};VALUE=DATE:${date.toISOString().slice(0, 10).replace(/-/g, "")}`;
  }
  const [day, time] = value.split("T");
  return `${name}:${day.replace(/-/g, "")}T${time.replace(/:/g, "").padEnd(6, "0").slice(0, 6)}`;
}

function inRange(value: string, limit: number) {
  const n = Number(value);
  return value.trim() !== "" && Number.isFinite(n) && Math.abs(n) <= limit;
}

const encoders: { [K in QrType]: (data: QrData[K]) => string } = {
  url: (d) => detectLink(d.value).payload,
  text: (d) => d.value,
  wifi: (d) => {
    if (!d.ssid) return "";
    const password = d.encryption === "nopass" ? "" : `P:${escapeWifi(d.password)};`;
    return `WIFI:T:${d.encryption};S:${escapeWifi(d.ssid)};${password}${d.hidden ? "H:true;" : ""};`;
  },
  vcard: (d) => {
    const fn = [d.firstName, d.lastName].filter(Boolean).join(" ") || d.org;
    if (!fn && !d.phone && !d.email) return "";
    const address = [d.street, d.city, d.region, d.postcode, d.country];
    return lines([
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${escapeText(d.lastName)};${escapeText(d.firstName)};;;`,
      `FN:${escapeText(fn)}`,
      !!d.org && `ORG:${escapeText(d.org)}`,
      !!d.title && `TITLE:${escapeText(d.title)}`,
      !!d.phone && `TEL;TYPE=CELL:${normalizePhone(d.phone)}`,
      !!d.email && `EMAIL:${d.email.trim()}`,
      !!d.website && `URL:${detectLink(d.website).payload}`,
      address.some(Boolean) && `ADR;TYPE=WORK:;;${address.map(escapeText).join(";")}`,
      !!d.note && `NOTE:${escapeText(d.note)}`,
      "END:VCARD",
    ]);
  },
  email: (d) => {
    if (!d.to && !d.subject && !d.body) return "";
    const params = new URLSearchParams();
    if (d.subject) params.set("subject", d.subject);
    if (d.body) params.set("body", d.body);
    // URLSearchParams encodes spaces as "+", which mail clients show literally
    const query = params.toString().replace(/\+/g, "%20");
    return `mailto:${d.to.trim()}${query ? `?${query}` : ""}`;
  },
  sms: (d) => (d.phone ? `SMSTO:${normalizePhone(d.phone)}:${d.message}` : ""),
  phone: (d) => (d.phone ? `tel:${normalizePhone(d.phone)}` : ""),
  location: (d) => {
    if (!inRange(d.lat, 90) || !inRange(d.lng, 180)) return "";
    // A maps URL opens on both iOS and Android, geo: URIs are not handled by every camera app
    return `https://www.google.com/maps/search/?api=1&query=${Number(d.lat)},${Number(d.lng)}`;
  },
  event: (d) => {
    if (!d.title || !d.start) return "";
    return lines([
      "BEGIN:VEVENT",
      `SUMMARY:${escapeText(d.title)}`,
      icalProperty("DTSTART", d.start),
      !!d.end && icalProperty("DTEND", d.end, true),
      !!d.location && `LOCATION:${escapeText(d.location)}`,
      !!d.description && `DESCRIPTION:${escapeText(d.description)}`,
      "END:VEVENT",
    ]);
  },
};

export function encode<K extends QrType>(type: K, data: QrData[K]): string {
  return encoders[type](data);
}
