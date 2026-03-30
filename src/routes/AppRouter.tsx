import type { ReactElement, ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "@/pages/common/NotFound";
import PrivateRoute from "@/routes/guards/PrivateRoute";
import PublicRoute from "@/routes/guards/PublicRoute";
import { loadAppRoutes, type AppRoute, type LayoutComponent } from "@/routes/routeLoader";

const DefaultLayout: LayoutComponent = ({ children }) => <>{children}</>;

const UnauthorizedPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-muted px-4">
    <div className="w-full max-w-md rounded-lg border bg-background p-6 text-center">
      <h1 className="text-2xl font-semibold">Unauthorized</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You do not have permission to access this page.
      </p>
    </div>
  </div>
);

function applyLayout(route: AppRoute): ReactElement {
  const Layout = route?.component?.layout ?? DefaultLayout;
  return (
    <Layout>
      <route.component />
    </Layout>
  );
}

function withGuard(route: AppRoute, content: ReactNode): ReactNode {
  if (route?.type === "protected") return <PrivateRoute>{content}</PrivateRoute>;
  if (route?.type === "public" && route?.guestOnly) {
    return <PublicRoute>{content}</PublicRoute>;
  }
  return content;
}

const AppRouter = () => {
  const routes = loadAppRoutes();

  return (
    <Routes>
      {routes?.map((route) => {
        const page = applyLayout(route);
        const guarded = withGuard(route, page);
        return <Route key={`${route?.type}:${route?.path}`} path={route?.path} element={guarded} />;
      })}

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
