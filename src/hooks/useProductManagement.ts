
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/index";
import { featuredProducts, newArrivals, topDeals } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";

export const ITEMS_PER_PAGE = 5;

export const useProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productDescription, setProductDescription] = useState("");
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  const fetchProducts = async () => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      const allProducts = [...featuredProducts, ...newArrivals, ...topDeals];
      const uniqueProducts = allProducts.filter(
        (product, index, self) => index === self.findIndex((p) => p.id === product.id)
      );
      const filteredProducts = uniqueProducts.filter(
        (product) => product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTotalProducts(filteredProducts.length);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      setProducts(paginatedProducts);
      console.log(`Fetched ${paginatedProducts.length} products (page ${currentPage})`);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = useCallback((page: number) => {
    if (page < 1) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteProduct = (id: number) => {
    console.log(`Deleting product with id: ${id}`);
    toast({
      title: "Product deleted",
      description: "The product has been successfully removed",
    });
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setPreviewImage(product.image);
    setProductDescription(product.description || "");
    setIsAIGenerated(false);
    setIsEditModalOpen(true);
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setSelectedImage(null);
    setPreviewImage(null);
    setProductDescription("");
    setIsAIGenerated(false);
    setIsAddModalOpen(true);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      console.log(`Original file size: ${file.size / 1024 / 1024} MB`);
      console.log(`Compressed file size: ${compressedFile.size / 1024 / 1024} MB`);
      
      setSelectedImage(compressedFile);
      
      const previewURL = URL.createObjectURL(compressedFile);
      setPreviewImage(previewURL);
      
      toast({
        title: "Image compressed",
        description: `Reduced from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving product:", currentProduct);
    console.log("With image:", selectedImage);
    console.log("With description:", productDescription);
    console.log("Is AI generated:", isAIGenerated);
    
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    
    setCurrentProduct(null);
    setSelectedImage(null);
    setPreviewImage(null);
    setProductDescription("");
    setIsAIGenerated(false);
    
    toast({
      title: isEditModalOpen ? "Product updated" : "Product added",
      description: isEditModalOpen 
        ? "The product has been successfully updated" 
        : "The product has been successfully added",
    });
    
    fetchProducts();
  };

  const handleOpenAIModal = () => {
    setIsAIModalOpen(true);
  };

  const handleAcceptAIDescription = (description: string) => {
    setProductDescription(description);
    setIsAIGenerated(true);
    
    toast({
      title: "Description applied",
      description: "AI-generated description has been added to your product.",
    });
  };

  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

  return {
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isAIModalOpen,
    setIsAIModalOpen,
    currentProduct,
    setCurrentProduct,
    currentPage,
    isLoading,
    products,
    totalProducts,
    selectedImage,
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
  };
};
