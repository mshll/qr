import {
  siApple,
  siFacebook,
  siGithub,
  siGoogleplay,
  siInstagram,
  siSnapchat,
  siSpotify,
  siTelegram,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";

import { glyphPaths } from "./glyphs";

// LinkedIn asked Simple Icons to drop its mark after v13; this is the v13.0.0 path (CC0)
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export interface LogoIcon {
  id: string;
  label: string;
  path: string;
  brandColor?: string;
}

function brand(id: string, icon: SimpleIcon, label = icon.title): LogoIcon {
  return { id, label, path: icon.path, brandColor: `#${icon.hex}` };
}

export const logoIcons: LogoIcon[] = [
  { id: "link", label: "Link", path: glyphPaths.link },
  { id: "wifi", label: "WiFi", path: glyphPaths.wifi },
  { id: "mail", label: "Mail", path: glyphPaths.mail },
  { id: "phone", label: "Phone", path: glyphPaths.phone },
  { id: "message", label: "Message", path: glyphPaths.message },
  { id: "user", label: "Contact", path: glyphPaths.user },
  { id: "map-pin", label: "Location", path: glyphPaths["map-pin"] },
  { id: "calendar", label: "Calendar", path: glyphPaths.calendar },
  brand("instagram", siInstagram),
  brand("whatsapp", siWhatsapp),
  brand("x", siX),
  brand("facebook", siFacebook),
  brand("tiktok", siTiktok),
  brand("youtube", siYoutube),
  { id: "linkedin", label: "LinkedIn", path: LINKEDIN_PATH, brandColor: "#0A66C2" },
  // The official #FFFC00 disappears on a white code background
  { ...brand("snapchat", siSnapchat), brandColor: "#E6C800" },
  brand("telegram", siTelegram),
  brand("github", siGithub),
  brand("spotify", siSpotify),
  brand("apple", siApple),
  brand("google-play", siGoogleplay),
];

const iconById = new Map(logoIcons.map((icon) => [icon.id, icon]));

export function getLogoIcon(id: string): LogoIcon | undefined {
  return iconById.get(id);
}

export function svgDataUrl(path: string, color = "#000000"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="${path}"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function iconDataUrl(id: string, ink: string, brandColor: boolean): string | undefined {
  const logo = iconById.get(id);
  if (!logo) return undefined;
  return svgDataUrl(logo.path, brandColor && logo.brandColor ? logo.brandColor : ink);
}
