
import React, { useState } from "react";
import { Upload, Sparkles } from "lucide-react";
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
  return (
    <form onSubmit={onSubmit}>
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
                placeholder="Enter product description or generate one using AI"
                className={`min-h-24 ${isAIGenerated ? 'border-blue-400 bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
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
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
