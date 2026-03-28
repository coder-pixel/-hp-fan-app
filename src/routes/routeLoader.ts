import type {
  LayoutComponent,
  RouteType,
  RoutableComponent,
} from "@/routes/routeMeta";

export type { LayoutComponent, RouteType } from "@/routes/routeMeta";

export type PageComponent = RoutableComponent;

export type AppRoute = {
  path: string;
  component: PageComponent;
  type: RouteType;
  guestOnly?: boolean;
};

type ModuleMap = Record<string, { default: PageComponent }>;

const publicPages = import.meta.glob("/src/pages/public/**/*.tsx", {
  eager: true,
}) as ModuleMap;
const protectedPages = import.meta.glob("/src/pages/protected/**/*.tsx", {
  eager: true,
}) as ModuleMap;
const commonPages = import.meta.glob("/src/pages/common/**/*.tsx", {
  eager: true,
}) as ModuleMap;

const MODULE_SEGMENT_PATTERN = /(^|-)module$/i;
const INDEX_SEGMENT_PATTERN = /^index$/i;
const PAGE_SUFFIX_PATTERN = /Page$/;

function toKebabCase(value: string): string {
  return value
    ?.replace(PAGE_SUFFIX_PATTERN, "")
    ?.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    ?.replace(/_/g, "-")
    ?.toLowerCase();
}

function toRouteSegment(rawSegment: string): string {
  if (!rawSegment) return "";

  const dynamicMatch = rawSegment?.match(/^\[(.+)\]$/);
  if (dynamicMatch) return `:${dynamicMatch[1]}`;

  if (INDEX_SEGMENT_PATTERN?.test(rawSegment || "")) return "";

  return toKebabCase(rawSegment);
}

function pathFromFile(
  filePath: string,
  baseDir: "public" | "protected" | "common",
): string {
  const normalizedPath = filePath
    ?.replace("/src/pages/", "")
    ?.replace(`${baseDir}/`, "")
    ?.replace(/^\//, "")
    ?.replace(/\.tsx$/, "");

  const segments = normalizedPath?.split("/");
  const routeSegments = segments
    ?.filter((segment) => !MODULE_SEGMENT_PATTERN?.test(segment))
    ?.map(toRouteSegment)
    ?.filter(Boolean);

  if (!routeSegments?.length) return "/";
  return `/${routeSegments?.join("/")}`;
}

function getRouteType(
  baseType: "public" | "protected" | "common",
  component: PageComponent,
): RouteType {
  if (component?.auth === "public") return "public";
  if (component?.auth === "protected") return "protected";
  if (component?.auth === "common") return "common";
  return baseType;
}

function buildRoutes(
  modules: ModuleMap,
  baseType: "public" | "protected" | "common",
): AppRoute[] {
  return Object.entries(modules)
    ?.map(([filePath, module]) => {
      const component = module.default;
      if (!component) return null;

      const autoPath = pathFromFile(filePath, baseType);
      const path = component?.routePath ?? autoPath;
      const type = getRouteType(baseType, component);

      return {
        path,
        component,
        type,
        guestOnly: Boolean(component?.guestOnly),
      } satisfies AppRoute;
    })
    ?.filter((route) => Boolean(route)) as AppRoute[];
}

function dedupeByPath(routes: AppRoute[]): AppRoute[] {
  const routeMap = new Map<string, AppRoute>();
  routes?.forEach((route) => routeMap?.set(route?.path, route));
  return Array.from(routeMap?.values());
}

export function loadAppRoutes(): AppRoute[] {
  return dedupeByPath([
    ...buildRoutes(commonPages, "common"),
    ...buildRoutes(publicPages, "public"),
    ...buildRoutes(protectedPages, "protected"),
  ]);
}
