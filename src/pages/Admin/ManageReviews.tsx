
import { useReviewManagement } from "@/hooks/useReviewManagement";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MessageSquare, 
  Star, 
  Search, 
  Filter, 
  Link as LinkIcon 
} from "lucide-react";
import { format } from "date-fns";
import { ReviewStatus } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReviewDetailModal from "@/components/admin/ReviewDetailModal";
import ResponseModal from "@/components/admin/ResponseModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

const ManageReviews = () => {
  const {
    reviews,
    selectedReview,
    isDetailModalOpen,
    isResponseModalOpen,
    responseText,
    filters,
    isLoading,
    setFilters,
    setResponseText,
    openDetailModal,
    openResponseModal,
    setIsDetailModalOpen,
    setIsResponseModalOpen,
    updateReviewStatus,
    deleteReview,
    respondToReview,
  } = useReviewManagement();

  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "";
    }
  };

  const confirmDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      deleteReview(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Customer Reviews</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                className="pl-8 w-[250px]"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Product Name</h4>
                    <Input
                      placeholder="Filter by product name"
                      value={filters.productName}
                      onChange={(e) => setFilters({ ...filters, productName: e.target.value })}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Minimum Rating</h4>
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={filters.minRating === rating ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setFilters({ ...filters, minRating: rating })}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Status</h4>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => setFilters({ 
                        ...filters, 
                        status: value as ReviewStatus | 'all' 
                      })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({
                          productName: '',
                          minRating: 0,
                          status: 'all',
                          searchQuery: '',
                        });
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {reviews.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <button
                          className="text-blue-600 hover:underline flex items-center gap-1"
                          onClick={() => openDetailModal(review)}
                        >
                          {review.productName.length > 20 
                            ? `${review.productName.substring(0, 20)}...` 
                            : review.productName}
                          <LinkIcon size={14} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <button
                          className="hover:underline"
                          onClick={() => openDetailModal(review)}
                        >
                          {review.customerName}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate hidden md:table-cell">
                        {review.comment.length > 60 
                          ? `${review.comment.substring(0, 60)}...` 
                          : review.comment}
                      </TableCell>
                      <TableCell>{formatDate(review.dateSubmitted)}</TableCell>
                      <TableCell>
                        <span className={`capitalize font-medium ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {review.status !== "approved" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => updateReviewStatus(review.id, "approved")}
                              disabled={isLoading}
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => updateReviewStatus(review.id, "rejected")}
                              disabled={isLoading}
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openResponseModal(review)}
                            disabled={isLoading}
                            title="Respond"
                          >
                            <MessageSquare size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => confirmDelete(review.id)}
                            disabled={isLoading}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Alert>
            <AlertTitle>No reviews found</AlertTitle>
            <AlertDescription>
              No reviews match your current filter criteria. Try adjusting your filters or search query.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {/* Modals */}
      <ReviewDetailModal
        review={selectedReview}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      
      <ResponseModal
        review={selectedReview}
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        onSubmit={respondToReview}
        responseText={responseText}
        setResponseText={setResponseText}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
};

export default ManageReviews;
