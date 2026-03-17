import { Navigate, useLocation } from "react-router-dom";

import { canAccess, getModuleForPath } from "../../config/permissions";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const role = user?.role || "Operator";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const module = getModuleForPath(location.pathname);
  if (!canAccess(role, module)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
