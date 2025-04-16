import { ReactNode } from "react";
import { Menu, Package, BarChart2, Users, ShoppingBag, LogOut, UserCog, MessageSquare, IndianRupee, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const location = useLocation();
  const { hasPermission } = usePermissions();

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: BarChart2,
      requiredPermission: { module: "analytics", action: "view" }
    },
    { 
      name: "Products", 
      path: "/admin/products", 
      icon: Package,
      requiredPermission: { module: "products", action: "view" }
    },
    { 
      name: "Reviews", 
      path: "/admin/reviews", 
      icon: MessageSquare,
      requiredPermission: { module: "reviews", action: "view" }
    },
    { 
      name: "Users", 
      path: "/admin/users", 
      icon: Users,
      requiredPermission: { module: "users", action: "view" }
    },
    { 
      name: "Orders", 
      path: "/admin/orders", 
      icon: ShoppingBag,
      requiredPermission: { module: "orders", action: "view" }
    },
    { 
      name: "Admin Users", 
      path: "/admin/manage-admins", 
      icon: UserCog,
      requiredPermission: { module: "admins", action: "view" }
    },
    { 
      name: "Payment Analytics", 
      path: "/admin/payment-analytics", 
      icon: IndianRupee,
      requiredPermission: { module: "analytics", action: "view" }
    },
    { 
      name: "Role Management", 
      path: "/admin/role-management", 
      icon: Shield,
      requiredPermission: { module: "admins", action: "edit" } // Only admin editors can manage roles
    },
    { 
      name: "Order Heatmap", 
      path: "/admin/order-heatmap", 
      icon: BarChart2,
      requiredPermission: { module: "analytics", action: "view" }
    },
    { 
      name: "Return Requests", 
      path: "/admin/returns", 
      icon: Package,
      requiredPermission: { module: "returns", action: "view" }
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png" 
                 alt="Flipkart" className="h-6" />
            <span className="ml-2 font-bold text-flipkart-blue dark:text-blue-400">Admin</span>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              // Only show nav items the user has permission to access
              if (!hasPermission(item.requiredPermission.module, item.requiredPermission.action)) {
                return null;
              }
              
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center p-2 rounded-md transition-colors",
                      location.pathname === item.path 
                        ? "bg-flipkart-blue text-white dark:bg-blue-600"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center dark:border-gray-600 dark:text-gray-200" 
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
