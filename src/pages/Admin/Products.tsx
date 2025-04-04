
import { useState, useCallback, useEffect } from "react";
import { Search, Plus, Trash2, Edit, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { featuredProducts, newArrivals, topDeals } from "@/data/mockData";
import { Product } from "@/components/ProductCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import ProductsTablePagination from "@/components/ProductsTablePagination";
import imageCompression from "browser-image-compression";

const ITEMS_PER_PAGE = 5; // Number of products per page

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch products with pagination and filtering
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);
  
  const fetchProducts = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      // Combine all products from mock data
      const allProducts = [...featuredProducts, ...newArrivals, ...topDeals];
      
      // Remove duplicates (some products might be in multiple categories)
      const uniqueProducts = allProducts.filter(
        (product, index, self) => index === self.findIndex((p) => p.id === product.id)
      );
      
      // Filter products based on search query
      const filteredProducts = uniqueProducts.filter(
        (product) => product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Store total count for pagination
      setTotalProducts(filteredProducts.length);
      
      // Calculate pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      // Update products state
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
    // Scroll to top of table when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleDeleteProduct = (id: number) => {
    // In a real app, this would delete from the database
    console.log(`Deleting product with id: ${id}`);
    // Then refetch products
    
    toast({
      title: "Product deleted",
      description: "The product has been successfully removed",
    });
    
    // Refresh products
    fetchProducts();
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setPreviewImage(product.image);
    setIsEditModalOpen(true);
  };
  
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setSelectedImage(null);
    setPreviewImage(null);
    setIsAddModalOpen(true);
  };
  
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Compress the image before uploading
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      console.log(`Original file size: ${file.size / 1024 / 1024} MB`);
      console.log(`Compressed file size: ${compressedFile.size / 1024 / 1024} MB`);
      
      setSelectedImage(compressedFile);
      
      // Create preview URL
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
    // In a real app, this would save to the database
    console.log("Saving product:", currentProduct);
    console.log("With image:", selectedImage);
    
    // Close the modal
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    
    // Reset current product and image
    setCurrentProduct(null);
    setSelectedImage(null);
    setPreviewImage(null);
    
    toast({
      title: isEditModalOpen ? "Product updated" : "Product added",
      description: isEditModalOpen 
        ? "The product has been successfully updated" 
        : "The product has been successfully added",
    });
    
    // Refresh products
    fetchProducts();
  };
  
  // Calculate totalPages
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

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
      
      {/* Search and filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>
      
      {/* Products table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state with skeletons
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="w-16 h-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative">
                      <AspectRatio ratio={1/1} className="bg-muted">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/100x100/gray/white?text=No+Image";
                          }}
                        />
                      </AspectRatio>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="line-clamp-2">{product.title}</div>
                  </TableCell>
                  <TableCell>₹{product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.rating}</TableCell>
                  <TableCell>{product.reviews}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalProducts > 0 && (
        <div className="flex justify-center">
          <ProductsTablePagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handleChangePage}
            isLoading={isLoading}
          />
        </div>
      )}
      
      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct}>
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
                      alt="Product preview"
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
                    onChange={handleImageSelect}
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
                  <label htmlFor="title" className="text-sm font-medium">
                    Product Name
                  </label>
                  <Input
                    id="title"
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="text-sm font-medium">
                      Price
                    </label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="originalPrice" className="text-sm font-medium">
                      Original Price
                    </label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {currentProduct && (
            <form onSubmit={handleSaveProduct}>
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="border-2 border-dashed rounded-lg p-4 w-32 h-32 flex items-center justify-center relative">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt={currentProduct.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <span className="text-sm text-gray-500">Change Image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageSelect}
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
                    <label htmlFor="edit-title" className="text-sm font-medium">
                      Product Name
                    </label>
                    <Input
                      id="edit-title"
                      defaultValue={currentProduct.title}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-price" className="text-sm font-medium">
                        Price
                      </label>
                      <Input
                        id="edit-price"
                        type="number"
                        defaultValue={currentProduct.price}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-originalPrice" className="text-sm font-medium">
                        Original Price
                      </label>
                      <Input
                        id="edit-originalPrice"
                        type="number"
                        defaultValue={currentProduct.originalPrice || 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Product</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
