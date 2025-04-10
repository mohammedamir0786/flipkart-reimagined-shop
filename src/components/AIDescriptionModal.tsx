
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface AIDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (description: string) => void;
  productTitle?: string;
}

const AIDescriptionModal: React.FC<AIDescriptionModalProps> = ({
  open,
  onOpenChange,
  onAccept,
  productTitle = ""
}) => {
  const [title, setTitle] = useState(productTitle);
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  const clearForm = () => {
    setGeneratedDescription("");
    // Don't clear the title if it was passed in
    if (!productTitle) {
      setTitle("");
    }
    setCategory("");
    setKeywords("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearForm();
    }
    onOpenChange(open);
  };

  const generateDescription = async () => {
    if (!title) {
      toast({
        title: "Please enter a product title",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // In a real implementation, this would be an API call to your backend
      // For now, we'll simulate a response with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI generated description based on inputs
      const keywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      let description = `This premium ${title.toLowerCase()} is perfect for ${category || 'any use case'}. `;
      
      if (keywordsList.length > 0) {
        description += `Featuring ${keywordsList.join(', ')}, this product offers exceptional value. `;
      }
      
      description += `Crafted with high-quality materials to ensure durability and performance. `;
      description += `An essential addition to your collection that combines style, functionality, and reliability.`;
      
      setGeneratedDescription(description);
      
      toast({
        title: "Description generated",
        description: "AI has generated a product description based on your inputs.",
      });
    } catch (error) {
      console.error("Error generating description:", error);
      toast({
        title: "Error generating description",
        description: "Failed to generate AI description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptDescription = () => {
    onAccept(generatedDescription);
    onOpenChange(false);
    clearForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Generate Product Description with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!generatedDescription ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="product-title" className="text-sm font-medium">
                    Product Title
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80">
                        <p>Enter the full product name as it appears in the catalog</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="product-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Premium Wireless Headphones"
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="product-category" className="text-sm font-medium">
                    Product Category
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80">
                        <p>Select the most specific category for your product</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="product-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Electronics, Clothing, Home Decor"
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Label htmlFor="product-keywords" className="text-sm font-medium">
                    Keywords/Highlights
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80">
                        <p>Add comma-separated keywords or product highlights (e.g., waterproof, durable, wireless)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="product-keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., waterproof, durable, wireless, lightweight"
                  className="w-full h-24"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={generateDescription} 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Description
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="generated-description" className="text-sm font-medium">
                  Generated Description
                </Label>
                <div className="border rounded-md p-4 mt-1.5 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  {generatedDescription}
                </div>
              </div>
              <div className="flex space-x-4">
                <Button 
                  className="flex-1" 
                  variant="outline" 
                  onClick={() => {
                    setGeneratedDescription("");
                  }}
                >
                  Regenerate
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleAcceptDescription}
                >
                  Accept & Use
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIDescriptionModal;
