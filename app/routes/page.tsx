import { useLocation } from "react-router";

import { QrApp } from "~/components/qr-app";
import { SiteFooter } from "~/components/site-footer";
import { pageByPath, pages } from "~/content/pages";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/page";

function findPage(pathname: string) {
  return pageByPath.get(pathname.replace(/(.)\/$/, "$1")) ?? pages[0];
}

export function meta({ location }: Route.MetaArgs) {
  return pageMeta(findPage(location.pathname));
}

export default function Page() {
  const page = findPage(useLocation().pathname);
  return (
    <>
      <QrApp
        key={page.path}
        initialType={page.type}
        openLogo={page.openLogo}
        heading={page.h1}
        lead={page.lead}
      >
        <section aria-labelledby="faq" className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
          <h2 id="faq" className="mb-3 text-[13px] font-medium text-muted-foreground">
            Questions
          </h2>
          <div className="divide-y border-y">
            {page.faqs.map((faq) => (
              <details key={faq.q} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-[14px] font-medium rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                  {faq.q}
                  <span
                    aria-hidden
                    className="text-subtle transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-4 text-[14px] leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </QrApp>
      <SiteFooter />
    </>
  );
}
