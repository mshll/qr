import { useLocation } from "react-router";
import { siGithub } from "simple-icons";

import { BrandMark } from "~/components/brand-mark";
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
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-14 w-full max-w-[960px] items-center justify-between px-4 lg:h-[72px] lg:px-8">
        <a
          href="/"
          className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em]"
        >
          <BrandMark className="size-[18px]" />
          QR
        </a>
        <a
          href="https://github.com/mshll/qr"
          aria-label="Source on GitHub"
          className="press -mr-2.5 grid size-10 place-items-center rounded-[10px] text-muted-foreground hover:bg-field hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
            <path d={siGithub.path} />
          </svg>
        </a>
      </header>
      <main className="flex flex-1 flex-col lg:justify-center lg:pb-10">
        <QrApp key={page.path} initialType={page.type} />
      </main>
      <SiteFooter page={page} />
    </div>
  );
}
