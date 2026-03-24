import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/settings", "routes/dashboard.settings.tsx"),
  route("dashboard/analytics", "routes/dashboard.analytics.tsx"),
  route("dashboard/links/new", "routes/dashboard.links.new.tsx"),
  route("dashboard/links/:linkId/edit", "routes/dashboard.links.$linkId.edit.tsx"),
  route("dashboard/links/:linkId/delete", "routes/dashboard.links.$linkId.delete.tsx"),
  route(":username", "routes/$username.tsx"),
] satisfies RouteConfig;
