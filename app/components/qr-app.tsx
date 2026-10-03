import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { BrandMark } from "~/components/brand-mark";
import { ExportButton, type ExportAction } from "~/components/export-button";
import { RecentList } from "~/components/recent-list";
import { TypeForm } from "~/components/type-forms";
import { TypePicker, typeOrder } from "~/components/type-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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

// Style and logo controls pull in the icon sets and shape swatches, so they load on first open
const StylePanel = lazy(() =>
  import("~/components/style-panel").then((module) => ({ default: module.StylePanel })),
);
const LogoPanel = lazy(() =>
  import("~/components/logo-panel").then((module) => ({ default: module.LogoPanel })),
);

const PLACEHOLDER = "https://qr.mshl.me";

type ScanStatus = "idle" | "checking" | "ok" | "fail";
type Tab = "content" | "style" | "logo" | "recent";

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

const scanLabels: Record<ScanStatus, string> = {
  idle: "Waiting for content",
  checking: "Checking",
  ok: "Scans",
  fail: "May not scan",
};

function ScanPill({ status }: { status: ScanStatus }) {
  return (
    <p
      aria-live="polite"
      className="flex h-7 items-center gap-2 rounded-full border bg-panel/80 px-3 text-[12px] text-muted-foreground backdrop-blur"
    >
      <span
        className={cn(
          "size-1.5 rounded-full bg-subtle",
          status === "ok" && "bg-lime",
          status === "fail" && "bg-warning",
          status === "checking" && "animate-pulse",
        )}
      />
      {scanLabels[status]}
    </p>
  );
}

function PanelFallback() {
  return <div className="h-80 animate-pulse rounded-lg bg-secondary/50" />;
}

interface QrAppProps {
  initialType: QrType;
  openLogo?: boolean;
  heading: string;
  lead: string;
  children?: React.ReactNode;
}

export function QrApp({
  initialType,
  openLogo = false,
  heading,
  lead,
  children,
}: QrAppProps): React.ReactNode {
  const [state, setState] = useState<QrState>(() => initialState(initialType));
  const [tab, setTab] = useState<Tab>(openLogo ? "logo" : "content");
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
  const warning = payload ? contrastWarning(state.style) : null;

  const setType = useCallback((type: QrType) => {
    setState((s) => (s.type === type ? s : { ...s, type }));
    setTab("content");
    track("type_switch", { type });
  }, []);
  const setData = <K extends QrType>(type: K, value: QrData[K]) =>
    setState((s) => ({ ...s, data: { ...s.data, [type]: value } }));
  const setStyle = (patch: Partial<QrStyle>) =>
    setState((s) => ({ ...s, style: { ...s.style, ...patch } }));

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
    setScan("checking");
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

  const runExport = async (action: ExportAction) => {
    const qr = qrRef.current;
    if (!qr || !payload) return;
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
            state.type === "wifi" ? "Link copied, without the WiFi password" : "Link copied",
          );
          track("export", { format: "link", type: state.type });
          return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error(error);
      toast.error(
        action.kind === "copy" || action.kind === "link" ? "Couldn't copy" : "Export failed",
      );
      return;
    }
    track("export", {
      format: action.kind === "png" ? `png-${action.size}` : action.kind,
      type: state.type,
    });
    const svg = await toSvgString(qr);
    saveRecent({ label: describe(state), payload, state, svg }).then(setRecent, (error) =>
      console.error(error),
    );
  };

  const restore = (item: RecentItem) => {
    setState(item.state);
    setTab("content");
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

  return (
    <>
      <header className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="/"
          className="flex items-center gap-2 rounded-md text-[15px] font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <BrandMark className="size-[18px]" />
          QR
        </a>
        <a
          href="https://github.com/mshll/qr"
          aria-label="Source on GitHub"
          className="grid size-8 place-items-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <HugeiconsIcon icon={GithubIcon} className="size-[18px]" />
        </a>
      </header>

      <main>
        <div className="mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:pb-16">
          <div className="pt-2 pb-5 lg:pt-8 lg:pb-8">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-balance sm:text-[28px]">
              {heading}
            </h1>
            <p className="mt-1.5 max-w-xl text-[14px] text-pretty text-muted-foreground sm:text-[15px]">
              {lead}
            </p>
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-6">
            <section
              aria-label="Preview"
              className="sticky top-0 z-20 -mx-4 grid gap-4 bg-background/85 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-6 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
            >
              <div className="canvas-grid relative grid place-items-center gap-3 rounded-2xl border bg-panel py-4 lg:min-h-[540px] lg:py-12">
                <div
                  className={cn(
                    "aspect-square w-[148px] overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-opacity sm:w-[200px] lg:w-[340px]",
                    !payload && "opacity-25",
                    state.style.transparent &&
                      "bg-[repeating-conic-gradient(#e5e5e5_0_25%,#fff_0_50%)] bg-size-[16px_16px]",
                  )}
                >
                  <div ref={containerRef} className="size-full [&>svg]:size-full" />
                </div>
                <div className="lg:absolute lg:bottom-3 lg:left-3">
                  <ScanPill status={scan} />
                </div>
                {warning ? (
                  <p className="absolute right-3 bottom-4 hidden max-w-[50%] text-right text-[12px] text-warning lg:block">
                    {warning}
                  </p>
                ) : null}
              </div>
              <div className="max-lg:hidden">
                <RecentList items={recent} onRestore={restore} onClear={clear} layout="strip" />
              </div>
            </section>

            <aside className="flex flex-col rounded-2xl border bg-panel lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)]">
              <Tabs
                value={tab}
                onValueChange={(value) => setTab(value as Tab)}
                className="min-h-0 flex-1 gap-0"
              >
                <div className="border-b p-2">
                  <TabsList className="h-9 w-full bg-secondary">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                    <TabsTrigger value="recent" className="lg:hidden">
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <TabsContent value="content" className="grid content-start gap-4">
                    <TypePicker value={state.type} onChange={setType} />
                    <TypeForm
                      key={state.type}
                      type={state.type}
                      data={state.data}
                      onChange={setData}
                    />
                  </TabsContent>
                  <TabsContent value="style">
                    <Suspense fallback={<PanelFallback />}>
                      <StylePanel style={state.style} onChange={setStyle} />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="logo">
                    <Suspense fallback={<PanelFallback />}>
                      <LogoPanel style={state.style} onChange={setStyle} />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="recent">
                    <RecentList items={recent} onRestore={restore} onClear={clear} layout="grid" />
                  </TabsContent>
                </div>
              </Tabs>
              <div className="border-t p-3 max-lg:hidden">{exportButton}</div>
            </aside>
          </div>
        </div>

        {children}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/85 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        {exportButton}
      </div>
    </>
  );
}
