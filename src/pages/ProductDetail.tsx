
import { useParams } from "react-router-dom";
import { useState } from "react";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  MinusCircle, 
  PlusCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  featuredProducts, 
  newArrivals, 
  topDeals 
} from "@/data/mockData";
import ProductCarousel from "@/components/ProductCarousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/types/index";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  // Find the product from our mock data
  const allProducts = [...featuredProducts, ...newArrivals, ...topDeals];
  const product = allProducts.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-500">The product you're looking for does not exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 6);
  
  const addToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product.title} (Qty: ${quantity}) has been added to your cart.`,
    });
  };
  
  const buyNow = () => {
    toast({
      title: "Proceeding to Checkout",
      description: "This feature is not fully implemented in this demo.",
    });
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow py-4">
        <div className="container mx-auto px-4">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            {/* Product Details */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Images */}
              <div className="md:w-2/5">
                <div className="sticky top-20">
                  <div className="border border-gray-200 p-4 rounded-lg bg-white mb-4">
                    <AspectRatio ratio={1 / 1}>
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </AspectRatio>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      className="flex-1 gap-2"
                      variant="outline"
                      onClick={addToCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      ADD TO CART
                    </Button>
                    
                    <Button 
                      className="flex-1 gap-2 bg-flipkart-orange hover:bg-flipkart-orange/90"
                      onClick={buyNow}
                    >
                      BUY NOW
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="md:w-3/5">
                {/* Title and Ratings */}
                <h1 className="text-xl font-medium mb-1">{product.title}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-flipkart-green text-white text-sm px-2 py-0.5 rounded flex items-center">
                    <span>{product.rating}</span>
                    <Star className="h-3 w-3 ml-1 fill-current" />
                  </div>
                  <span className="text-gray-500 text-sm">({product.reviews} ratings)</span>
                  {product.assured && (
                    <img
                      src="/placeholder.svg"
                      alt="Flipkart Assured"
                      className="h-5"
                    />
                  )}
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-medium">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 text-lg line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-flipkart-green text-lg">{product.discount}% off</span>
                  )}
                </div>
                
                {/* Quantity */}
                <div className="mb-6">
                  <p className="font-medium mb-2">Quantity</p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={incrementQuantity}
                      disabled={quantity >= 10}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Features */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium">Features</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Truck className="text-gray-500 h-5 w-5" />
                      <div>
                        <p className="font-medium">Free Delivery</p>
                        <p className="text-sm text-gray-500">Delivery by Tomorrow</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <RotateCcw className="text-gray-500 h-5 w-5" />
                      <div>
                        <p className="font-medium">7 Day Replacement</p>
                        <p className="text-sm text-gray-500">Easy Return Policy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Shield className="text-gray-500 h-5 w-5" />
                      <div>
                        <p className="font-medium">Warranty</p>
                        <p className="text-sm text-gray-500">1 Year Warranty</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tabs for More Information */}
                <Tabs defaultValue="specifications">
                  <TabsList className="w-full">
                    <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
                    <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="specifications" className="border rounded-lg mt-4 p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">General</h4>
                        <ul className="mt-2 space-y-2">
                          <li className="flex">
                            <span className="font-medium w-1/3 text-gray-500">Model Name</span>
                            <span className="w-2/3">Sample Model</span>
                          </li>
                          <li className="flex">
                            <span className="font-medium w-1/3 text-gray-500">Color</span>
                            <span className="w-2/3">Black</span>
                          </li>
                          <li className="flex">
                            <span className="font-medium w-1/3 text-gray-500">In The Box</span>
                            <span className="w-2/3">Device, Manual, Charger</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Product Details</h4>
                        <ul className="mt-2 space-y-2">
                          <li className="flex">
                            <span className="font-medium w-1/3 text-gray-500">Dimensions</span>
                            <span className="w-2/3">15 x 10 x 5 cm</span>
                          </li>
                          <li className="flex">
                            <span className="font-medium w-1/3 text-gray-500">Weight</span>
                            <span className="w-2/3">500g</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="description" className="border rounded-lg mt-4 p-4">
                    <p className="text-gray-700">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui.
                    </p>
                    <p className="text-gray-700 mt-4">
                      Quisque nec est eleifend nulla ultrices egestas quis ut quam. Donec sollicitudin lectus a mauris pulvinar id aliquam urna cursus. Cras quis ligula sem, vel elementum mi. Phasellus non ullamcorper urna.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="border rounded-lg mt-4 p-4">
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="bg-flipkart-green text-white text-lg px-2 py-1 rounded flex items-center">
                            <span>{product.rating}</span>
                            <Star className="h-4 w-4 ml-1 fill-current" />
                          </div>
                          <span className="text-gray-500">{product.reviews} ratings</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center gap-1">
                              {Array(5).fill(0).map((_, j) => (
                                <Star 
                                  key={j} 
                                  className={`h-4 w-4 ${j < 4 ? 'fill-flipkart-green text-flipkart-green' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">1 month ago</span>
                          </div>
                          <p className="text-sm font-medium mb-1">User{i + 1}</p>
                          <p className="text-sm text-gray-700">
                            Great product, excellent quality and fast delivery. Very happy with my purchase.
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          <ProductCarousel 
            title="Similar Products" 
            products={relatedProducts} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
