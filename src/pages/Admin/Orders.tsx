
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ordersMockData = [
  { id: "ORD-001", customer: "John Doe", date: "12 May 2023", total: "₹12,499", status: "Delivered" },
  { id: "ORD-002", customer: "Jane Smith", date: "14 May 2023", total: "₹8,999", status: "Shipped" },
  { id: "ORD-003", customer: "Robert Johnson", date: "15 May 2023", total: "₹15,999", status: "Processing" },
  { id: "ORD-004", customer: "Emily Davis", date: "16 May 2023", total: "₹5,499", status: "Delivered" },
  { id: "ORD-005", customer: "Michael Brown", date: "18 May 2023", total: "₹22,999", status: "Cancelled" },
];

const Orders = () => {
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "delivered": return "success";
      case "shipped": return "info";
      case "processing": return "warning";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-500">Manage customer orders</p>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersMockData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;
