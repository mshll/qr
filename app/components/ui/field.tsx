import { useId, type ComponentProps } from "react";
import { DownRegular } from "@mingcute/react/core-regular";
import type { IconProps } from "@mingcute/react";

import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

const control =
  "w-full min-w-0 bg-transparent px-4 text-[16px] outline-none placeholder:text-muted-foreground";

export function FieldGroup({ className, ...props }: ComponentProps<"div">): React.ReactNode {
  return (
    <div
      className={cn("overflow-hidden rounded-xl bg-field [&>*+*]:border-t", className)}
      {...props}
    />
  );
}

type FieldInputProps = Omit<ComponentProps<"input">, "onChange" | "value" | "placeholder"> & {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

export function FieldInput({
  label,
  value,
  onValueChange,
  className,
  ...props
}: FieldInputProps): React.ReactNode {
  return (
    <input
      aria-label={label}
      placeholder={label}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(control, "h-12", className)}
      {...props}
    />
  );
}

export function FieldTextarea({
  label,
  value,
  onValueChange,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}): React.ReactNode {
  return (
    <textarea
      aria-label={label}
      placeholder={label}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        control,
        "field-sizing-content block max-h-72 min-h-24 resize-none py-3 leading-snug",
        className,
      )}
    />
  );
}

export function FieldRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 pl-4">
      <label htmlFor={htmlFor} className="shrink-0 text-[16px]">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FieldSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}): React.ReactNode {
  const id = useId();
  return (
    <FieldRow label={label} htmlFor={id}>
      <Switch id={id} checked={checked} onCheckedChange={onChange} className="mr-4" />
    </FieldRow>
  );
}

export function FieldSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}): React.ReactNode {
  const id = useId();
  return (
    <FieldRow label={label} htmlFor={id}>
      <span className="relative flex items-center text-muted-foreground">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="h-12 appearance-none bg-transparent pr-10 pl-4 text-right text-[16px] outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <DownRegular className="pointer-events-none absolute right-4 size-4" />
      </span>
    </FieldRow>
  );
}

export function FieldDate({
  label,
  value,
  onValueChange,
  ...props
}: Omit<FieldInputProps, "aria-label">): React.ReactNode {
  const id = useId();
  return (
    <FieldRow label={label} htmlFor={id}>
      <input
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-12 min-w-0 appearance-none bg-transparent pr-4 text-right text-[16px] text-muted-foreground outline-none"
        {...props}
      />
    </FieldRow>
  );
}

export function FieldButton({
  icon: Glyph,
  children,
  className,
  ...props
}: ComponentProps<"button"> & { icon?: React.ComponentType<IconProps> }): React.ReactNode {
  return (
    <button
      type="button"
      className={cn(
        "flex h-12 w-full items-center gap-3 px-4 text-left text-[16px] transition-colors hover:bg-hover disabled:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {Glyph ? <Glyph className="size-5 shrink-0" /> : null}
      {children}
    </button>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }): React.ReactNode {
  return <h3 className="mb-2 text-[13px] text-muted-foreground">{children}</h3>;
}
