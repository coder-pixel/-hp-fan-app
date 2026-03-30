import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

type PublicRouteProps = {
  children: ReactNode;
  redirectTo?: string;
};

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm text-muted-foreground">Loading...</div>
    </div>
  );
}

const PublicRoute = ({ children, redirectTo = "/dashboard" }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
};

export default PublicRoute;
