
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

// Mock data for role permissions
const mockRolePermissions = {
  "Super Admin": {
    users: { view: true, create: true, edit: true, delete: true },
    products: { view: true, create: true, edit: true, delete: true },
    orders: { view: true, create: true, edit: true, delete: true },
    reviews: { view: true, create: true, edit: true, delete: true },
    analytics: { view: true, create: true, edit: true, delete: true },
    admins: { view: true, create: true, edit: true, delete: true },
  },
  "Product Manager": {
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, create: true, edit: true, delete: true },
    orders: { view: true, create: false, edit: false, delete: false },
    reviews: { view: true, create: false, edit: true, delete: true },
    analytics: { view: true, create: false, edit: false, delete: false },
    admins: { view: false, create: false, edit: false, delete: false },
  },
  "Order Manager": {
    users: { view: true, create: false, edit: false, delete: false },
    products: { view: true, create: false, edit: false, delete: false },
    orders: { view: true, create: true, edit: true, delete: false },
    reviews: { view: true, create: false, edit: false, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    admins: { view: false, create: false, edit: false, delete: false },
  },
};

export function usePermissions() {
  const { isLoggedIn, userRole } = useAuth();
  
  // In a real application, fetch the user's role permissions from an API
  const { data: permissions = {} } = useQuery({
    queryKey: ['rolePermissions', userRole],
    queryFn: async () => {
      // In a real app, fetch from API:
      // const response = await fetch(`/api/roles/${userRole}/permissions`);
      // return response.json();
      
      // For now, use mock data
      return mockRolePermissions[userRole as keyof typeof mockRolePermissions] || {};
    },
    enabled: !!userRole && isLoggedIn,
  });

  const hasPermission = (module: string, action: string) => {
    if (!isLoggedIn || !userRole) return false;
    
    // Super Admin has all permissions
    if (userRole === 'admin') return true;
    
    // Check if the user's role has the requested permission
    return permissions?.[module as keyof typeof permissions]?.[action as keyof typeof permissions[keyof typeof permissions]] || false;
  };

  return { hasPermission, permissions };
}
