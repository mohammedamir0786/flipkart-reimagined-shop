
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

interface AddProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (e: React.FormEvent) => void;
  previewImage: string | null;
  isUploading: boolean;
  productDescription: string;
  setProductDescription: (description: string) => void;
  isAIGenerated: boolean;
  setIsAIGenerated: (value: boolean) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenAIModal: () => void;
}

const AddProductModal = ({
  isOpen,
  onOpenChange,
  onSave,
  previewImage,
  isUploading,
  productDescription,
  setProductDescription,
  isAIGenerated,
  setIsAIGenerated,
  onImageSelect,
  onOpenAIModal
}: AddProductModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          onSubmit={onSave}
          previewImage={previewImage}
          isUploading={isUploading}
          productDescription={productDescription}
          setProductDescription={setProductDescription}
          isAIGenerated={isAIGenerated}
          setIsAIGenerated={setIsAIGenerated}
          onImageSelect={onImageSelect}
          onOpenAIModal={onOpenAIModal}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>Save Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
