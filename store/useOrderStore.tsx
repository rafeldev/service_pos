import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { OrderState, CurrentOrder, Order  } from '@/app/types/store/storeTypes';

const initialCurrentOrder: CurrentOrder = {
  customer: null,
  table: null,
  items: [],
}

const useOrderStore = create<OrderState>()(
  devtools(
    persist(
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
        
        // Eliminar orden del historial
        deleteOrder: (orderId) => set(
          (state) => ({
            orders: state.orders.filter(order => order.id !== orderId)
          }),
          false,
          'order/deleteOrder'
        ),
        
        // Calcular total
        getTotal: () => {
          const { currentOrder } = get();
          return currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
      }),
      {
        name: 'pos-orders-storage',
        version: 1,
        // Solo persistir el historial de órdenes, no la orden actual en construcción
        partialize: (state) => ({
          orders: state.orders,
          // No persistir currentOrder para que siempre empiece limpio
        }),
        // Manejar serialización de Date
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str);
            // Convertir createdAt de string a Date
            if (parsed?.state?.orders && Array.isArray(parsed.state.orders)) {
              parsed.state.orders = parsed.state.orders.map((order: Order) => ({
                ...order,
                createdAt: new Date(order.createdAt),
              }));
            }
            return parsed;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    ),
    { name: 'POS - Orders' }
  )
)

export default useOrderStore