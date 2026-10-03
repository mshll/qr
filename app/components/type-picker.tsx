import {
  Calendar03Icon,
  CallIcon,
  Link01Icon,
  Location01Icon,
  Mail01Icon,
  Message01Icon,
  TextIcon,
  UserCircleIcon,
  Wifi01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { typeLabels, type QrType } from "~/lib/qr/types";
import { cn } from "~/lib/utils";

export const typeIcons: Record<QrType, IconSvgElement> = {
  url: Link01Icon,
  text: TextIcon,
  wifi: Wifi01Icon,
  vcard: UserCircleIcon,
  email: Mail01Icon,
  sms: Message01Icon,
  phone: CallIcon,
  location: Location01Icon,
  event: Calendar03Icon,
};

export const typeOrder = Object.keys(typeLabels) as QrType[];

interface TypePickerProps {
  value: QrType;
  onChange: (type: QrType) => void;
}

export function TypePicker({ value, onChange }: TypePickerProps): React.ReactNode {
  return (
    <div role="radiogroup" aria-label="QR code type" className="grid grid-cols-3 gap-1.5">
      {typeOrder.map((type, index) => {
        const selected = type === value;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            title={`${typeLabels[type]} (${index + 1})`}
            onClick={() => onChange(type)}
            className={cn(
              "flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[12px] text-muted-foreground ring-1 ring-border transition outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
              selected && "bg-accent text-foreground ring-2 ring-ring",
            )}
          >
            <HugeiconsIcon icon={typeIcons[type]} className="size-5" />
            {typeLabels[type]}
          </button>
        );
      })}
    </div>
  );
}
