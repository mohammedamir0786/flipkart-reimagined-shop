export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  category?: string;
  isNew?: boolean;
  discount?: number;
  stock?: number;
  assured?: boolean;
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  dateSubmitted: string;
  status: 'approved' | 'rejected' | 'pending';
  adminResponse?: string;
  responseDate?: string;
}

export type ReviewStatus = 'approved' | 'rejected' | 'pending';

export interface ReviewFilters {
  productName: string;
  minRating: number;
  status: ReviewStatus | 'all';
  searchQuery: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  dateRequested: string;
  dateResolved?: string;
  adminNotes?: string;
}
