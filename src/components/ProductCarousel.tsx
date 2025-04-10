
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/index";
import { Button } from "@/components/ui/button";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const ProductCarousel = ({ title, products, viewAllLink }: ProductCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const { scrollLeft, clientWidth } = carouselRef.current;
    const scrollTo =
      direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;

    carouselRef.current.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="relative bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {viewAllLink && (
          <Button variant="default" className="bg-flipkart-blue hover:bg-flipkart-blue/90">
            View All
          </Button>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 rounded-full bg-white shadow-md border-gray-200"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-2 px-2"
          onScroll={handleScroll}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[200px] max-w-[200px] flex-shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 rounded-full bg-white shadow-md border-gray-200"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
