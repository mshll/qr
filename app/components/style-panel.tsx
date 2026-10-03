import { useId, useMemo } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import { useQrCode } from "~/hooks/use-qr-code";
import {
  cornerDotTypes,
  cornerSquareTypes,
  defaultStyle,
  dotTypes,
  inkColors,
  matchesPreset,
  paperColors,
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

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-2.5">
      <div className="flex h-5 items-center justify-between">
        <h3 className="text-[13px] font-medium text-muted-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
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

function ShapePicker<T extends string>({
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
    <div
      role="radiogroup"
      aria-label={label}
      className="grid gap-1.5"
      style={{
        gridTemplateColumns: `repeat(${options.length < 10 ? options.length : 6}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={titleCase(option)}
            title={titleCase(option)}
            onClick={() => onPick(option)}
            className={cn(
              "overflow-hidden rounded-md p-1 ring-1 ring-border transition outline-none hover:ring-input focus-visible:ring-2 focus-visible:ring-ring",
              selected && "ring-2 ring-ring hover:ring-ring",
            )}
            style={{ background: style.transparent ? "#fff" : style.bg }}
          >
            <ShapeSwatch crop={crop} style={{ ...style, ...preview(option) }} />
          </button>
        );
      })}
    </div>
  );
}

function ColorRow({
  label,
  colors,
  value,
  onChange,
}: {
  label: string;
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}) {
  const custom = !colors.includes(value);
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={color}
          onClick={() => onChange(color)}
          className={cn(
            "size-7 rounded-full ring-1 ring-border ring-inset transition outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === color && "ring-2 ring-ring ring-offset-2 ring-offset-panel",
          )}
          style={{ background: color }}
        />
      ))}
      <label
        className={cn(
          "relative size-7 cursor-pointer rounded-full bg-[conic-gradient(#f43f5e,#f59e0b,#84cc16,#06b6d4,#6366f1,#d946ef,#f43f5e)] has-focus-visible:ring-2 has-focus-visible:ring-ring",
          custom && "ring-2 ring-ring ring-offset-2 ring-offset-panel",
        )}
        title="Custom color"
      >
        {custom ? (
          <span className="absolute inset-1.5 rounded-full" style={{ background: value }} />
        ) : null}
        <input
          type="color"
          aria-label={`Custom ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>
      <span className="ml-auto text-[12px] text-subtle uppercase tabular-nums">{value}</span>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-0.5 rounded-lg bg-secondary p-0.5",
        disabled && "opacity-50",
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className="h-7 rounded-md text-[13px] text-muted-foreground transition outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 aria-checked:bg-panel aria-checked:text-foreground aria-checked:shadow-sm"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-[12px] text-subtle tabular-nums">{format(value)}</span>
      </div>
      <Slider
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  );
}

export function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="font-normal text-foreground">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

const eclOptions: { value: ErrorLevel; label: string }[] = [
  { value: "L", label: "L" },
  { value: "M", label: "M" },
  { value: "Q", label: "Q" },
  { value: "H", label: "H" },
];

export function StylePanel({ style, onChange }: PanelProps): React.ReactNode {
  const gradient = style.gradient;
  return (
    <div className="grid gap-6">
      <Section title="Presets">
        <div
          role="radiogroup"
          aria-label="Presets"
          className="grid grid-cols-4 gap-x-1.5 gap-y-2.5"
        >
          {presets.map((preset) => {
            const selected = matchesPreset(style, preset.style);
            return (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(preset.style)}
                className="group grid gap-1.5 text-[12px] text-muted-foreground outline-none hover:text-foreground aria-checked:text-foreground"
              >
                <span
                  className="overflow-hidden rounded-md p-1.5 ring-1 ring-border transition group-hover:ring-input group-focus-visible:ring-2 group-focus-visible:ring-ring group-aria-checked:ring-2 group-aria-checked:ring-ring"
                  style={{ background: style.transparent ? "#fff" : style.bg }}
                >
                  <ShapeSwatch crop={FULL_CROP} style={{ ...style, ...preset.style }} />
                </span>
                {preset.label}
              </button>
            );
          })}
        </div>
      </Section>
      <Section title="Dots">
        <ShapePicker
          label="Dots"
          options={dotTypes}
          value={style.dots}
          crop={DOTS_CROP}
          style={style}
          preview={(dots) => ({ dots })}
          onPick={(dots) => onChange({ dots })}
        />
      </Section>
      <Section title="Corner frames">
        <ShapePicker
          label="Corner frames"
          options={cornerSquareTypes}
          value={style.cornerSquare}
          crop={CORNER_CROP}
          style={style}
          preview={(cornerSquare) => ({ cornerSquare })}
          onPick={(cornerSquare) => onChange({ cornerSquare })}
        />
      </Section>
      <Section title="Corner centers">
        <ShapePicker
          label="Corner dots"
          options={cornerDotTypes}
          value={style.cornerDot}
          crop={CORNER_CROP}
          style={style}
          preview={(cornerDot) => ({ cornerDot })}
          onPick={(cornerDot) => onChange({ cornerDot })}
        />
      </Section>
      <Section title={gradient ? "Gradient start" : "Color"}>
        <ColorRow
          label="Color"
          colors={inkColors}
          value={style.fg}
          onChange={(fg) => onChange({ fg })}
        />
      </Section>
      {gradient ? (
        <Section title="Gradient end">
          <ColorRow
            label="Gradient end"
            colors={inkColors}
            value={gradient.to}
            onChange={(to) => onChange({ gradient: { ...gradient, to } })}
          />
          <Segmented
            label="Gradient type"
            options={[
              { value: "linear", label: "Linear" },
              { value: "radial", label: "Radial" },
            ]}
            value={gradient.type}
            onChange={(type) => onChange({ gradient: { ...gradient, type } })}
          />
          {gradient.type === "linear" ? (
            <SliderRow
              label="Angle"
              value={gradient.rotation}
              min={0}
              max={360}
              step={15}
              format={(v) => `${v}°`}
              onChange={(rotation) => onChange({ gradient: { ...gradient, rotation } })}
            />
          ) : null}
        </Section>
      ) : null}
      <Section title="Background">
        <ColorRow
          label="Background"
          colors={paperColors}
          value={style.bg}
          onChange={(bg) => onChange({ bg, transparent: false })}
        />
      </Section>
      <div className="grid gap-3">
        <SwitchRow
          label="Gradient"
          checked={!!gradient}
          onChange={(on) =>
            onChange({ gradient: on ? { type: "linear", to: "#6d28d9", rotation: 45 } : null })
          }
        />
        <SwitchRow
          label="Transparent background"
          checked={style.transparent}
          onChange={(transparent) => onChange({ transparent })}
        />
      </div>
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full items-center gap-1.5 text-[13px] font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground">
          More options
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className="size-4 transition-transform group-data-panel-open:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="grid gap-5 pt-4">
          <SliderRow
            label="Margin"
            value={style.margin}
            min={0}
            max={8}
            step={1}
            format={(v) => `${v}`}
            onChange={(margin) => onChange({ margin })}
          />
          <div className="grid gap-2.5">
            <div className="flex items-center justify-between">
              <Label>Error correction</Label>
              <span className="text-[12px] text-subtle">
                {style.logo ? "High while a logo is added" : "Higher survives more damage"}
              </span>
            </div>
            <Segmented
              label="Error correction"
              options={eclOptions}
              value={style.logo ? "H" : style.ecl}
              disabled={!!style.logo}
              onChange={(ecl) => onChange({ ecl })}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
