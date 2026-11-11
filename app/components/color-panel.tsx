import type { PanelProps } from "~/components/shape-panel";
import { FieldGroup, FieldLabel, FieldSwitch } from "~/components/ui/field";
import { Segmented } from "~/components/ui/segmented";
import { Slider } from "~/components/ui/slider";
import { inkColors, paperColors } from "~/lib/qr/style";
import { cn } from "~/lib/utils";

export const CHECKER = "repeating-conic-gradient(#d4d4d4 0 25%, #fff 0 50%) 50% / 10px 10px";
const swatch =
  "press relative size-9 shrink-0 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--fg)_14%,transparent)] aria-checked:ring-2 aria-checked:ring-foreground aria-checked:ring-offset-2 aria-checked:ring-offset-background";

function Swatches({
  label,
  colors,
  value,
  onChange,
  transparent,
}: {
  label: string;
  colors: string[];
  value: string | null;
  onChange: (color: string) => void;
  transparent?: { checked: boolean; onPick: () => void };
}) {
  const custom = value !== null && !colors.includes(value);
  return (
    <section>
      <FieldLabel>{label}</FieldLabel>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2.5 p-1">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={value === color}
            aria-label={color}
            onClick={() => onChange(color)}
            className={swatch}
            style={{ background: color }}
          />
        ))}
        {transparent ? (
          <button
            type="button"
            role="radio"
            aria-checked={transparent.checked}
            aria-label="Transparent"
            onClick={transparent.onPick}
            className={swatch}
            style={{ background: CHECKER }}
          />
        ) : null}
        <label
          data-checked={custom || undefined}
          className={cn(
            swatch,
            "data-checked:ring-2 data-checked:ring-foreground data-checked:ring-offset-2 data-checked:ring-offset-background",
            "cursor-pointer bg-[conic-gradient(#f43f5e,#f59e0b,#84cc16,#06b6d4,#6366f1,#d946ef,#f43f5e)] has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground",
          )}
        >
          {custom ? (
            <span className="absolute inset-[7px] rounded-full" style={{ background: value }} />
          ) : null}
          <input
            type="color"
            aria-label={`Custom ${label.toLowerCase()} color`}
            value={value ?? "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </section>
  );
}

export function ColorPanel({ style, onChange }: PanelProps): React.ReactNode {
  const gradient = style.gradient;
  return (
    <div className="grid grid-cols-1 gap-6">
      <Swatches
        label="Code"
        colors={inkColors}
        value={style.fg}
        onChange={(fg) => onChange({ fg })}
      />
      <Swatches
        label="Background"
        colors={paperColors}
        value={style.transparent ? null : style.bg}
        onChange={(bg) => onChange({ bg, transparent: false })}
        transparent={{ checked: style.transparent, onPick: () => onChange({ transparent: true }) }}
      />
      <div className="grid grid-cols-1 gap-6">
        <FieldGroup>
          <FieldSwitch
            label="Gradient"
            checked={!!gradient}
            onChange={(on) =>
              onChange({ gradient: on ? { type: "linear", to: "#6d28d9", rotation: 45 } : null })
            }
          />
          {gradient ? (
            <div className="grid gap-3 px-4 py-3">
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
                <Slider
                  aria-label="Angle"
                  value={gradient.rotation}
                  min={0}
                  max={360}
                  step={15}
                  onValueChange={(v) =>
                    onChange({ gradient: { ...gradient, rotation: Array.isArray(v) ? v[0] : v } })
                  }
                />
              ) : null}
            </div>
          ) : null}
        </FieldGroup>
        {gradient ? (
          <Swatches
            label="Gradient end"
            colors={inkColors}
            value={gradient.to}
            onChange={(to) => onChange({ gradient: { ...gradient, to } })}
          />
        ) : null}
      </div>
    </div>
  );
}
