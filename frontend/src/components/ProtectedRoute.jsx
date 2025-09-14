import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES, USER_ROLES } from "../utils/constants";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== USER_ROLES.ADMIN) {
    return <Navigate to={ROUTES.TASKS} replace />;
  }

  return children;
};

export default ProtectedRoute;
