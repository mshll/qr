import { useEffect, useState } from "react";
import {
  CheckRegular,
  Download2Regular,
  More1Regular,
  UploadRegular,
} from "@mingcute/react/core-regular";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

export type ExportAction =
  | { kind: "png"; size: number }
  | { kind: "svg" }
  | { kind: "copy" }
  | { kind: "share" }
  | { kind: "link" };

const PNG_SIZES = [512, 1024, 2048];

const iconButton =
  "press grid size-12 shrink-0 place-items-center rounded-xl bg-field hover:bg-hover disabled:opacity-40 aria-expanded:bg-hover";

interface ExportButtonProps {
  disabled: boolean;
  canShare: boolean;
  onExport: (action: ExportAction) => Promise<boolean>;
}

const SAVED_MS = 1600;

const label =
  "col-start-1 row-start-1 flex items-center gap-2 transition-[opacity,translate] duration-300 ease-out";

export function ExportButton({ disabled, canShare, onExport }: ExportButtonProps): React.ReactNode {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), SAVED_MS);
    return () => clearTimeout(timer);
  }, [saved]);

  const download = async () => {
    if (await onExport({ kind: "png", size: 1024 })) setSaved(true);
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => void download()}
        className="press grid h-12 flex-1 place-items-center rounded-xl bg-foreground text-[16px] font-semibold text-background disabled:opacity-25"
      >
        <span className={cn(label, saved && "-translate-y-2 opacity-0")}>
          <Download2Regular className="size-5" />
          Download
        </span>
        <span aria-hidden={!saved} className={cn(label, !saved && "translate-y-2 opacity-0")}>
          <CheckRegular className="size-5" />
          Saved
        </span>
      </button>
      {canShare ? (
        <button
          type="button"
          aria-label="Share"
          disabled={disabled}
          onClick={() => void onExport({ kind: "share" })}
          className={iconButton}
        >
          <UploadRegular className="size-5" />
        </button>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger disabled={disabled} aria-label="More options" className={iconButton}>
          <More1Regular className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-52">
          {PNG_SIZES.map((size) => (
            <DropdownMenuItem key={size} onClick={() => void onExport({ kind: "png", size })}>
              PNG
              <DropdownMenuShortcut>{size}px</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => void onExport({ kind: "svg" })}>
            SVG
            <DropdownMenuShortcut>Vector</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => void onExport({ kind: "copy" })}>
            Copy image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void onExport({ kind: "link" })}>
            Copy link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
