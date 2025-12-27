import type { Item } from '@/app/types/domain/cartTypes';

// Tipos para el store de órdenes
export type CustomerInfo = {
  id: number;
  nombre: string;
} | null;

export type TableInfo = {
  id: number;
  numero: string;
} | null;

export type CurrentOrder = {
  customer: CustomerInfo;
  table: TableInfo;
  items: Item[];
};

export type Order = CurrentOrder & {
  id: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
};

export type OrderState = {
  // Orden actual (en construcción)
  currentOrder: CurrentOrder;
  
  // Historial de órdenes
  orders: Order[];
  
  // Acciones para la orden actual
  setCustomer: (customer: CustomerInfo) => void;
  setTable: (table: TableInfo) => void;
  setCartItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  removeItem: (itemId: number) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  clearCurrentOrder: () => void;
  
  // Acciones para órdenes
  submitOrder: (cartItems: Item[], cartTotal: number) => void;
  deleteOrder: (orderId: number) => void;
  
  // Computed
  getTotal: () => number;
};

// Tipos para el store del carrito
export type CartState = {
  cart: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  incrementQuantity: (itemId: number) => void;
  decrementQuantity: (itemId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
};

