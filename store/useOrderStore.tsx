import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { Item } from './useCartStore';

export type { Item };

type CurrentOrder = {
  customer: string | null;
  table: string | null;
  items: Item[];
}

type Order = CurrentOrder & {
  id: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
}

type OrderState = {
  // Orden actual (en construcción)
  currentOrder: CurrentOrder;
  
  // Historial de órdenes
  orders: Order[];
  
  // Acciones para la orden actual
  setCustomer: (customer: string) => void;
  setTable: (table: string) => void;
  setCartItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  removeItem: (itemId: number) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  clearCurrentOrder: () => void;
  
  // Acciones para órdenes
  submitOrder: (cartItems: Item[], cartTotal: number) => void;
  
  // Computed
  getTotal: () => number;
}

const initialCurrentOrder: CurrentOrder = {
  customer: null,
  table: null,
  items: [],
}

const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
  currentOrder: initialCurrentOrder,
  orders: [],
  
  // Setters para metadata
  setCustomer: (customer) => set(
    (state) => ({ currentOrder: { ...state.currentOrder, customer } }),
    false,
    'order/setCustomer'
  ),
  
  setTable: (table) => set(
    (state) => ({ currentOrder: { ...state.currentOrder, table } }),
    false,
    'order/setTable'
  ),
  
  setCartItems: (items) => set(
    (state) => ({ currentOrder: { ...state.currentOrder, items } }),
    false,
    'order/setCartItems'
  ),
  
  // Acciones para items
  addItem: (item) => set((state) => {
    const existingItem = state.currentOrder.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        }
      };
    }
    return {
      currentOrder: {
        ...state.currentOrder,
        items: [...state.currentOrder.items, item]
      }
    };
  }),
  
  removeItem: (itemId) => set((state) => ({
    currentOrder: {
      ...state.currentOrder,
      items: state.currentOrder.items.filter(i => i.id !== itemId)
    }
  })),
  
  updateItemQuantity: (itemId, quantity) => set((state) => ({
    currentOrder: {
      ...state.currentOrder,
      items: quantity > 0 
        ? state.currentOrder.items.map(i => 
            i.id === itemId ? { ...i, quantity } : i
          )
        : state.currentOrder.items.filter(i => i.id !== itemId)
    }
  })),
  
  clearCurrentOrder: () => set({ currentOrder: initialCurrentOrder }),
  
  // Enviar orden al historial
  submitOrder: (cartItems, cartTotal) => set(
    (state) => {
      const newOrder: Order = {
        ...state.currentOrder,
        items: cartItems,
        id: Date.now(),
        total: cartTotal,
        status: 'pending',
        createdAt: new Date(),
      };
      return {
        orders: [...state.orders, newOrder],
        currentOrder: initialCurrentOrder,
      };
    },
    false,
    'order/submitOrder'
  ),
  
  // Calcular total
  getTotal: () => {
    const { currentOrder } = get();
    return currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
}),
    { name: 'POS - Orders' }
  )
)

export default useOrderStore