
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import type { Role } from "@/pages/Admin/RoleManagement";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

// Module names for permissions
const modules = [
  { id: "users", name: "Users" },
  { id: "products", name: "Products" },
  { id: "orders", name: "Orders" },
  { id: "reviews", name: "Reviews" },
  { id: "analytics", name: "Analytics" },
  { id: "admins", name: "Admin Users" },
];

// Permission types
const permissionTypes = [
  { id: "view", name: "View" },
  { id: "create", name: "Create" },
  { id: "edit", name: "Edit" },
  { id: "delete", name: "Delete" },
];

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  permissions: z.record(
    z.string(),
    z.record(z.string(), z.boolean())
  ),
});

type FormValues = z.infer<typeof formSchema>;

const RoleModal = ({ isOpen, onClose, role }: RoleModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate default empty permissions object
  const getDefaultPermissions = () => {
    const permissions: Record<string, Record<string, boolean>> = {};
    
    modules.forEach(module => {
      permissions[module.id] = {};
      permissionTypes.forEach(type => {
        permissions[module.id][type.id] = false;
      });
    });

    return permissions;
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: getDefaultPermissions(),
    },
  });

  // Update form values when role changes
  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        permissions: getDefaultPermissions(),
      });
    }
  }, [role, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, we would send data to an API
      // const url = role ? `/api/roles/${role.id}` : '/api/roles';
      // const method = role ? 'PUT' : 'POST';
      // await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: role ? "Role updated" : "Role created",
        description: role 
          ? `${data.name} has been updated successfully.` 
          : `${data.name} has been created successfully.`,
        variant: "success",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the role.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {role ? "Edit Role" : "Add New Role"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Product Manager" 
                      {...field} 
                      disabled={role?.name === "Super Admin"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Brief description of this role's responsibilities" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-2">Permissions</h3>
              <FormDescription className="mb-4">
                Set the access level for each module
              </FormDescription>
              
              <div className="border rounded-md">
                {/* Header row */}
                <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-b">
                  <div className="col-span-1 font-medium">Module</div>
                  {permissionTypes.map(type => (
                    <div key={type.id} className="col-span-1 text-center font-medium">
                      {type.name}
                    </div>
                  ))}
                </div>
                
                {/* Module rows */}
                {modules.map((module, index) => (
                  <div key={module.id}>
                    <div className="grid grid-cols-5 gap-4 p-4">
                      <div className="col-span-1 font-medium">{module.name}</div>
                      
                      {permissionTypes.map(type => (
                        <div key={type.id} className="col-span-1 flex justify-center">
                          <FormField
                            control={form.control}
                            name={`permissions.${module.id}.${type.id}`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-1">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={role?.name === "Super Admin"}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                    {index < modules.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || role?.name === "Super Admin"}>
                {isSubmitting ? "Saving..." : role ? "Save Changes" : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
