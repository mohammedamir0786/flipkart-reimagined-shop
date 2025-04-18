import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { featuredProducts } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
}

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // We'll use mock data for the cart items
  const [cartItems, setCartItems] = useState<CartItem[]>(
    featuredProducts.slice(0, 3).map(product => ({
      ...product,
      quantity: 1,
    }))
  );
  
  const incrementQuantity = (id: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item
      )
    );
  };
  
  const decrementQuantity = (id: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    );
  };
  
  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getDiscountAmount = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };
  
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const handleCheckout = () => {
    navigate('/place-order');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">My Cart ({getTotalItems()} items)</h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-4">Add items to your cart to continue shopping</p>
              <Button asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Cart Items */}
              <div className="lg:w-8/12">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row">
                        {/* Product Image */}
                        <div className="sm:w-32 h-32 flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0">
                          <Link to={`/product/${item.id}`}>
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="max-h-full max-w-full object-contain"
                            />
                          </Link>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-grow sm:ml-4">
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-medium mb-1">{item.title}</h3>
                          </Link>
                          
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="font-medium">₹{item.price.toLocaleString()}</span>
                            {item.originalPrice && (
                              <span className="text-gray-500 text-sm line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                            {item.discount && (
                              <span className="text-flipkart-green text-sm">{item.discount}% off</span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Qty:</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => decrementQuantity(item.id)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusCircle className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => incrementQuantity(item.id)}
                                disabled={item.quantity >= 10}
                              >
                                <PlusCircle className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Remove Button */}
                            <Button 
                              variant="link" 
                              className="text-flipkart-blue p-0 h-auto"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              REMOVE
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 flex justify-end">
                    <Button 
                      className="bg-flipkart-blue hover:bg-flipkart-blue/90"
                      onClick={handleCheckout}
                    >
                      PLACE ORDER
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Price Details */}
              <div className="lg:w-4/12">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-gray-500 font-medium mb-4 pb-4 border-b">PRICE DETAILS</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Price ({getTotalItems()} items)</span>
                      <span>₹{(getTotalPrice() + getDiscountAmount()).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-flipkart-green">- ₹{getDiscountAmount().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Delivery Charges</span>
                      <span className="text-flipkart-green">FREE</span>
                    </div>
                    
                    <div className="flex justify-between font-medium text-lg border-t border-dashed pt-3 mt-3">
                      <span>Total Amount</span>
                      <span>₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    
                    <div className="text-flipkart-green font-medium">
                      You will save ₹{getDiscountAmount().toLocaleString()} on this order
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                  <h2 className="font-medium mb-2">Safe and Secure Payments</h2>
                  <p className="text-sm text-gray-500">All major credit and debit cards accepted.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
