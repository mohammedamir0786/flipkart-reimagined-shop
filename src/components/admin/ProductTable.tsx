
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Product } from "@/types/index";
import ProductsTablePagination from "@/components/ProductsTablePagination";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  itemsPerPage: number;
  totalProducts: number;
}

const ProductTable = ({
  products,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  itemsPerPage
}: ProductTableProps) => {
  return (
    <>
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
              Array.from({ length: itemsPerPage }).map((_, i) => (
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
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => onDelete(product.id)}
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
      
      {totalPages > 0 && (
        <div className="flex justify-center">
          <ProductsTablePagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
};

export default ProductTable;
