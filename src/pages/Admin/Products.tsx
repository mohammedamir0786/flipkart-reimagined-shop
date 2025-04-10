
import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductManagement, ITEMS_PER_PAGE } from "@/hooks/useProductManagement";
import ProductTable from "@/components/admin/ProductTable";
import AddProductModal from "@/components/admin/AddProductModal";
import EditProductModal from "@/components/admin/EditProductModal";
import AIDescriptionModal from "@/components/AIDescriptionModal";

const Products = () => {
  const {
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isAIModalOpen,
    setIsAIModalOpen,
    currentProduct,
    currentPage,
    isLoading,
    products,
    totalProducts,
    previewImage,
    isUploading,
    productDescription,
    setProductDescription,
    isAIGenerated,
    setIsAIGenerated,
    totalPages,
    handleChangePage,
    handleDeleteProduct,
    handleEditProduct,
    handleAddProduct,
    handleImageSelect,
    handleSaveProduct,
    handleOpenAIModal,
    handleAcceptAIDescription,
  } = useProductManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
      </div>
      
      <ProductTable
        products={products}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleChangePage}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        itemsPerPage={ITEMS_PER_PAGE}
        totalProducts={totalProducts}
      />
      
      <AddProductModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveProduct}
        previewImage={previewImage}
        isUploading={isUploading}
        productDescription={productDescription}
        setProductDescription={setProductDescription}
        isAIGenerated={isAIGenerated}
        setIsAIGenerated={setIsAIGenerated}
        onImageSelect={handleImageSelect}
        onOpenAIModal={handleOpenAIModal}
      />
      
      <EditProductModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveProduct}
        product={currentProduct}
        previewImage={previewImage}
        isUploading={isUploading}
        productDescription={productDescription}
        setProductDescription={setProductDescription}
        isAIGenerated={isAIGenerated}
        setIsAIGenerated={setIsAIGenerated}
        onImageSelect={handleImageSelect}
        onOpenAIModal={handleOpenAIModal}
      />
      
      <AIDescriptionModal
        open={isAIModalOpen}
        onOpenChange={setIsAIModalOpen}
        onAccept={handleAcceptAIDescription}
        productTitle={currentProduct?.title}
      />
    </div>
  );
};

export default Products;
