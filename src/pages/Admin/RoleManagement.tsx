
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import RoleModal from "@/components/RoleModal";
import { toast } from "@/hooks/use-toast";

// Mock data for roles
const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all features",
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      products: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: true, edit: true, delete: true },
      reviews: { view: true, create: true, edit: true, delete: true },
      analytics: { view: true, create: true, edit: true, delete: true },
      admins: { view: true, create: true, edit: true, delete: true },
    }
  },
  {
    id: 2,
    name: "Product Manager",
    description: "Manage products and inventory",
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      products: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: false, edit: false, delete: false },
      reviews: { view: true, create: false, edit: true, delete: true },
      analytics: { view: true, create: false, edit: false, delete: false },
      admins: { view: false, create: false, edit: false, delete: false },
    }
  },
  {
    id: 3,
    name: "Order Manager",
    description: "Handle order processing and customer support",
    permissions: {
      users: { view: true, create: false, edit: false, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      orders: { view: true, create: true, edit: true, delete: false },
      reviews: { view: true, create: false, edit: false, delete: false },
      analytics: { view: true, create: false, edit: false, delete: false },
      admins: { view: false, create: false, edit: false, delete: false },
    }
  },
  {
    id: 4,
    name: "Analytics Viewer",
    description: "View reports and analytics",
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      orders: { view: true, create: false, edit: false, delete: false },
      reviews: { view: false, create: false, edit: false, delete: false },
      analytics: { view: true, create: false, edit: false, delete: false },
      admins: { view: false, create: false, edit: false, delete: false },
    }
  },
];

// Define the Role and Permission types
export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: {
    users: Permission;
    products: Permission;
    orders: Permission;
    reviews: Permission;
    analytics: Permission;
    admins: Permission;
  };
}

const RoleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  // Fetch roles - would come from API in production
  const { data: roles = mockRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      // In a real app, you would fetch from API:
      // const response = await fetch('/api/roles');
      // return await response.json();
      
      // Using mock data for now
      return mockRoles;
    },
  });

  const handleAddRole = () => {
    setCurrentRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    // In a real app, you would call the API:
    // await fetch(`/api/roles/${role.id}`, { method: 'DELETE' });
    
    toast({
      title: "Role deleted",
      description: `${role.name} has been removed.`,
      variant: "success",
    });
  };

  const countPermissions = (role: Role) => {
    let totalPermissions = 0;
    let enabledPermissions = 0;

    // Count the total and enabled permissions
    Object.values(role.permissions).forEach((modulePermissions) => {
      Object.values(modulePermissions).forEach((hasPermission) => {
        totalPermissions++;
        if (hasPermission) enabledPermissions++;
      });
    });

    return { total: totalPermissions, enabled: enabledPermissions };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-gray-500">Manage admin roles and permissions</p>
        </div>
        <Button onClick={handleAddRole} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Role
        </Button>
      </div>

      {/* Roles table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => {
              const { total, enabled } = countPermissions(role);
              return (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Badge variant="info" className="font-normal">
                      {enabled}/{total} Permissions
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditRole(role)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRole(role)}
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      disabled={role.name === "Super Admin"} // Prevent deletion of Super Admin role
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={currentRole}
      />
    </div>
  );
};

export default RoleManagement;
