
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Product } from "@/types/index";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const {
    id,
    title,
    image,
    price,
    originalPrice,
    discount,
    rating,
    reviews,
    assured,
  } = product;

  return (
    <Link to={`/product/${id}`}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="p-4 flex flex-col h-full">
          {/* Image with aspect ratio */}
          <div className="relative mb-4">
            <AspectRatio ratio={1 / 1} className="bg-gray-50">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-contain mix-blend-multiply"
                loading="lazy"
              />
            </AspectRatio>
          </div>

          {/* Content */}
          <div className="flex-grow">
            {/* Title */}
            <h3 className="font-medium text-sm mb-1 line-clamp-2">{title}</h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="bg-flipkart-green text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                <span>{rating}</span>
                <Star className="h-3 w-3 ml-0.5 fill-current" />
              </div>
              <span className="text-gray-500 text-xs">({reviews})</span>
              {assured && (
                <img
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                  alt="Flipkart Assured"
                  className="h-4 ml-1"
                />
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-medium">₹{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-gray-500 text-sm line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
              {discount && (
                <span className="text-flipkart-green text-sm">{discount}% off</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
