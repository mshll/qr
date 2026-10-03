import { BrandMark } from "~/components/brand-mark";
import { Button } from "~/components/ui/button";

export function meta() {
  return [{ title: "Page not found · QR" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="grid justify-items-center gap-4">
        <BrandMark className="size-8" />
        <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">This page doesn't exist. The generator does.</p>
        <Button render={<a href="/" />} nativeButton={false}>
          Make a QR code
        </Button>
      </div>
    </main>
  );
}
