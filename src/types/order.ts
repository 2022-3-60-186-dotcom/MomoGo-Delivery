export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryEntry {
  _id: string;
  orderId: string;
  status: OrderStatus;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
}

export type NotificationType = 'order_status' | 'promotion' | 'system';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedOrderId?: string;
  createdAt: string;
  updatedAt: string;
}
