import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircleRegular } from "@mingcute/react/core-regular";
import { toast } from "sonner";

import { ExportButton, type ExportAction } from "~/components/export-button";
import { RecentList } from "~/components/recent-list";
import { TypeForm } from "~/components/type-forms";
import { TypePicker, typeOrder } from "~/components/type-picker";
import { Segmented } from "~/components/ui/segmented";
import { useQrCode } from "~/hooks/use-qr-code";
import { track } from "~/lib/analytics";
import { downloadBlob, toCanvas, toPngBlob, toSvgString } from "~/lib/export";
import { contrastWarning } from "~/lib/qr/contrast";
import { encode } from "~/lib/qr/encode";
import { iconDataUrl } from "~/lib/qr/icons";
import { toOptions, type QrStyle } from "~/lib/qr/style";
import type { QrData, QrType } from "~/lib/qr/types";
import { clearRecent, loadRecent, saveRecent, type RecentItem } from "~/lib/recent";
import { describe, filenameFor, fromHash, initialState, toHash, type QrState } from "~/lib/state";
import { cn } from "~/lib/utils";

// Panels pull in the icon sets and render dozens of shape swatches, so they load on first open
const ShapePanel = lazy(() =>
  import("~/components/shape-panel").then((module) => ({ default: module.ShapePanel })),
);
const ColorPanel = lazy(() =>
  import("~/components/color-panel").then((module) => ({ default: module.ColorPanel })),
);
const LogoPanel = lazy(() =>
  import("~/components/logo-panel").then((module) => ({ default: module.LogoPanel })),
);
const panels = { shape: ShapePanel, color: ColorPanel, logo: LogoPanel };

type Tab = "content" | keyof typeof panels;

const tabs: { value: Tab; label: string }[] = [
  { value: "content", label: "Content" },
  { value: "shape", label: "Shape" },
  { value: "color", label: "Color" },
  { value: "logo", label: "Logo" },
];

const PLACEHOLDER = "https://qr.mshl.me";

type ScanStatus = "idle" | "ok" | "fail";

async function composeOnWhite(canvas: HTMLCanvasElement) {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  return ctx.getImageData(0, 0, out.width, out.height);
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

function PanelFallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-field" />;
}

interface QrAppProps {
  initialType: QrType;
}

export function QrApp({ initialType }: QrAppProps): React.ReactNode {
  const [state, setState] = useState<QrState>(() => initialState(initialType));
  const [tab, setTab] = useState<{ value: Tab; direction: number }>({
    value: "content",
    direction: 0,
  });
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [canShare, setCanShare] = useState(false);
  const [scan, setScan] = useState<ScanStatus>("idle");

  const payload = encode(state.type, state.data[state.type]);
  const logoSrc =
    state.style.logo?.kind === "icon"
      ? iconDataUrl(state.style.logo.id, state.style.fg, state.style.brandColor)
      : state.style.logo?.src;
  const options = useMemo(
    () => toOptions(payload || PLACEHOLDER, state.style, logoSrc),
    [payload, state.style, logoSrc],
  );
  const { containerRef, qrRef } = useQrCode(options);
  const contrast = payload ? contrastWarning(state.style) : null;
  const status =
    scan === "fail" ? (contrast ?? "May not scan") : scan === "ok" ? (contrast ?? "Scans") : null;

  const setType = useCallback((type: QrType) => {
    setState((s) => (s.type === type ? s : { ...s, type }));
    track("type_switch", { type });
  }, []);
  const setData = <K extends QrType>(type: K, value: QrData[K]) =>
    setState((s) => ({ ...s, data: { ...s.data, [type]: value } }));
  const setStyle = (patch: Partial<QrStyle>) =>
    setState((s) => ({ ...s, style: { ...s.style, ...patch } }));

  const switchTab = (value: Tab) => {
    const index = (t: Tab) => tabs.findIndex((option) => option.value === t);
    setTab((current) => ({ value, direction: Math.sign(index(value) - index(current.value)) }));
  };

  useEffect(() => {
    const restored = fromHash(window.location.hash);
    if (restored) setState(restored);
    loadRecent().then(setRecent, (error) => console.error(error));
    const probe = new File([""], "qr.png", { type: "image/png" });
    setCanShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
  }, []);

  useEffect(() => {
    const url = payload || state.style.logo ? `#${toHash(state)}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [state, payload]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      const type = typeOrder[Number(event.key) - 1];
      if (type) setType(type);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setType]);

  useEffect(() => {
    if (!payload) {
      setScan("idle");
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const qr = qrRef.current;
      if (!qr) return;
      try {
        const image = await composeOnWhite(await toCanvas(qr, 480));
        const { decode } = await import("~/lib/scan");
        const text = await decode(image);
        if (!cancelled) setScan(text === payload ? "ok" : "fail");
      } catch (error) {
        console.error(error);
        if (!cancelled) setScan("idle");
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [options, payload, qrRef]);

  const runExport = async (action: ExportAction): Promise<boolean> => {
    const qr = qrRef.current;
    if (!qr || !payload) return false;
    const name = filenameFor(state);
    try {
      switch (action.kind) {
        case "png":
          downloadBlob(await toPngBlob(qr, action.size), `${name}.png`);
          break;
        case "svg":
          downloadBlob(new Blob([await toSvgString(qr)], { type: "image/svg+xml" }), `${name}.svg`);
          break;
        case "copy":
          await navigator.clipboard.write([new ClipboardItem({ "image/png": toPngBlob(qr) })]);
          toast.success("Image copied");
          break;
        case "share": {
          const file = new File([await toPngBlob(qr)], `${name}.png`, { type: "image/png" });
          await navigator.share({ files: [file], title: describe(state) || "QR code" });
          break;
        }
        case "link":
          await navigator.clipboard.writeText(window.location.href);
          toast.success(
            state.type === "wifi" ? "Link copied, without the password" : "Link copied",
          );
          track("export", { format: "link", type: state.type });
          return true;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return false;
      console.error(error);
      toast.error(
        action.kind === "copy" || action.kind === "link" ? "Couldn't copy" : "Export failed",
      );
      return false;
    }
    track("export", {
      format: action.kind === "png" ? `png-${action.size}` : action.kind,
      type: state.type,
    });
    toSvgString(qr)
      .then((svg) => saveRecent({ label: describe(state), payload, state, svg }))
      .then(setRecent, (error) => console.error(error));
    return true;
  };

  const restore = (item: RecentItem) => {
    setState(item.state);
    window.scrollTo({ top: 0, behavior: "smooth" });
    track("recent_restored", { type: item.state.type });
  };
  const clear = () =>
    clearRecent().then(
      () => setRecent([]),
      (error) => console.error(error),
    );

  const exportButton = (
    <ExportButton disabled={!payload} canShare={canShare} onExport={runExport} />
  );
  const ActivePanel = tab.value === "content" ? null : panels[tab.value];

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-12 lg:px-8 lg:pt-4">
      <section
        aria-label="Preview"
        className="animate-in duration-500 fade-in slide-in-from-bottom-2 lg:sticky lg:top-6"
      >
        <div className="relative grid place-items-center rounded-[22px] bg-field py-7 lg:aspect-square lg:py-0">
          <div
            className={cn(
              "aspect-square w-[min(208px,27dvh)] overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.18)] transition-[opacity,scale] duration-500 ease-out lg:w-[320px]",
              !payload && "scale-[0.96] opacity-15 shadow-none",
              state.style.transparent &&
                "bg-[repeating-conic-gradient(#e5e5e5_0_25%,#fff_0_50%)] bg-size-[16px_16px]",
            )}
          >
            <div ref={containerRef} className="size-full [&>svg]:size-full" />
          </div>
          <p
            aria-live="polite"
            className="absolute inset-x-4 bottom-1.5 flex justify-center text-[12px] leading-4 lg:bottom-5 lg:text-[13px]"
          >
            {status ? (
              <span
                key={status}
                className={cn(
                  "flex animate-in items-center gap-1 duration-300 fade-in",
                  scan === "fail" ? "text-danger" : "text-muted-foreground",
                )}
              >
                {status === "Scans" ? <CheckCircleRegular className="size-3.5" /> : null}
                {status}
              </span>
            ) : null}
          </p>
        </div>
        <div className="mt-3 max-lg:hidden">{exportButton}</div>
      </section>

      <div className="mt-5 animate-in duration-500 fade-in slide-in-from-bottom-2 lg:mt-0 lg:flex lg:h-0 lg:min-h-full lg:flex-col">
        <div className="sticky top-0 z-20 -mx-4 bg-background px-4 pb-4 lg:static lg:mx-0 lg:px-0 lg:pb-5">
          <Segmented
            as="tab"
            size="lg"
            label="Sections"
            options={tabs}
            value={tab.value}
            onChange={switchTab}
          />
        </div>
        <div
          key={tab.value}
          role="tabpanel"
          aria-label={tabs.find((option) => option.value === tab.value)?.label}
          className={cn(
            "animate-in duration-300 ease-out fade-in lg:-mx-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:px-1 lg:pb-8 lg:no-scrollbar lg:mask-[linear-gradient(to_bottom,#000_calc(100%-32px),transparent)]",
            tab.direction > 0 && "slide-in-from-right-4",
            tab.direction < 0 && "slide-in-from-left-4",
          )}
        >
          {ActivePanel ? (
            <Suspense fallback={<PanelFallback />}>
              <ActivePanel style={state.style} onChange={setStyle} />
            </Suspense>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-3">
                <TypePicker value={state.type} onChange={setType} />
                <div
                  key={state.type}
                  className="animate-in duration-300 fade-in slide-in-from-bottom-1"
                >
                  <TypeForm type={state.type} data={state.data} onChange={setData} />
                </div>
              </div>
              <RecentList items={recent} onRestore={restore} onClear={clear} />
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-linear-to-t from-background from-65% to-transparent px-4 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden">
        {exportButton}
      </div>
    </div>
  );
}
