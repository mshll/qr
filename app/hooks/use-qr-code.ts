import { useEffect, useId, useMemo, useRef } from "react";
import {
  QRCodeStyling,
  type Options,
  type Plugin,
  type RecursivePartial,
} from "@liquid-js/qr-code-styling";

// The library uses fixed ids like "mask-dot-color", so several codes on one page would share
// whichever clip path appears first in the document
function scopeIds(suffix: string): Plugin {
  return {
    postProcess: (svg) => {
      const ids = new Set<string>();
      for (const element of svg.querySelectorAll("[id]")) {
        if (element.id.endsWith(`-${suffix}`)) continue;
        ids.add(element.id);
        element.id = `${element.id}-${suffix}`;
      }
      for (const element of svg.querySelectorAll("*")) {
        for (const attr of element.attributes) {
          if (!attr.value.includes("#")) continue;
          attr.value = attr.value.replace(/#([\w-]+)/g, (match, id: string) =>
            ids.has(id) ? `#${id}-${suffix}` : match,
          );
        }
      }
    },
  };
}

export function useQrCode(options: RecursivePartial<Options>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const suffix = useId().replace(/[^a-zA-Z0-9]/g, "");
  const scoped = useMemo(
    () => ({ ...options, plugins: [...(options.plugins ?? []), scopeIds(suffix)] }),
    [options, suffix],
  );

  useEffect(() => {
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(scoped);
      qrRef.current.append(containerRef.current ?? undefined);
    } else {
      qrRef.current.update(scoped);
    }
  }, [scoped]);

  return { containerRef, qrRef };
}
