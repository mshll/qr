export function meta() {
  return [{ title: "Page not found · QR" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="grid justify-items-center gap-5">
        <h1 className="text-[17px] font-semibold">Page not found</h1>
        <a
          href="/"
          className="press grid h-12 place-items-center rounded-xl bg-foreground px-6 text-[16px] font-semibold text-background"
        >
          Make a QR code
        </a>
      </div>
    </main>
  );
}
