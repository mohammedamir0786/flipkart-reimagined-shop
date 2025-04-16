
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { CheckCircle2, Eye, FileText, XCircle } from "lucide-react";

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
  {
    id: "RET004",
    orderId: "ORD126",
    customerId: "CUST459",
    customerName: "Sarah Williams",
    productId: "PROD792",
    productName: "MacBook Air M2",
    reason: "Performance issues",
    status: "pending",
    dateRequested: "2025-04-15T14:20:00Z",
  },
  {
    id: "RET005",
    orderId: "ORD127",
    customerId: "CUST460",
    customerName: "Robert Chen",
    productId: "PROD793",
    productName: "Dell XPS 15",
    reason: "Defective keyboard",
    status: "approved",
    dateRequested: "2025-04-14T11:30:00Z",
    dateResolved: "2025-04-15T13:45:00Z",
    adminNotes: "Confirmed hardware issue",
  },
  {
    id: "RET006",
    orderId: "ORD128",
    customerId: "CUST461",
    customerName: "Emily Brown",
    productId: "PROD794",
    productName: "iPad Pro 12.9",
    reason: "Screen has dead pixels",
    status: "pending",
    dateRequested: "2025-04-15T16:10:00Z",
  },
  {
    id: "RET007",
    orderId: "ORD129",
    customerId: "CUST462",
    customerName: "David Wilson",
    productId: "PROD795",
    productName: "AirPods Pro",
    reason: "Battery not holding charge",
    status: "rejected",
    dateRequested: "2025-04-13T09:45:00Z",
    dateResolved: "2025-04-14T14:20:00Z",
    adminNotes: "Product tested - battery life within normal range",
  },
  {
    id: "RET008",
    orderId: "ORD130",
    customerId: "CUST463",
    customerName: "Lisa Anderson",
    productId: "PROD796",
    productName: "Gaming Monitor 27\"",
    reason: "Arrived with cracked screen",
    status: "approved",
    dateRequested: "2025-04-14T13:15:00Z",
    dateResolved: "2025-04-15T10:30:00Z",
    adminNotes: "Shipping damage confirmed",
  }
];

const ReturnRequests = () => {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(initialReturnRequests);
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = returnRequests } = useQuery({
    queryKey: ["returnRequests"],
    queryFn: async () => {
      // In production, this would be an API call
      return returnRequests;
    },
  });

  const updateReturnRequestMutation = useMutation({
    mutationFn: async (variables: { requestId: string; status: ReturnRequest["status"]; notes?: string }) => {
      // In production, this would be an API call
      const updatedRequests = returnRequests.map(request => {
        if (request.id === variables.requestId) {
          return {
            ...request,
            status: variables.status,
            dateResolved: new Date().toISOString(),
            adminNotes: variables.notes,
          };
        }
        return request;
      });
      setReturnRequests(updatedRequests);
      return updatedRequests;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returnRequests"] });
    },
  });

  const handleAction = async (request: ReturnRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    const status = actionType === "approve" ? "approved" : "rejected" as ReturnRequest["status"];

    await updateReturnRequestMutation.mutate({
      requestId: selectedRequest.id,
      status,
      notes: `Return request ${status} on ${format(new Date(), "PPp")}`,
    });

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

  const formatDate = (date: string) => {
    return format(new Date(date), "PPp");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Return Requests</h1>
          <p className="text-gray-500">Manage customer return requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export
          </Button>
        </div>
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
                <TableCell>{formatDate(request.dateRequested)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <>
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
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsDetailsOpen(true);
                      }}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!selectedRequest && !!actionType} onOpenChange={() => setSelectedRequest(null)}>
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

      <AlertDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return Request Details</AlertDialogTitle>
          </AlertDialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p>{selectedRequest.orderId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer</p>
                  <p>{selectedRequest.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Product</p>
                  <p>{selectedRequest.productName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Reason</p>
                  <p>{selectedRequest.reason}</p>
                </div>
                {selectedRequest.adminNotes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Admin Notes</p>
                    <p>{selectedRequest.adminNotes}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Date Requested</p>
                  <p>{formatDate(selectedRequest.dateRequested)}</p>
                </div>
                {selectedRequest.dateResolved && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date Resolved</p>
                    <p>{formatDate(selectedRequest.dateResolved)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDetailsOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReturnRequests;
