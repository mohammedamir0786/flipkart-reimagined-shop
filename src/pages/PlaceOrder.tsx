
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Sample cart items - in a real app, these would come from a cart context
  const cartItems = [
    { id: 1, name: "Wireless Earbuds", price: 59.99, quantity: 1 },
    { id: 2, name: "Smart Watch", price: 129.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryOption === "express" ? 9.99 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your order is being processed.",
        variant: "success",
      });
      navigate("/orders");
    }, 2000);
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

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Delivery & Payment */}
            <div className="flex-grow space-y-8">
              {/* Delivery Address */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </h2>
                  <Button variant="ghost" size="sm">
                    Change
                  </Button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <p className="font-medium">Home</p>
                  <p className="text-gray-600 dark:text-gray-300">123 Main Street, Apt 4B</p>
                  <p className="text-gray-600 dark:text-gray-300">New York, NY 10001</p>
                  <p className="text-gray-600 dark:text-gray-300">United States</p>
                  <p className="text-gray-600 dark:text-gray-300">Phone: (555) 123-4567</p>
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
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
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
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                  {!isProcessing && <ChevronsRight className="ml-2 h-4 w-4" />}
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
