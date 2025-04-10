
import { useState } from 'react';
import { Review, ReviewStatus, ReviewFilters } from '@/types';
import { toast } from '@/hooks/use-toast';

// Mock review data (would normally come from an API)
const initialReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    productName: "Apple iPhone 15 Pro",
    customerName: "Alex Johnson",
    rating: 5,
    comment: "Excellent product, love the new features and camera quality!",
    dateSubmitted: "2025-04-08T12:30:00Z",
    status: "approved",
    adminResponse: "Thank you for your positive feedback!",
    responseDate: "2025-04-09T09:15:00Z"
  },
  {
    id: 2,
    productId: 2,
    productName: "Samsung Galaxy S24 Ultra",
    customerName: "Maya Rodriguez",
    rating: 2,
    comment: "Disappointed with battery life. Doesn't last as long as advertised.",
    dateSubmitted: "2025-04-07T15:20:00Z",
    status: "pending"
  },
  {
    id: 3,
    productId: 3,
    productName: "Sony WH-1000XM5 Headphones",
    customerName: "Liam Chen",
    rating: 4,
    comment: "Great noise cancellation, but a bit pricey.",
    dateSubmitted: "2025-04-05T10:45:00Z",
    status: "approved"
  },
  {
    id: 4,
    productId: 4,
    productName: "Dell XPS 15 Laptop",
    customerName: "Sarah Williams",
    rating: 1,
    comment: "Received a defective unit. Keyboard doesn't work properly.",
    dateSubmitted: "2025-04-04T16:30:00Z",
    status: "rejected",
    adminResponse: "We're sorry for your experience. Please contact customer support for a replacement.",
    responseDate: "2025-04-05T11:20:00Z"
  },
  {
    id: 5,
    productId: 5,
    productName: "LG OLED C3 TV",
    customerName: "Raj Patel",
    rating: 5,
    comment: "Best TV I've ever owned. Picture quality is stunning.",
    dateSubmitted: "2025-04-03T13:15:00Z",
    status: "approved"
  },
  {
    id: 6,
    productId: 6,
    productName: "Apple iPad Pro",
    customerName: "Emma Wilson",
    rating: 4,
    comment: "Great tablet for creative work, but still not a full laptop replacement.",
    dateSubmitted: "2025-04-02T09:45:00Z",
    status: "approved"
  },
  {
    id: 7,
    productId: 1,
    productName: "Apple iPhone 15 Pro",
    customerName: "David Miller",
    rating: 3,
    comment: "Good phone but expected better battery performance.",
    dateSubmitted: "2025-04-01T11:50:00Z",
    status: "pending"
  },
  {
    id: 8,
    productId: 7,
    productName: "Dyson V12 Vacuum",
    customerName: "Nina Garcia",
    rating: 5,
    comment: "Powerful suction and easy to maneuver. Worth every penny.",
    dateSubmitted: "2025-03-31T14:20:00Z",
    status: "pending"
  },
  {
    id: 9,
    productId: 8,
    productName: "Nintendo Switch OLED",
    customerName: "Thomas Lee",
    rating: 4,
    comment: "Screen upgrade is nice, but not worth it if you already have a Switch.",
    dateSubmitted: "2025-03-30T16:45:00Z",
    status: "approved"
  },
  {
    id: 10,
    productId: 9,
    productName: "Bose QuietComfort Earbuds",
    customerName: "Priya Sharma",
    rating: 2,
    comment: "Uncomfortable after long periods of use. Returning them.",
    dateSubmitted: "2025-03-29T10:30:00Z",
    status: "rejected",
    adminResponse: "We're sorry these didn't work for you. Check out our over-ear options for better comfort.",
    responseDate: "2025-03-29T15:10:00Z"
  }
];

export function useReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filters, setFilters] = useState<ReviewFilters>({
    productName: '',
    minRating: 0,
    status: 'all',
    searchQuery: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filtered reviews based on current filters
  const filteredReviews = reviews.filter((review) => {
    // Filter by product name
    if (filters.productName && !review.productName.toLowerCase().includes(filters.productName.toLowerCase())) {
      return false;
    }
    
    // Filter by minimum rating
    if (review.rating < filters.minRating) {
      return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && review.status !== filters.status) {
      return false;
    }
    
    // Filter by search query (customer name or product name)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        review.customerName.toLowerCase().includes(query) ||
        review.productName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Open detail modal
  const openDetailModal = (review: Review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  // Open response modal
  const openResponseModal = (review: Review) => {
    setSelectedReview(review);
    setResponseText(review.adminResponse || '');
    setIsResponseModalOpen(true);
  };

  // Update review status
  const updateReviewStatus = async (id: number, newStatus: ReviewStatus) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // await fetch(`/api/reviews/${id}/status`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, status: newStatus } : review
      ));
      
      toast({
        title: `Review ${newStatus}`,
        description: `The review has been ${newStatus} successfully.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to update review status:", error);
      toast({
        title: "Action Failed",
        description: "Could not update the review status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete review
  const deleteReview = async (id: number) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setReviews(reviews.filter(review => review.id !== id));
      
      toast({
        title: "Review Deleted",
        description: "The review has been permanently deleted.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast({
        title: "Action Failed",
        description: "Could not delete the review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Respond to review
  const respondToReview = async (id: number, response: string) => {
    if (!response.trim()) {
      toast({
        title: "Empty Response",
        description: "Please enter a response before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // await fetch(`/api/reviews/${id}/respond`, {
      //   method: 'POST',
      //   body: JSON.stringify({ response }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const currentDate = new Date().toISOString();
      setReviews(reviews.map(review => 
        review.id === id ? { 
          ...review, 
          adminResponse: response,
          responseDate: currentDate
        } : review
      ));
      
      setIsResponseModalOpen(false);
      setResponseText('');
      
      toast({
        title: "Response Submitted",
        description: "Your response to the review has been saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to respond to review:", error);
      toast({
        title: "Action Failed",
        description: "Could not submit your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reviews: filteredReviews,
    selectedReview,
    isDetailModalOpen,
    isResponseModalOpen,
    responseText,
    filters,
    isLoading,
    setFilters,
    setResponseText,
    openDetailModal,
    openResponseModal,
    setIsDetailModalOpen,
    setIsResponseModalOpen,
    updateReviewStatus,
    deleteReview,
    respondToReview,
  };
}
