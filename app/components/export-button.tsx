import {
  ArrowDown01Icon,
  Copy01Icon,
  Download04Icon,
  Link02Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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

interface ExportButtonProps {
  disabled: boolean;
  canShare: boolean;
  onExport: (action: ExportAction) => void;
  className?: string;
}

export function ExportButton({
  disabled,
  canShare,
  onExport,
  className,
}: ExportButtonProps): React.ReactNode {
  return (
    <div className={cn("flex", className)}>
      <Button
        size="lg"
        disabled={disabled}
        onClick={() => onExport({ kind: "png", size: 1024 })}
        className="h-10 flex-1 rounded-r-none text-[14px] font-semibold"
      >
        <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
        Download PNG
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            <Button
              size="lg"
              aria-label="More export options"
              className="h-10 rounded-l-none border-l border-l-black/15 px-2.5"
            />
          }
        >
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Download</DropdownMenuLabel>
            {PNG_SIZES.map((size) => (
              <DropdownMenuItem key={size} onClick={() => onExport({ kind: "png", size })}>
                PNG
                <DropdownMenuShortcut>{size}px</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => onExport({ kind: "svg" })}>
              SVG
              <DropdownMenuShortcut>Vector</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onExport({ kind: "copy" })}>
            <HugeiconsIcon icon={Copy01Icon} />
            Copy image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport({ kind: "link" })}>
            <HugeiconsIcon icon={Link02Icon} />
            Copy link
          </DropdownMenuItem>
          {canShare ? (
            <DropdownMenuItem onClick={() => onExport({ kind: "share" })}>
              <HugeiconsIcon icon={Share08Icon} />
              Share
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
