import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const isAdminLogin = values.email.includes('admin');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      login(values.email, isAdminLogin ? 'admin' : 'user');
      
      toast({
        title: "Login successful",
        description: isAdminLogin ? "Welcome, Admin!" : "Welcome back!",
      });
      
      navigate(isAdminLogin ? "/admin" : "/");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      <button 
        onClick={handleGoHome} 
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close and go to home"
      >
        <X className="text-gray-700 hover:text-gray-900" size={24} />
      </button>

      <div className="bg-flipkart-blue text-white p-8 md:w-2/5 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold italic mb-2">Flipkart</h1>
          <p className="text-sm text-flipkart-yellow italic">Explore Plus</p>
        </div>
        
        <div className="mt-auto hidden md:block">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <p className="mb-6">Get access to your Orders, Wishlist and Recommendations</p>
          <img 
            src="/placeholder.svg" 
            alt="Login" 
            className="w-3/4 mx-auto"
          />
        </div>
      </div>
      
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-xl font-medium mb-6 md:hidden">Login</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Email"
                          {...field}
                          disabled={isLoading}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <Link to="/forgot-password" className="text-sm text-flipkart-blue">
                    Forgot password?
                  </Link>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-flipkart-orange hover:bg-flipkart-orange/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to Flipkart?{" "}
                <Link to="/signup" className="text-flipkart-blue font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
