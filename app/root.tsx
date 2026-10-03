import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { Toaster } from "~/components/ui/sonner";
import type { Route } from "./+types/root";
import "./app.css";
import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";

const UMAMI_WEBSITE_ID = "ace11889-30b8-4605-932c-83a36dc81742";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: interLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.webmanifest" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f7f8" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#08090a" />
        <Meta />
        <Links />
        {/* Hash and query hold the QR contents, so they are excluded to keep that data on the device */}
        <script
          defer
          src="https://stats.mshl.me/c.js"
          data-website-id={UMAMI_WEBSITE_ID}
          data-domains="qr.mshl.me"
          data-exclude-hash="true"
          data-exclude-search="true"
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => console.error(error));
    }
  }, []);
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message =
    isRouteErrorResponse(error) && error.status === 404 ? "Page not found" : "Something went wrong";
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="grid gap-3">
        <h1 className="text-xl font-semibold tracking-tight">{message}</h1>
        <a
          href="/"
          className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to the generator
        </a>
      </div>
    </main>
  );
}
