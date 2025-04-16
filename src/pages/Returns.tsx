
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  date: string;
}

const Returns = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock orders - in a real app, these would come from an API
  const orders = [
    {
      id: "ORD123",
      name: "Wireless Earbuds",
      price: 59.99,
      date: "2025-04-01",
    },
    {
      id: "ORD124",
      name: "Smart Watch",
      price: 129.99,
      date: "2025-04-05",
    },
  ];

  const handleReturnRequest = () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your return request",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    toast({
      title: "Return request submitted",
      description: "We'll review your request and get back to you soon",
    });
    setIsDialogOpen(false);
    setReason("");
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold mb-2">Return an Item</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select the item you'd like to return from your recent orders
          </p>
        </div>

        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{order.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order ID: {order.id}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ordered: {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDialogOpen(true);
                  }}
                >
                  Return Item
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for returning {selectedOrder?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Return</label>
                <Textarea
                  placeholder="Please explain why you want to return this item..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleReturnRequest}>
                  Submit Return Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Returns;
