
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Review } from "@/types";

interface ResponseModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, response: string) => Promise<void>;
  responseText: string;
  setResponseText: (text: string) => void;
  isLoading: boolean;
}

const ResponseModal = ({
  review,
  isOpen,
  onClose,
  onSubmit,
  responseText,
  setResponseText,
  isLoading
}: ResponseModalProps) => {
  const [error, setError] = useState("");
  
  if (!review) return null;

  const handleSubmit = async () => {
    if (!responseText.trim()) {
      setError("Please enter a response");
      return;
    }
    
    setError("");
    await onSubmit(review.id, responseText);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Respond to Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Review by {review.customerName}:</h4>
            <p className="bg-muted p-3 rounded-md text-sm">{review.comment}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Your Response:</h4>
            <Textarea 
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="min-h-[120px]"
              placeholder="Type your response to this review..."
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Response"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResponseModal;
