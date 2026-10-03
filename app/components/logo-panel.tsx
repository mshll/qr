import { useRef, useState } from "react";
import { Cancel01Icon, ImageUpload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Section, SliderRow, SwitchRow, type PanelProps } from "~/components/style-panel";
import { Button } from "~/components/ui/button";
import { track } from "~/lib/analytics";
import { brandIcons, genericIcons, getLogoIcon, type LogoIcon } from "~/lib/qr/icons";
import type { Logo } from "~/lib/qr/style";
import { cn } from "~/lib/utils";

const MAX_LOGO_EDGE = 512;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

async function readLogo(file: File): Promise<string> {
  if (file.type === "image/svg+xml") {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(await file.text())}`;
  }
  // Downscale large photos so recent codes stay small in IndexedDB
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_LOGO_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

function SymbolGrid({
  icons,
  activeId,
  onPick,
}: {
  icons: LogoIcon[];
  activeId: string | null;
  onPick: (id: string) => void;
}) {
  return (
    <div className={cn("grid gap-1.5", icons.length > 8 ? "grid-cols-7" : "grid-cols-8")}>
      {icons.map((icon) => (
        <button
          key={icon.id}
          type="button"
          title={icon.label}
          aria-label={icon.label}
          aria-pressed={activeId === icon.id}
          onClick={() => onPick(icon.id)}
          className={cn(
            "grid aspect-square place-items-center rounded-md text-muted-foreground ring-1 ring-border transition outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
            activeId === icon.id && "bg-accent text-foreground ring-2 ring-ring",
          )}
        >
          <HugeiconsIcon icon={icon.icon} className="size-5" />
        </button>
      ))}
    </div>
  );
}

export function LogoPanel({ style, onChange }: PanelProps): React.ReactNode {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const activeId = style.logo?.kind === "icon" ? style.logo.id : null;
  const activeIcon = activeId ? getLogoIcon(activeId) : undefined;

  const setLogo = (logo: Logo | null) => {
    onChange({ logo });
    if (logo) track("logo_added", { kind: logo.kind === "icon" ? logo.id : "upload" });
  };
  const pick = (id: string) => setLogo(activeId === id ? null : { kind: "icon", id });
  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Use a PNG, JPG, WebP or SVG image");
      return;
    }
    try {
      setLogo({ kind: "upload", src: await readLogo(file) });
    } catch (error) {
      console.error(error);
      toast.error("Couldn't read that image");
    }
  };

  return (
    <div className="grid gap-6">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex items-center gap-3 rounded-lg border border-dashed border-input p-3 text-left transition outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40",
          dragging && "border-ring bg-accent",
        )}
      >
        {style.logo?.kind === "upload" ? (
          <img
            src={style.logo.src}
            alt=""
            className="size-10 rounded-md bg-white object-contain p-1"
          />
        ) : (
          <span className="grid size-10 place-items-center rounded-md bg-secondary text-muted-foreground">
            <HugeiconsIcon icon={ImageUpload01Icon} className="size-5" />
          </span>
        )}
        <span className="grid gap-0.5">
          <span className="text-[13px] font-medium">
            {style.logo?.kind === "upload" ? "Replace your image" : "Upload your logo"}
          </span>
          <span className="text-[12px] text-subtle">Drop or click · PNG, JPG, SVG</span>
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          void upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <Section
        title="Symbols"
        action={
          style.logo ? (
            <Button
              variant="ghost"
              size="xs"
              className="text-muted-foreground"
              onClick={() => onChange({ logo: null })}
            >
              <HugeiconsIcon icon={Cancel01Icon} />
              Remove
            </Button>
          ) : null
        }
      >
        <SymbolGrid icons={genericIcons} activeId={activeId} onPick={pick} />
      </Section>
      <Section title="Brands">
        <SymbolGrid icons={brandIcons} activeId={activeId} onPick={pick} />
      </Section>

      {style.logo ? (
        <div className="grid gap-4">
          <SliderRow
            label="Logo size"
            value={style.logoSize}
            min={0.2}
            max={0.8}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(logoSize) => onChange({ logoSize })}
          />
          {activeIcon?.brandColor ? (
            <SwitchRow
              label="Brand color"
              checked={style.brandColor}
              onChange={(brandColor) => onChange({ brandColor })}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
