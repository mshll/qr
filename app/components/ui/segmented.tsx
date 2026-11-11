import { cn } from "~/lib/utils";

interface SegmentedProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  size?: "sm" | "lg";
  as?: "radio" | "tab";
  className?: string;
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
  size = "sm",
  as = "radio",
  className,
}: SegmentedProps<T>): React.ReactNode {
  const index = options.findIndex((option) => option.value === value);
  const selectedAttr = as === "tab" ? "aria-selected" : "aria-checked";
  return (
    <div
      role={as === "tab" ? "tablist" : "radiogroup"}
      aria-label={label}
      className={cn(
        "relative grid auto-cols-fr grid-flow-col rounded-[10px] bg-[color-mix(in_srgb,var(--fg)_6%,transparent)] p-0.5",
        size === "lg" && "rounded-xl p-1",
        disabled && "opacity-40",
        className,
      )}
    >
      {index >= 0 ? (
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 bottom-0.5 left-0.5 rounded-lg bg-background shadow-[0_1px_3px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out dark:bg-[#2a2a2a]",
            size === "lg" && "top-1 bottom-1 left-1 rounded-[9px]",
          )}
          style={{
            width: `calc((100% - ${size === "lg" ? 8 : 4}px) / ${options.length})`,
            transform: `translateX(${index * 100}%)`,
          }}
        />
      ) : null}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role={as}
          {...{ [selectedAttr]: option.value === value }}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative h-8 rounded-lg text-[14px] text-muted-foreground transition-colors duration-200 hover:text-foreground",
            size === "lg" && "h-9 text-[15px]",
            option.value === value && "font-medium text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
