import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

function Slider({ className, "aria-label": ariaLabel, ...props }: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      className={cn("w-full", className)}
      data-slot="slider"
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex h-6 w-full touch-none items-center select-none">
        <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-[color-mix(in_srgb,var(--fg)_12%,transparent)]">
          <SliderPrimitive.Indicator className="rounded-full bg-foreground" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={ariaLabel}
          className="relative block size-6 rounded-full bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.18)] transition-transform duration-150 ease-out after:absolute after:-inset-2 active:scale-110"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
