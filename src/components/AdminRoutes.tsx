
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const AdminRoutes = () => {
  const { isLoggedIn, userRole } = useAuth();

  useEffect(() => {
    if (isLoggedIn && userRole !== 'admin') {
      toast({
        title: "Unauthorized Access",
        description: "You do not have permission to access the admin dashboard",
        variant: "destructive"
      });
    }
  }, [isLoggedIn, userRole]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminRoutes;
