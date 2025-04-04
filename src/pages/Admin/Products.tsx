
import { useState, useCallback } from "react";
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

const ITEMS_PER_PAGE = 5; // Number of products per page

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handleChangePage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    setIsLoading(true);
    
    // Simulate API loading delay
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 300);
  }, [totalPages]);
  
  const handleDeleteProduct = (id: number) => {
    // In a real app, this would delete from the database
    console.log(`Deleting product with id: ${id}`);
    // Then refetch products
    
    toast({
      title: "Product deleted",
      description: "The product has been successfully removed",
    });
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };
  
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsAddModalOpen(true);
  };
  
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the database
    console.log("Saving product:", currentProduct);
    
    // Close the modal
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    
    // Reset current product
    setCurrentProduct(null);
    
    toast({
      title: isEditModalOpen ? "Product updated" : "Product added",
      description: isEditModalOpen 
        ? "The product has been successfully updated" 
        : "The product has been successfully added",
    });
  };

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
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative">
                      <AspectRatio ratio={1/1} className="bg-muted">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover"
                          loading="lazy" // Add lazy loading for images
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
      {filteredProducts.length > 0 && (
        <div className="flex justify-center">
          <ProductsTablePagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handleChangePage} 
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-32 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Image</span>
                  </div>
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
                  <div className="border rounded-lg w-32 h-32 overflow-hidden">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.title}
                      className="w-full h-full object-cover"
                      loading="lazy" // Add lazy loading
                    />
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
