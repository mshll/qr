import { useMemo } from "react";

import { FieldGroup, FieldLabel } from "~/components/ui/field";
import { Segmented } from "~/components/ui/segmented";
import { Slider } from "~/components/ui/slider";
import { useQrCode } from "~/hooks/use-qr-code";
import {
  cornerDotTypes,
  cornerSquareTypes,
  defaultStyle,
  dotTypes,
  matchesPreset,
  presets,
  toOptions,
  type ErrorLevel,
  type QrStyle,
} from "~/lib/qr/style";
import { cn } from "~/lib/utils";

export interface PanelProps {
  style: QrStyle;
  onChange: (patch: Partial<QrStyle>) => void;
}

const SWATCH_DATA = "qr.mshl.me";
// Version 1 codes are 21 modules of 10px; these windows show data modules and the top-left finder
const DOTS_CROP = "70 80 60 60";
const CORNER_CROP = "-5 -5 80 80";
const FULL_CROP = "0 0 210 210";

function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function ShapeSwatch({ crop, style }: { crop: string; style: QrStyle }) {
  const { dots, cornerSquare, cornerDot, fg, bg, transparent, gradient } = style;
  const options = useMemo(() => {
    const base = toOptions(
      SWATCH_DATA,
      {
        ...defaultStyle,
        dots,
        cornerSquare,
        cornerDot,
        fg,
        bg,
        transparent,
        gradient,
        ecl: "L",
        margin: 0,
      },
      undefined,
    );
    return {
      ...base,
      plugins: [
        ...(base.plugins ?? []),
        { postProcess: (svg: SVGSVGElement) => svg.setAttribute("viewBox", crop) },
      ],
    };
  }, [crop, dots, cornerSquare, cornerDot, fg, bg, transparent, gradient]);
  const { containerRef } = useQrCode(options);
  // Width-only sizing: Safari resolves a percentage height inside a padded aspect-ratio box too tall
  return (
    <div
      ref={containerRef}
      aria-hidden
      className="aspect-square w-full [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
    />
  );
}

const tile =
  "press overflow-hidden rounded-[10px] ring-1 ring-border hover:ring-muted-foreground/40 aria-checked:ring-2 aria-checked:ring-foreground";

function ShapeStrip<T extends string>({
  label,
  options,
  value,
  crop,
  style,
  preview,
  onPick,
}: {
  label: string;
  options: T[];
  value: T;
  crop: string;
  style: QrStyle;
  preview: (option: T) => Partial<QrStyle>;
  onPick: (value: T) => void;
}) {
  return (
    <section>
      <FieldLabel>{label}</FieldLabel>
      <div
        role="radiogroup"
        aria-label={label}
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 lg:mx-0 lg:grid lg:grid-cols-7 lg:px-0.5"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={option === value}
            aria-label={titleCase(option)}
            title={titleCase(option)}
            onClick={() => onPick(option)}
            className={cn(tile, "w-12 shrink-0 p-1.5 lg:w-auto")}
            style={{ background: style.transparent ? "#fff" : style.bg }}
          >
            <ShapeSwatch crop={crop} style={{ ...style, ...preview(option) }} />
          </button>
        ))}
      </div>
    </section>
  );
}

const eclOptions: { value: ErrorLevel; label: string }[] = [
  { value: "L", label: "L" },
  { value: "M", label: "M" },
  { value: "Q", label: "Q" },
  { value: "H", label: "H" },
];

export function ShapePanel({ style, onChange }: PanelProps): React.ReactNode {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div role="radiogroup" aria-label="Presets" className="grid grid-cols-4 gap-2 p-0.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={matchesPreset(style, preset.style)}
            aria-label={preset.label}
            title={preset.label}
            onClick={() => onChange(preset.style)}
            className={cn(tile, "p-2")}
            style={{ background: style.transparent ? "#fff" : style.bg }}
          >
            <ShapeSwatch crop={FULL_CROP} style={{ ...style, ...preset.style }} />
          </button>
        ))}
      </div>
      <ShapeStrip
        label="Dots"
        options={dotTypes}
        value={style.dots}
        crop={DOTS_CROP}
        style={style}
        preview={(dots) => ({ dots })}
        onPick={(dots) => onChange({ dots })}
      />
      <ShapeStrip
        label="Corners"
        options={cornerSquareTypes}
        value={style.cornerSquare}
        crop={CORNER_CROP}
        style={style}
        preview={(cornerSquare) => ({ cornerSquare })}
        onPick={(cornerSquare) => onChange({ cornerSquare })}
      />
      <ShapeStrip
        label="Corner centers"
        options={cornerDotTypes}
        value={style.cornerDot}
        crop={CORNER_CROP}
        style={style}
        preview={(cornerDot) => ({ cornerDot })}
        onPick={(cornerDot) => onChange({ cornerDot })}
      />
      <FieldGroup>
        <div className="grid gap-2 px-4 py-3">
          <div className="flex justify-between text-[16px]">
            Margin
            <span className="text-muted-foreground tabular-nums">{style.margin}</span>
          </div>
          <Slider
            aria-label="Margin"
            value={style.margin}
            min={0}
            max={8}
            step={1}
            onValueChange={(v) => onChange({ margin: Array.isArray(v) ? v[0] : v })}
          />
        </div>
        <div className="flex items-center justify-between gap-4 py-2 pr-2 pl-4 text-[16px]">
          Error correction
          <Segmented
            label="Error correction"
            options={eclOptions}
            value={style.logo ? "H" : style.ecl}
            disabled={!!style.logo}
            onChange={(ecl) => onChange({ ecl })}
            className="w-40"
          />
        </div>
      </FieldGroup>
    </div>
  );
}
