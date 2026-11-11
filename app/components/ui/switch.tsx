import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 data-checked:bg-foreground data-unchecked:bg-[color-mix(in_srgb,var(--fg)_14%,transparent)] data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out data-checked:translate-x-[18px] dark:data-checked:bg-background" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
