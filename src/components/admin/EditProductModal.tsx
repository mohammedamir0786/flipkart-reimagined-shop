
import React from "react";
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
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
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
          <Button type="button" onClick={onSave}>Update Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
