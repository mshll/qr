import { browserUtils, type QRCodeStyling } from "@liquid-js/qr-code-styling";

export async function toCanvas(qr: QRCodeStyling, size: number): Promise<HTMLCanvasElement> {
  const result = browserUtils?.drawToCanvas(qr, { width: size, height: size });
  if (!result) throw new Error("Canvas rendering is not available");
  await result.canvasDrawingPromise;
  return result.canvas;
}

export async function toPngBlob(qr: QRCodeStyling, size = 1024): Promise<Blob> {
  const canvas = await toCanvas(qr, size);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("PNG encoding failed"))),
      "image/png",
    ),
  );
}

export async function toSvgString(qr: QRCodeStyling): Promise<string> {
  const svg = await qr.serialize();
  if (!svg) throw new Error("SVG rendering failed");
  return svg;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
