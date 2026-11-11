import { AddRegular } from "@mingcute/react/core-regular";

import { pages, type PageContent } from "~/content/pages";

const summary = "flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden";

export function SiteFooter({ page }: { page: PageContent }): React.ReactNode {
  return (
    <footer className="relative mx-auto w-full max-w-[960px] px-4 pt-16 pb-32 lg:px-8 lg:pt-6 lg:pb-8">
      <details className="group/about">
        <summary
          className={`${summary} -ml-2 w-fit gap-1 rounded-lg px-2 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground`}
        >
          About
          <AddRegular className="size-3.5 transition-transform duration-300 ease-out group-open/about:rotate-45" />
        </summary>
        <div className="max-w-xl pt-8">
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">{page.h1}</h1>
          <p className="mt-1 text-pretty text-muted-foreground">{page.lead}</p>
          <div className="mt-6 border-t">
            {page.faqs.map((faq) => (
              <details key={faq.q} className="group border-b">
                <summary className={`${summary} justify-between gap-4 py-4 font-medium`}>
                  {faq.q}
                  <AddRegular className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-45" />
                </summary>
                <p className="-mt-1 pb-4 text-pretty text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
          <nav aria-label="QR code generators" className="mt-8">
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px]">
              {pages
                .filter((other) => other.path !== "/")
                .map((other) => (
                  <li key={other.path}>
                    <a
                      href={other.path}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {other.h1}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </details>
      <a
        href="https://meshal.me"
        className="absolute top-[calc(4rem-6px)] right-4 flex h-10 items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground lg:top-[calc(1.5rem-6px)] lg:right-8"
      >
        Crafted by
        <svg viewBox="0 0 870 870" aria-label="Meshal Almutairi" className="size-4 fill-current">
          <path d="M0 89 435 499 870 89V372L435 782 0 372ZM0 500 299 782H0ZM870 500V782H571Z" />
        </svg>
      </a>
    </footer>
  );
}
