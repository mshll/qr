import type { Config } from "@react-router/dev/config";

import { pages } from "./app/content/pages";

export default {
  ssr: false,
  prerender: pages.map((page) => page.path),
} satisfies Config;
