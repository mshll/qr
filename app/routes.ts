import { index, route, type RouteConfig } from "@react-router/dev/routes";

import { pages } from "./content/pages";

export default [
  ...pages.map((page) =>
    page.path === "/"
      ? index("routes/page.tsx", { id: "home" })
      : route(page.path.slice(1), "routes/page.tsx", { id: page.path.slice(1) }),
  ),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
