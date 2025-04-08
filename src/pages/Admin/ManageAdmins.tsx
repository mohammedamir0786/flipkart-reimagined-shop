
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, UserX, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import AdminUserModal from "@/components/AdminUserModal";

// Mock data for admin users
const mockAdmins = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    role: "Super Admin", 
    status: "Active" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "Product Manager", 
    status: "Active" 
  },
  { 
    id: 3, 
    name: "Robert Johnson", 
    email: "robert@example.com", 
    role: "Order Manager", 
    status: "Inactive" 
  },
  { 
    id: 4, 
    name: "Emily Davis", 
    email: "emily@example.com", 
    role: "Super Admin", 
    status: "Active" 
  },
];

// Interface for admin user type
interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const ManageAdmins = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  
  // Fetch admin users
  const { data: admins = mockAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      // In a real application, we would fetch from an API
      // const response = await fetch('/api/admins');
      // return await response.json();
      
      // For now, return mock data
      return mockAdmins;
    },
  });

  const handleAddAdmin = () => {
    setCurrentAdmin(null); // Reset current admin for "add" mode
    setIsModalOpen(true);
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setCurrentAdmin(admin); // Set current admin for "edit" mode
    setIsModalOpen(true);
  };

  const handleToggleStatus = (admin: AdminUser) => {
    const newStatus = admin.status === "Active" ? "Inactive" : "Active";
    const action = newStatus === "Active" ? "activated" : "deactivated";
    
    // In a real application, we would call API to update status
    // fetch(`/api/admins/${admin.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...admin, status: newStatus })
    // })

    toast({
      title: `Admin ${action}`,
      description: `${admin.name} has been ${action}.`,
      variant: admin.status === "Active" ? "destructive" : "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Users</h1>
          <p className="text-gray-500">Manage admin access and permissions</p>
        </div>
        <Button onClick={handleAddAdmin} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Admin
        </Button>
      </div>
      
      {/* Admin users table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {admin.role === "Super Admin" ? (
                    <Badge variant="info" className="font-normal">
                      {admin.role}
                    </Badge>
                  ) : (
                    admin.role
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={admin.status === "Active" ? "success" : "warning"}
                    className="font-normal"
                  >
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditAdmin(admin)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit admin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleToggleStatus(admin)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {admin.status === "Active" ? "Deactivate admin" : "Activate admin"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdminUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admin={currentAdmin}
      />
    </div>
  );
};

export default ManageAdmins;
