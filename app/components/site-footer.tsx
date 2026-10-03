import { BrandMark } from "~/components/brand-mark";
import { pages } from "~/content/pages";

export function SiteFooter(): React.ReactNode {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pt-8 pb-32 text-[13px] sm:px-6 lg:pb-10">
        <nav aria-label="QR code generators">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {pages
              .filter((page) => page.path !== "/")
              .map((page) => (
                <li key={page.path}>
                  <a
                    href={page.path}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {page.h1}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3 text-subtle">
          <a href="/" className="flex items-center gap-2 font-medium text-muted-foreground">
            <BrandMark className="size-3.5" />
            QR
          </a>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <p>Free forever. Your data never leaves your browser.</p>
            <p>
              Crafted by{" "}
              <a
                href="https://meshal.me"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                meshal.me
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
