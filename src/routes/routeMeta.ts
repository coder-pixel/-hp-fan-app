import type { ComponentType, ReactNode } from "react";

export type RouteType = "public" | "protected" | "common";

export type LayoutComponent = ComponentType<{ children: ReactNode }>;

export type RouteMeta = {
  layout?: LayoutComponent;
  auth?: RouteType;
  routePath?: string;
  guestOnly?: boolean;
};

export type RoutableComponent<TProps = object> = ComponentType<TProps> &
  RouteMeta;

/**
 * Attaches typed route metadata to a page component.
 * Keeps page implementation decoupled from router internals.
 */
export function withRouteMeta<T extends ComponentType<object>>(
  component: T,
  meta: RouteMeta,
): T & RouteMeta {
  return Object.assign(component, meta);
}
