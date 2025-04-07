
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  ChevronDown, 
  Heart, 
  LogIn, 
  LogOut,
  Search, 
  ShoppingCart, 
  User,
  Sun,
  Moon,
  LayoutDashboard
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isMobile = useIsMobile();
  const { isLoggedIn, userEmail, userName, userRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-flipkart-blue text-white shadow-md dark:bg-gray-900">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold italic">Flipkart</span>
              <div className="flex items-center text-xs text-flipkart-yellow italic">
                <span>Explore Plus</span>
                <span className="ml-1">
                  <img 
                    src="/placeholder.svg" 
                    alt="Plus" 
                    className="h-3 w-3" 
                  />
                </span>
              </div>
            </div>
          </Link>

          {/* Search */}
          <div className={`relative flex-grow max-w-2xl transition-all duration-200 ${isMobile && isSearchFocused ? 'flex-grow' : ''}`}>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                className="bg-white text-black w-full py-1 px-3 rounded-md dark:bg-gray-800 dark:text-white"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search className="absolute right-2 text-flipkart-blue dark:text-gray-400" size={20} />
            </div>
          </div>

          {/* Nav Items - hidden on mobile when search is focused */}
          {!(isMobile && isSearchFocused) && (
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 p-2" 
                onClick={toggleTheme}
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </Button>
              
              {/* Login/User Menu */}
              <div className="relative">
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/10">
                        <User className="mr-1 h-4 w-4" />
                        <span className="hidden md:inline max-w-24 truncate">
                          {userName || userEmail?.split('@')[0] || 'Account'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {userEmail}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')}>
                        Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                        Wishlist
                      </DropdownMenuItem>
                      {userRole === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10"
                    onClick={() => navigate('/login')}
                  >
                    <LogIn className="mr-1 h-4 w-4" />
                    Login
                  </Button>
                )}
              </div>

              {/* Dashboard Button for Admin */}
              {isLoggedIn && userRole === 'admin' && !isMobile && (
                <Button 
                  variant="outline" 
                  className="text-white hover:bg-white/10 border-white"
                  onClick={() => navigate('/admin')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              )}

              {/* Become a Seller */}
              <Link to="#" className="hidden md:block text-sm whitespace-nowrap">
                Become a Seller
              </Link>

              {/* More */}
              <div className="hidden md:flex items-center text-sm">
                <span>More</span>
                <ChevronDown className="h-4 w-4" />
              </div>

              {/* Cart */}
              <Link to="/cart" className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Cart</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
