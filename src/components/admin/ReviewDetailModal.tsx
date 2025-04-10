
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Review } from "@/types";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface ReviewDetailModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewDetailModal = ({ review, isOpen, onClose }: ReviewDetailModalProps) => {
  if (!review) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            Review for {review.productName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <span className="text-muted-foreground">Product:</span>
            <span className="font-medium">{review.productName}</span>
            
            <span className="text-muted-foreground">Customer:</span>
            <span className="font-medium">{review.customerName}</span>
            
            <span className="text-muted-foreground">Rating:</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
              <span className="ml-2">({review.rating}/5)</span>
            </div>
            
            <span className="text-muted-foreground">Date:</span>
            <span>{formatDate(review.dateSubmitted)}</span>
            
            <span className="text-muted-foreground">Status:</span>
            <span className={`capitalize font-medium ${
              review.status === 'approved' ? 'text-green-500' : 
              review.status === 'rejected' ? 'text-red-500' : 
              'text-yellow-500'
            }`}>
              {review.status}
            </span>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Review Comment:</h4>
            <p className="bg-muted p-3 rounded-md">{review.comment}</p>
          </div>
          
          {review.adminResponse && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Admin Response:</h4>
              <p className="bg-muted p-3 rounded-md">{review.adminResponse}</p>
              {review.responseDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Responded on {formatDate(review.responseDate)}
                </p>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailModal;
