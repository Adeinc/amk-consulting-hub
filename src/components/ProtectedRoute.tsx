import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { RouteLoading } from "./RouteLoading";

export function ProtectedRoute({ children, requireRole }: { children: ReactNode; requireRole?: "admin" }) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <RouteLoading />;

  if (!session) {
    return <Navigate to={`/sign-in?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireRole && profile && profile.role !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
