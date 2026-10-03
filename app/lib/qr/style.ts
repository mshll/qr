import type {
  CornerDotType,
  Plugin,
  CornerSquareType,
  DotType,
  Options,
  RecursivePartial,
} from "@liquid-js/qr-code-styling";

export type ErrorLevel = "L" | "M" | "Q" | "H";

export type Logo = { kind: "icon"; id: string } | { kind: "upload"; src: string };

export interface QrStyle {
  dots: `${DotType}`;
  cornerSquare: `${CornerSquareType | DotType}`;
  cornerDot: `${CornerDotType | DotType}`;
  fg: string;
  bg: string;
  transparent: boolean;
  gradient: { type: "linear" | "radial"; to: string; rotation: number } | null;
  margin: number;
  ecl: ErrorLevel;
  logo: Logo | null;
  logoSize: number;
  brandColor: boolean;
}

export const defaultStyle: QrStyle = {
  dots: "square",
  cornerSquare: "square",
  cornerDot: "square",
  fg: "#000000",
  bg: "#ffffff",
  transparent: false,
  gradient: null,
  margin: 2,
  ecl: "M",
  logo: null,
  logoSize: 0.5,
  brandColor: false,
};

export const inkColors = [
  "#000000",
  "#1e293b",
  "#1d4ed8",
  "#6d28d9",
  "#be185d",
  "#c2410c",
  "#15803d",
  "#0f766e",
];
export const paperColors = ["#ffffff", "#f4f4f5", "#e0f2fe", "#fef9c3"];

export type PresetStyle = Pick<QrStyle, "dots" | "cornerSquare" | "cornerDot">;

export const presets: { id: string; label: string; style: PresetStyle }[] = [
  {
    id: "classic",
    label: "Classic",
    style: { dots: "square", cornerSquare: "square", cornerDot: "square" },
  },
  {
    id: "rounded",
    label: "Rounded",
    style: { dots: "rounded", cornerSquare: "extra-rounded", cornerDot: "dot" },
  },
  { id: "dots", label: "Dots", style: { dots: "dot", cornerSquare: "dot", cornerDot: "dot" } },
  {
    id: "classy",
    label: "Classy",
    style: { dots: "classy-rounded", cornerSquare: "classy", cornerDot: "classy" },
  },
  {
    id: "soft",
    label: "Soft",
    style: { dots: "soft", cornerSquare: "extra-rounded", cornerDot: "extra-rounded" },
  },
  {
    id: "fluid",
    label: "Fluid",
    style: { dots: "blobs", cornerSquare: "extra-rounded", cornerDot: "dot" },
  },
  {
    id: "lines",
    label: "Lines",
    style: { dots: "vertical-line", cornerSquare: "extra-rounded", cornerDot: "extra-rounded" },
  },
  {
    id: "sharp",
    label: "Sharp",
    style: { dots: "diamond", cornerSquare: "square", cornerDot: "diamond" },
  },
];

export function matchesPreset(style: QrStyle, preset: PresetStyle): boolean {
  return (
    style.dots === preset.dots &&
    style.cornerSquare === preset.cornerSquare &&
    style.cornerDot === preset.cornerDot
  );
}

export const dotTypes: `${DotType}`[] = [
  "square",
  "rounded",
  "extra-rounded",
  "dot",
  "random-dot",
  "classy",
  "classy-rounded",
  "soft",
  "blobs",
  "diamond",
  "star",
  "heart",
  "hexagon",
  "small-square",
  "vertical-line",
  "horizontal-line",
  "weave",
  "circuit",
];

export const cornerSquareTypes: `${CornerSquareType}`[] = [
  "square",
  "extra-rounded",
  "dot",
  "classy",
  "inpoint",
  "outpoint",
  "center-circle",
];

export const cornerDotTypes: `${CornerDotType}`[] = [
  "square",
  "dot",
  "extra-rounded",
  "classy",
  "inpoint",
  "outpoint",
  "diamond",
  "star",
  "heart",
];

export function effectiveEcl(style: QrStyle): ErrorLevel {
  return style.logo ? "H" : style.ecl;
}

export function toOptions(
  data: string,
  style: QrStyle,
  logoSrc: string | undefined,
): RecursivePartial<Options> {
  const gradient = style.gradient
    ? {
        type: style.gradient.type,
        rotation: (style.gradient.rotation * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: style.fg },
          { offset: 1, color: style.gradient.to },
        ],
      }
    : undefined;
  const ink = { color: style.fg, gradient };
  // Square modules drawn as separate rects show anti-aliased seams between neighbours
  const plugins: Plugin[] =
    style.dots === "square"
      ? [{ postProcess: (svg) => svg.setAttribute("shape-rendering", "crispEdges") }]
      : [];
  return {
    data,
    image: logoSrc,
    plugins,
    qrOptions: { errorCorrectionLevel: effectiveEcl(style) },
    imageOptions: {
      mode: "center",
      imageSize: style.logoSize,
      margin: 1,
      fill: { color: "rgba(0,0,0,0)" },
    },
    dotsOptions: { type: style.dots, ...ink },
    cornersSquareOptions: { type: style.cornerSquare, ...ink },
    cornersDotOptions: { type: style.cornerDot, ...ink },
    backgroundOptions: {
      color: style.transparent ? "rgba(0,0,0,0)" : style.bg,
      margin: style.margin,
    },
  };
}
