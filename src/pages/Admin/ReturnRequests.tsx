
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ReturnRequest } from "@/types";
import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";

const initialReturnRequests: ReturnRequest[] = [
  {
    id: "RET001",
    orderId: "ORD123",
    customerId: "CUST456",
    customerName: "John Doe",
    productId: "PROD789",
    productName: "iPhone 15 Pro",
    reason: "Received wrong color",
    status: "pending",
    dateRequested: "2025-04-15T10:30:00Z",
  },
  {
    id: "RET002",
    orderId: "ORD124",
    customerId: "CUST457",
    customerName: "Jane Smith",
    productId: "PROD790",
    productName: "Samsung Galaxy S24",
    reason: "Item damaged during shipping",
    status: "approved",
    dateRequested: "2025-04-14T15:45:00Z",
    dateResolved: "2025-04-15T09:20:00Z",
  },
  {
    id: "RET003",
    orderId: "ORD125",
    customerId: "CUST458",
    customerName: "Mike Johnson",
    productId: "PROD791",
    productName: "Sony Headphones XM5",
    reason: "Not as described",
    status: "rejected",
    dateRequested: "2025-04-13T08:15:00Z",
    dateResolved: "2025-04-14T11:30:00Z",
    adminNotes: "Product matches description in listing",
  },
];

const ReturnRequests = () => {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(initialReturnRequests);
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const { toast } = useToast();

  const { data = returnRequests } = useQuery({
    queryKey: ["returnRequests"],
    queryFn: async () => {
      // In production, fetch from API
      return returnRequests;
    },
  });

  const handleAction = async (request: ReturnRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    const updatedRequests = returnRequests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: actionType === "approve" ? "approved" : "rejected" as ReturnRequest["status"],
          dateResolved: new Date().toISOString(),
        };
      }
      return request;
    });

    // Update local state
    setReturnRequests(updatedRequests);

    // In production, make API call:
    // await fetch(`/api/returns/${selectedRequest.id}/${actionType}`, {
    //   method: "PUT",
    // });

    toast({
      title: `Return Request ${actionType === "approve" ? "Approved" : "Rejected"}`,
      description: `Return request ${selectedRequest.id} has been ${actionType}d.`,
      variant: actionType === "approve" ? "success" : "destructive",
    });

    setSelectedRequest(null);
    setActionType(null);
  };

  const getStatusBadge = (status: ReturnRequest["status"]) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Return Requests</h1>
        <p className="text-gray-500">Manage customer return requests</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.orderId}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>{request.productName}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>{format(new Date(request.dateRequested), "PPp")}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(request, "approve")}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAction(request, "reject")}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Return Request {actionType?.charAt(0).toUpperCase()}{actionType?.slice(1)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} the return request for order{" "}
              {selectedRequest?.orderId}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRequest(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {actionType?.charAt(0).toUpperCase()}{actionType?.slice(1)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReturnRequests;
