
export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  description?: string;
  rating: number;
  reviews: number;
  image: string;
  category?: string;
  isNew?: boolean;
  discount?: number;
  stock?: number;
}
