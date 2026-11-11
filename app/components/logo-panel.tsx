import { useEffect, useRef, useState } from "react";
import { CloseRegular, ForbidCircleRegular, Upload2Regular } from "@mingcute/react/core-regular";
import { toast } from "sonner";

import type { PanelProps } from "~/components/shape-panel";
import { FieldGroup, FieldLabel, FieldSwitch } from "~/components/ui/field";
import { Slider } from "~/components/ui/slider";
import { track } from "~/lib/analytics";
import { getLogoIcon, logoIcons, svgDataUrl } from "~/lib/qr/icons";
import type { Logo } from "~/lib/qr/style";
import { cn } from "~/lib/utils";

const MAX_LOGO_EDGE = 512;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

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

function imageFrom(files: FileList | undefined | null) {
  return Array.from(files ?? []).find((file) => file.type.startsWith("image/"));
}

const cell =
  "press grid aspect-square place-items-center rounded-xl bg-field text-muted-foreground hover:text-foreground aria-pressed:text-foreground aria-pressed:ring-2 aria-pressed:ring-foreground";

export function LogoPanel({ style, onChange }: PanelProps): React.ReactNode {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const activeId = style.logo?.kind === "icon" ? style.logo.id : null;
  const activeIcon = activeId ? getLogoIcon(activeId) : undefined;
  const uploaded = style.logo?.kind === "upload" ? style.logo.src : null;

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Use a PNG, JPG, WebP, GIF or SVG");
      return;
    }
    try {
      onChange({ logo: { kind: "upload", src: await readLogo(file) } });
      track("logo_added", { kind: "upload" });
    } catch (error) {
      console.error(error);
      toast.error("Couldn't read that image");
    }
  };
  const uploadRef = useRef(upload);
  uploadRef.current = upload;

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = imageFrom(event.clipboardData?.files);
      if (!file) return;
      event.preventDefault();
      void uploadRef.current(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const pick = (logo: Logo | null) => {
    onChange({ logo });
    if (logo?.kind === "icon") track("logo_added", { kind: logo.id });
  };

  return (
    <div
      className="grid grid-cols-1 gap-6"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!(e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget))) {
          setDragging(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void upload(imageFrom(e.dataTransfer.files));
      }}
    >
      <FieldGroup
        className={cn(
          "transition-shadow duration-200",
          dragging && "ring-2 ring-foreground ring-offset-2 ring-offset-background",
        )}
      >
        <div className="flex items-center gap-1 p-1.5 pr-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="press flex min-w-0 flex-1 items-center gap-3 rounded-[10px] p-1 text-left"
          >
            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[9px] bg-background">
              {uploaded ? (
                <img
                  src={uploaded}
                  alt=""
                  className="size-full animate-in bg-white object-contain p-1 duration-300 fade-in zoom-in-90"
                />
              ) : (
                <Upload2Regular className="size-5" />
              )}
            </span>
            <span className="text-[16px]">{uploaded ? "Replace image" : "Upload image"}</span>
          </button>
          {uploaded ? (
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => pick(null)}
              className="press grid size-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              <CloseRegular className="size-4" />
            </button>
          ) : null}
        </div>
      </FieldGroup>
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

      <section>
        <FieldLabel>Icons</FieldLabel>
        <div className="grid grid-cols-6 gap-2 p-0.5 lg:grid-cols-7">
          <button
            type="button"
            aria-label="No logo"
            title="None"
            aria-pressed={!style.logo}
            onClick={() => pick(null)}
            className={cell}
          >
            <ForbidCircleRegular className="size-5" />
          </button>
          {logoIcons.map((icon) => (
            <button
              key={icon.id}
              type="button"
              title={icon.label}
              aria-label={icon.label}
              aria-pressed={activeId === icon.id}
              onClick={() => pick(activeId === icon.id ? null : { kind: "icon", id: icon.id })}
              className={cell}
            >
              <span
                aria-hidden
                className="size-5 bg-current"
                style={{ mask: `url("${svgDataUrl(icon.path)}") center / contain no-repeat` }}
              />
            </button>
          ))}
        </div>
      </section>

      {style.logo ? (
        <FieldGroup className="animate-in duration-300 fade-in slide-in-from-bottom-1">
          <div className="grid gap-2 px-4 py-3">
            <div className="flex justify-between text-[16px]">
              Size
              <span className="text-muted-foreground tabular-nums">
                {Math.round(style.logoSize * 100)}%
              </span>
            </div>
            <Slider
              aria-label="Logo size"
              value={style.logoSize}
              min={0.2}
              max={0.8}
              step={0.05}
              onValueChange={(v) => onChange({ logoSize: Array.isArray(v) ? v[0] : v })}
            />
          </div>
          {activeIcon?.brandColor ? (
            <FieldSwitch
              label="Brand color"
              checked={style.brandColor}
              onChange={(brandColor) => onChange({ brandColor })}
            />
          ) : null}
        </FieldGroup>
      ) : null}
    </div>
  );
}
