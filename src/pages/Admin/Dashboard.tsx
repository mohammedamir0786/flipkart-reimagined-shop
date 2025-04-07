
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Package, Users, ShoppingBag, DollarSign, AlertCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const statCards = [
  { title: "Total Products", value: 1254, icon: Package, color: "#2563EB", loading: false },
  { title: "Total Users", value: 3782, icon: Users, color: "#10B981", loading: false },
  { title: "Total Orders", value: 924, icon: ShoppingBag, color: "#F59E0B", loading: false },
  { title: "Total Revenue", value: "₹12,38,485", icon: DollarSign, color: "#8B5CF6", loading: false },
];

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5200 },
];

const categoryData = [
  { name: "Electronics", value: 540 },
  { name: "Fashion", value: 320 },
  { name: "Home", value: 210 },
  { name: "Sports", value: 170 },
  { name: "Books", value: 90 },
];

// Low stock products data
const lowStockProducts = [
  { id: 1, name: "iPhone 15 Pro Max", stock: 3, threshold: 5 },
  { id: 2, name: "Samsung Galaxy S23", stock: 2, threshold: 5 },
  { id: 3, name: "Sony WH-1000XM5", stock: 4, threshold: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Demo notification effects
  useEffect(() => {
    // Only show these notifications after loading completes
    if (!isLoading) {
      // New order notification (simulate after 2 seconds)
      const newOrderTimer = setTimeout(() => {
        toast({
          title: "New Order Received",
          description: "Order #ORD-006 from Alice Johnson - ₹14,599",
          variant: "default",
        });
      }, 2000);
      
      // Low stock notification (simulate after 5 seconds)
      const lowStockTimer = setTimeout(() => {
        toast({
          title: "Low Stock Alert",
          description: "Samsung Galaxy S23 is running low (2 remaining)",
          variant: "destructive",
        });
      }, 5000);
      
      // Order status change notification (simulate after 8 seconds)
      const statusChangeTimer = setTimeout(() => {
        toast({
          title: "Order Status Changed",
          description: "Order #ORD-002 is now Delivered",
          variant: "default",
        });
      }, 8000);
      
      return () => {
        clearTimeout(newOrderTimer);
        clearTimeout(lowStockTimer);
        clearTimeout(statusChangeTimer);
      };
    }
  }, [isLoading, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your admin dashboard</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-md" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
              {isLoading ? (
                <div className="ml-4 space-y-2 w-full">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
              ) : (
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Low Stock Products Alert */}
      {!isLoading && lowStockProducts.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-700">Low Stock Products</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded-md border border-red-100">
                <span>{product.name}</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="ml-2">
                        {product.stock} left
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Below threshold of {product.threshold}</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Monthly Sales</h3>
          <div className="h-80">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <ChartContainer config={{ 
                sales: { 
                  theme: { 
                    light: '#2563EB', 
                    dark: '#3B82F6' 
                  } 
                } 
              }}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales Amount" fill="var(--color-sales)" />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Product Categories</h3>
          <div className="h-80">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="h-64 w-full rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
