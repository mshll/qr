import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { IconProps } from "@mingcute/react";
import {
  CalendarFilled,
  Chat1Filled,
  LinkFilled,
  LocationFilled,
  MailFilled,
  PhoneFilled,
  TextFilled,
  User3Filled,
  WIFIFilled,
} from "@mingcute/react/core-filled";
import {
  CalendarRegular,
  Chat1Regular,
  LinkRegular,
  LocationRegular,
  MailRegular,
  PhoneRegular,
  TextRegular,
  User3Regular,
  WIFIRegular,
} from "@mingcute/react/core-regular";

import { typeLabels, type QrType } from "~/lib/qr/types";
import { cn } from "~/lib/utils";

type Glyph = React.ComponentType<IconProps>;

const typeIcons: Record<QrType, [regular: Glyph, filled: Glyph]> = {
  url: [LinkRegular, LinkFilled],
  text: [TextRegular, TextFilled],
  wifi: [WIFIRegular, WIFIFilled],
  vcard: [User3Regular, User3Filled],
  email: [MailRegular, MailFilled],
  sms: [Chat1Regular, Chat1Filled],
  phone: [PhoneRegular, PhoneFilled],
  location: [LocationRegular, LocationFilled],
  event: [CalendarRegular, CalendarFilled],
};

export const typeOrder = Object.keys(typeLabels) as QrType[];

interface Box {
  x: number;
  y: number;
  width: number;
}

interface TypePickerProps {
  value: QrType;
  onChange: (type: QrType) => void;
}

export function TypePicker({ value, onChange }: TypePickerProps): React.ReactNode {
  const listRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const active = list.querySelector<HTMLElement>("[aria-checked=true]");
      if (active) setBox({ x: active.offsetLeft, y: active.offsetTop, width: active.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>("[aria-checked=true]");
    if (!list || !active || !animate) return;
    const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [value, animate]);

  return (
    <div
      ref={listRef}
      role="radiogroup"
      aria-label="QR code type"
      className="no-scrollbar relative -mx-4 flex gap-1.5 overflow-x-auto px-4 max-lg:mask-[linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] lg:mx-0 lg:flex-wrap lg:px-0"
    >
      {box ? (
        <span
          aria-hidden
          className={cn(
            "absolute top-0 left-0 z-10 h-9 rounded-[10px] bg-foreground",
            animate && "transition-[translate,width] duration-300 ease-out",
          )}
          style={{ translate: `${box.x}px ${box.y}px`, width: box.width }}
        />
      ) : null}
      {typeOrder.map((type, index) => {
        const Glyph = typeIcons[type][type === value ? 1 : 0];
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={type === value}
            title={`${typeLabels[type]} (${index + 1})`}
            onClick={() => onChange(type)}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] bg-field px-3 text-[14px] font-medium text-muted-foreground transition-colors duration-200 hover:not-aria-checked:text-foreground aria-checked:text-background"
          >
            <span className="relative z-20 flex items-center gap-1.5">
              <Glyph className="size-4 lg:hidden" />
              {typeLabels[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
