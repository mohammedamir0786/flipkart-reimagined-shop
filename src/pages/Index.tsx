
import Banner from "@/components/Banner";
import CategoryBar from "@/components/CategoryBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCarousel from "@/components/ProductCarousel";
import Chatbot from "@/components/Chatbot";
import { bannerImages, featuredProducts, newArrivals, topDeals } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <CategoryBar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-4">
            {/* Banner Carousel */}
            <Banner images={bannerImages} />
            
            {/* Product Sections */}
            <div className="space-y-4">
              <ProductCarousel 
                title="Featured Products" 
                products={featuredProducts} 
                viewAllLink="/featured"
              />
              
              <ProductCarousel 
                title="New Arrivals" 
                products={newArrivals} 
                viewAllLink="/new-arrivals"
              />
              
              <ProductCarousel 
                title="Top Deals" 
                products={topDeals} 
                viewAllLink="/top-deals"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
