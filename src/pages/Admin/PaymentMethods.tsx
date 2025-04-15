
import { Card } from "@/components/ui/card";
import { IndianRupee, CalendarRange } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Mock data for payment methods - replace with API data later
const paymentData = [
  {
    method: "UPI",
    orders: 1250,
    revenue: 2500000,
    color: "#4CAF50",
  },
  {
    method: "Credit Card",
    orders: 850,
    revenue: 1700000,
    color: "#2196F3",
  },
  {
    method: "Debit Card",
    orders: 650,
    revenue: 1300000,
    color: "#FFC107",
  },
  {
    method: "Net Banking",
    orders: 450,
    revenue: 900000,
    color: "#9C27B0",
  },
  {
    method: "Cash on Delivery",
    orders: 300,
    revenue: 600000,
    color: "#FF5722",
  },
];

const PaymentMethods = () => {
  const totalOrders = paymentData.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = paymentData.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate percentages and find top method
  const dataWithPercentage = paymentData.map(item => ({
    ...item,
    percentage: (item.orders / totalOrders * 100).toFixed(1)
  }));
  
  const topMethod = dataWithPercentage.reduce((prev, current) => 
    parseFloat(current.percentage) > parseFloat(prev.percentage) ? current : prev
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Payment Methods Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Summary Cards */}
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Total Orders</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalOrders.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Total Revenue</h3>
            </div>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Payment Methods Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercentage}
                  dataKey="orders"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {dataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detailed Table */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Payment Methods Details</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataWithPercentage.map((item) => (
                  <TableRow key={item.method}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.method}
                        {item.method === topMethod.method && (
                          <Badge variant="secondary">Top</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.orders.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                    <TableCell className="text-right">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethods;
