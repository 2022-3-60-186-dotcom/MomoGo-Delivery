export interface MenuItem {
  _id?: string; // MongoDB ID
  id?: string; // For backward compatibility with static data
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'steam' | 'fried' | 'special';
  isPopular?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
}
