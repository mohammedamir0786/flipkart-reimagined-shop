
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminRoutes = () => {
  const { isLoggedIn } = useAuth();

  // In a real app, you would check for admin role here
  // For now, we'll just check if the user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminRoutes;
