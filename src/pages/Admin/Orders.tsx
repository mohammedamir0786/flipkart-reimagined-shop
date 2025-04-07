
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Eye, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ordersMockData = [
  { id: "ORD-001", customer: "John Doe", date: "12 May 2023", total: "₹12,499", status: "Delivered", items: [{ name: "iPhone 15", qty: 1, price: "₹69,999" }, { name: "Case Cover", qty: 1, price: "₹999" }], address: "123 Main St, Bangalore, Karnataka", payment: "Credit Card" },
  { id: "ORD-002", customer: "Jane Smith", date: "14 May 2023", total: "₹8,999", status: "Shipped", items: [{ name: "Samsung S23", qty: 1, price: "₹79,999" }], address: "456 Park Ave, Mumbai, Maharashtra", payment: "UPI" },
  { id: "ORD-003", customer: "Robert Johnson", date: "15 May 2023", total: "₹15,999", status: "Processing", items: [{ name: "Sony Headphones", qty: 2, price: "₹7,999" }], address: "789 Tower Rd, Delhi, Delhi", payment: "NetBanking" },
  { id: "ORD-004", customer: "Emily Davis", date: "16 May 2023", total: "₹5,499", status: "Delivered", items: [{ name: "Wireless Charger", qty: 1, price: "₹2,499" }, { name: "Screen Guard", qty: 3, price: "₹999" }], address: "101 Lake View, Chennai, Tamil Nadu", payment: "Cash on Delivery" },
  { id: "ORD-005", customer: "Michael Brown", date: "18 May 2023", total: "₹22,999", status: "Cancelled", items: [{ name: "Laptop", qty: 1, price: "₹22,999" }], address: "202 Hill Road, Hyderabad, Telangana", payment: "Credit Card" },
];

const Orders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "delivered": return "success";
      case "shipped": return "info";
      case "processing": return "warning";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };

  const filteredOrders = statusFilter === "all" 
    ? ordersMockData 
    : ordersMockData.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In a real app, this would make an API call to update the order status
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const updatedOrder = ordersMockData.find(order => order.id === orderId);
      if (updatedOrder) {
        updatedOrder.status = newStatus;
        
        toast({
          title: "Order Status Updated",
          description: `Order ${orderId} is now ${newStatus}`,
          variant: "default",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-500">Manage customer orders</p>
      </div>
      
      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filter by status:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Orders table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleOpenDetails(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Order Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Select defaultValue={order.status.toLowerCase()} onValueChange={(value) => handleStatusChange(order.id, value)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <AlertCircle className="h-10 w-10 mb-2" />
                    <p>No orders found matching the selected filter.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Order Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedOrder && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Placed on {selectedOrder.date}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                <p>{selectedOrder.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                <p>{selectedOrder.payment}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                <Badge variant={getStatusColor(selectedOrder.status) as any} className="mt-1">
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Items</h3>
                <div className="mt-2 border rounded-md divide-y">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="p-2 flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <p className="font-medium">{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>{selectedOrder.total}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Orders;
