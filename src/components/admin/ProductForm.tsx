
import React, { useState, useEffect } from "react";
import { Upload, Sparkles, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/index";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (e: React.FormEvent) => void;
  previewImage: string | null;
  isUploading: boolean;
  productDescription: string;
  setProductDescription: (description: string) => void;
  isAIGenerated: boolean;
  setIsAIGenerated: (value: boolean) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenAIModal: () => void;
  isEditMode?: boolean;
}

const ProductForm = ({
  product,
  onSubmit,
  previewImage,
  isUploading,
  productDescription,
  setProductDescription,
  isAIGenerated,
  setIsAIGenerated,
  onImageSelect,
  onOpenAIModal,
  isEditMode = false
}: ProductFormProps) => {
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Function to detect if text is likely English
  const isEnglishText = (text: string): boolean => {
    // Skip validation for empty strings
    if (!text.trim()) return true;
    
    // Simple regex to check if text contains primarily Latin characters
    // This is a basic check that will allow English and other Latin-based languages
    const englishPattern = /^[\x00-\x7F\s.,!?;:()"'-]+$/;
    
    // We'll consider text English if at least 90% of characters are Latin-based
    const nonLatinCharCount = text.split('').filter(char => !englishPattern.test(char)).length;
    return nonLatinCharCount / text.length < 0.1;
  };

  // Validate description when it changes
  useEffect(() => {
    if (productDescription && !isEnglishText(productDescription)) {
      setDescriptionError("Description must be in English");
    } else {
      setDescriptionError(null);
    }
  }, [productDescription]);

  // Modified form submission to include validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (descriptionError) {
      return; // Don't submit if there's an error
    }
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="flex justify-center">
          <div 
            className={`border-2 border-dashed rounded-lg p-4 w-32 h-32 flex items-center justify-center relative ${
              previewImage ? 'border-primary' : 'border-gray-300'
            }`}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt={product?.title || "Product preview"}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <span className="text-sm text-gray-500">Upload Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onImageSelect}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="loader animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <label htmlFor={`${isEditMode ? 'edit-' : ''}title`} className="text-sm font-medium">
              Product Name
            </label>
            <Input
              id={`${isEditMode ? 'edit-' : ''}title`}
              placeholder="Product name"
              defaultValue={product?.title}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${isEditMode ? 'edit-' : ''}price`} className="text-sm font-medium">
                Price
              </label>
              <Input
                id={`${isEditMode ? 'edit-' : ''}price`}
                type="number"
                placeholder="0.00"
                defaultValue={product?.price}
                required
              />
            </div>
            <div>
              <label htmlFor={`${isEditMode ? 'edit-' : ''}originalPrice`} className="text-sm font-medium">
                Original Price
              </label>
              <Input
                id={`${isEditMode ? 'edit-' : ''}originalPrice`}
                type="number"
                placeholder="0.00"
                defaultValue={product?.originalPrice || 0}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={`${isEditMode ? 'edit-' : ''}description`} className="text-sm font-medium">
                Product Description
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenAIModal();
                      }}
                      className="flex items-center gap-1 h-7 px-2"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs">Generate with AI</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate a product description using AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Textarea
                id={`${isEditMode ? 'edit-' : ''}description`}
                placeholder="Enter product description or generate one using AI (English only)"
                className={`min-h-24 ${isAIGenerated ? 'border-blue-400 bg-blue-50/30 dark:bg-blue-900/10' : ''} 
                ${descriptionError ? 'border-red-400' : ''}`}
                value={productDescription}
                onChange={(e) => {
                  setProductDescription(e.target.value);
                  if (isAIGenerated) setIsAIGenerated(false);
                }}
              />
              {isAIGenerated && (
                <Badge 
                  variant="info" 
                  className="absolute top-2 right-2"
                >
                  AI Generated
                </Badge>
              )}
            </div>
            {descriptionError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{descriptionError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
