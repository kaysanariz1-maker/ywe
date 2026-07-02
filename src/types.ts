export interface Product {
  id: string;
  title: string;
  category: 'panjabi' | 'tshirt' | 'hoodie' | 'wall-art' | 'perfume' | 'customized' | string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  sizes?: string[];
  colors?: string[];
  isNew?: boolean;
  isPopular?: boolean;
  stock: number;
  rating: number;
  reviewsCount: number;
  features?: { name: string; values: string[] }[];
  campaign?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedFeatures?: { [featureName: string]: string };
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: 'Dhaka' | 'Outside Dhaka';
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentNumber?: string;
  transactionId?: string;
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
    size?: string;
    selectedFeatures?: { [featureName: string]: string };
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface SalesStat {
  date: string;
  sales: number;
  orders: number;
}

export interface AuthenticatedAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  passcode: string;
  createdAt: string;
}

export interface PendingAdminRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  passcode: string;
  createdAt: string;
}

export interface AdBanner {
  id: string;
  imageUrl: string;
  targetCategory: string;
  insertAfterRowIndex: number;
}

