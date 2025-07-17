import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface AuthGuardProps {
  role?: "patient" | "clinician";
  redirectTo?: string;
}

export const AuthGuard = ({ role, redirectTo = "/login" }: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
