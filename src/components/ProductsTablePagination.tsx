
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface ProductsTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const ProductsTablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: ProductsTablePaginationProps) => {
  // Generate the page numbers to show
  const generatePaginationItems = () => {
    // If there are no pages, return nothing
    if (totalPages <= 0) return [];
    
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={(e) => {
            e.preventDefault();
            if (!isLoading) onPageChange(1);
          }}
          isActive={currentPage === 1}
          className={isLoading ? "opacity-50 pointer-events-none" : ""}
          aria-disabled={isLoading}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // If we're far enough from the beginning, show ellipsis
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={(e) => {
                e.preventDefault();
                if (!isLoading) onPageChange(i);
              }}
              isActive={currentPage === i}
              className={isLoading ? "opacity-50 pointer-events-none" : ""}
              aria-disabled={isLoading}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // If we're far enough from the end, show ellipsis
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading) onPageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
            className={isLoading ? "opacity-50 pointer-events-none" : ""}
            aria-disabled={isLoading}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading && currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={
              currentPage === 1 || isLoading
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
            tabIndex={currentPage === 1 || isLoading ? -1 : undefined}
            aria-disabled={currentPage === 1 || isLoading}
          />
        </PaginationItem>
        
        {generatePaginationItems()}
        
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading && currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={
              currentPage === totalPages || isLoading
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
            tabIndex={currentPage === totalPages || isLoading ? -1 : undefined}
            aria-disabled={currentPage === totalPages || isLoading}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductsTablePagination;
