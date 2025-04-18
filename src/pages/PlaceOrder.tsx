
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, CreditCard, Truck, Home, MapPin, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const deliveryOptions = [
  {
    id: "standard",
    name: "Standard Delivery",
    price: "FREE",
    description: "Delivery in 3-5 business days",
    icon: Truck,
  },
  {
    id: "express",
    name: "Express Delivery",
    price: "$9.99",
    description: "Delivery in 1-2 business days",
    icon: Truck,
  },
];

const paymentMethods = [
  {
    id: "creditCard",
    name: "Credit/Debit Card",
    icon: CreditCard,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: Home,
  },
];

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get("canceled") === "true";
  
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Mock cart items - in a real app, this would come from a cart context or state
  const cartItems = [
    { id: 1, name: "Wireless Earbuds", price: 59.99, quantity: 1 },
    { id: 2, name: "Smart Watch", price: 129.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryOption === "express" ? 9.99 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Basic validation
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    
    if (paymentMethod === "creditCard") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessingPayment(true);

    try {
      // Format customer address for the order record
      const formattedAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}`;
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: cartItems,
          total: total,
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: formattedAddress,
            phone: customerInfo.phone,
          },
        },
      });

      if (error) throw error;
      
      if (paymentMethod === "cod") {
        // For cash on delivery, show success message and redirect
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed and will be delivered soon.",
          variant: "success",
        });
        navigate("/returns?success=true");
      } else {
        // For credit card, redirect to Stripe
        if (!data?.url) throw new Error('No checkout URL received');
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <Badge variant="info">Secure</Badge>
          </div>

          {canceled && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Payment Canceled</AlertTitle>
              <AlertDescription>
                Your payment was canceled. You can try again or choose a different payment method.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Delivery & Payment */}
            <div className="flex-grow space-y-8">
              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={customerInfo.name} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={customerInfo.email} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={customerInfo.address} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={customerInfo.city} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={customerInfo.state} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input 
                        id="zipCode" 
                        name="zipCode" 
                        value={customerInfo.zipCode} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={customerInfo.phone} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Options
                </h2>

                <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span>{option.name}</span>
                          </div>
                          <span className="font-semibold">{option.price}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                        <method.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {paymentMethod === "creditCard" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="number"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={handleCardInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        name="name"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={handleCardInputChange}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleCardInputChange}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          name="cvv"
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Order Summary */}
            <div className="w-full lg:w-96 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p>
                          {item.name} <span className="text-gray-500">× {item.quantity}</span>
                        </p>
                      </div>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator className="my-2" />

                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between">
                    <p>Delivery</p>
                    <p>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</p>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-semibold">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Place Order<ChevronsRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-sm">
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  Secure Checkout
                </p>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  30-day Return Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlaceOrder;
