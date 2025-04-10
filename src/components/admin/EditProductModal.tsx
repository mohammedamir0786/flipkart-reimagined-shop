
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProductForm from "./ProductForm";
import { Product } from "@/types/index";
import { useToast } from "@/hooks/use-toast";

interface EditProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (e: React.FormEvent) => void;
  product: Product | null;
  previewImage: string | null;
  isUploading: boolean;
  productDescription: string;
  setProductDescription: (description: string) => void;
  isAIGenerated: boolean;
  setIsAIGenerated: (value: boolean) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenAIModal: () => void;
}

const EditProductModal = ({
  isOpen,
  onOpenChange,
  onSave,
  product,
  previewImage,
  isUploading,
  productDescription,
  setProductDescription,
  isAIGenerated,
  setIsAIGenerated,
  onImageSelect,
  onOpenAIModal
}: EditProductModalProps) => {
  const { toast } = useToast();
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);

  if (!product) return null;

  // Function to detect if text is likely English
  const isEnglishText = (text: string): boolean => {
    if (!text.trim()) return true;
    const englishPattern = /^[\x00-\x7F\s.,!?;:()"'-]+$/;
    const nonLatinCharCount = text.split('').filter(char => !englishPattern.test(char)).length;
    return nonLatinCharCount / text.length < 0.1;
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate description
    if (productDescription && !isEnglishText(productDescription)) {
      toast({
        title: "Validation Error",
        description: "Product description must be in English",
        variant: "destructive"
      });
      return;
    }
    
    // Trigger the form submission
    if (formRef) {
      formRef.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form 
          ref={ref => setFormRef(ref)}
          onSubmit={onSave}
          className="contents"
        >
          <ProductForm
            product={product}
            onSubmit={onSave}
            previewImage={previewImage}
            isUploading={isUploading}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            isAIGenerated={isAIGenerated}
            setIsAIGenerated={setIsAIGenerated}
            onImageSelect={onImageSelect}
            onOpenAIModal={onOpenAIModal}
            isEditMode={true}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveClick}>Update Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
