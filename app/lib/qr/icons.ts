import {
  AppleIcon,
  Calendar03Icon,
  CallIcon,
  Facebook01Icon,
  GithubIcon,
  InstagramIcon,
  Link01Icon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  Message01Icon,
  NewTwitterIcon,
  PlayStoreIcon,
  SnapchatIcon,
  SpotifyIcon,
  TelegramIcon,
  TiktokIcon,
  UserCircleIcon,
  WhatsappIcon,
  Wifi01Icon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface LogoIcon {
  id: string;
  label: string;
  icon: IconSvgElement;
  brandColor?: string;
}

export const genericIcons: LogoIcon[] = [
  { id: "link", label: "Link", icon: Link01Icon },
  { id: "wifi", label: "WiFi", icon: Wifi01Icon },
  { id: "mail", label: "Mail", icon: Mail01Icon },
  { id: "phone", label: "Phone", icon: CallIcon },
  { id: "message", label: "Message", icon: Message01Icon },
  { id: "user", label: "Contact", icon: UserCircleIcon },
  { id: "map-pin", label: "Location", icon: Location01Icon },
  { id: "calendar", label: "Calendar", icon: Calendar03Icon },
];

export const brandIcons: LogoIcon[] = [
  { id: "instagram", label: "Instagram", icon: InstagramIcon, brandColor: "#e1306c" },
  { id: "whatsapp", label: "WhatsApp", icon: WhatsappIcon, brandColor: "#25d366" },
  { id: "x", label: "X", icon: NewTwitterIcon, brandColor: "#000000" },
  { id: "facebook", label: "Facebook", icon: Facebook01Icon, brandColor: "#0866ff" },
  { id: "tiktok", label: "TikTok", icon: TiktokIcon, brandColor: "#000000" },
  { id: "youtube", label: "YouTube", icon: YoutubeIcon, brandColor: "#ff0000" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin01Icon, brandColor: "#0a66c2" },
  { id: "snapchat", label: "Snapchat", icon: SnapchatIcon, brandColor: "#e6b800" },
  { id: "telegram", label: "Telegram", icon: TelegramIcon, brandColor: "#26a5e4" },
  { id: "github", label: "GitHub", icon: GithubIcon, brandColor: "#181717" },
  { id: "spotify", label: "Spotify", icon: SpotifyIcon, brandColor: "#1db954" },
  { id: "apple", label: "Apple", icon: AppleIcon, brandColor: "#000000" },
  { id: "google-play", label: "Google Play", icon: PlayStoreIcon, brandColor: "#01875f" },
];

const iconById = new Map([...genericIcons, ...brandIcons].map((icon) => [icon.id, icon]));

export function getLogoIcon(id: string): LogoIcon | undefined {
  return iconById.get(id);
}

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function toSvg(icon: IconSvgElement, color: string) {
  const children = icon
    .map(([tag, attrs]) => {
      const attributes = Object.entries(attrs)
        .filter(([key]) => key !== "key")
        .map(([key, value]) => {
          const resolved =
            value === "currentColor" ? color : key === "strokeWidth" ? "1.75" : value;
          return `${kebab(key)}="${resolved}"`;
        })
        .join(" ");
      return `<${tag} ${attributes}/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${children}</svg>`;
}

export function iconDataUrl(id: string, ink: string, brandColor: boolean): string | undefined {
  const logo = iconById.get(id);
  if (!logo) return undefined;
  const color = brandColor && logo.brandColor ? logo.brandColor : ink;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(toSvg(logo.icon, color))}`;
}
