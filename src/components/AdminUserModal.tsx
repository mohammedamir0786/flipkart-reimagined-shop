
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
}

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  password: z.string()
    .min(6, "Password must be at least 6 characters.")
    .optional()
    .or(z.literal("")),
  role: z.string().min(1, "Please select a role."),
  status: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AdminUserModal = ({ isOpen, onClose, admin }: AdminUserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Product Manager",
      status: "Active",
    },
  });

  // Update form values when admin changes
  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        email: admin.email,
        password: "", // Don't populate password for security
        role: admin.role,
        status: admin.status,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        role: "Product Manager",
        status: "Active",
      });
    }
  }, [admin, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, we would send data to an API
      // const url = admin ? `/api/admins/${admin.id}` : '/api/admins';
      // const method = admin ? 'PUT' : 'POST';
      // await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: admin ? "Admin updated" : "Admin added",
        description: admin 
          ? `${data.name} has been updated successfully.` 
          : `${data.name} has been added successfully.`,
        variant: "success",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the admin user.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {admin ? "Edit Admin User" : "Add New Admin User"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {admin ? "Password (leave blank to keep unchanged)" : "Password"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
                      {...field}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Order Manager">Order Manager</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {admin && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
                        {...field}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : admin ? "Save Changes" : "Add Admin"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserModal;
