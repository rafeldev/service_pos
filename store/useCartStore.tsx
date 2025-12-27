import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { CartState } from '@/app/types/store/storeTypes';


const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        
        addToCart: (item) => set(
          (state) => {
            const existingItem = state.cart.find(i => i.id === item.id);
            if (existingItem) {
              // Si ya existe, incrementar cantidad
              return {
                cart: state.cart.map(i => 
                  i.id === item.id 
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                )
              };
            }
            // Si no existe, agregar nuevo
            return { cart: [...state.cart, item] };
          },
          false,
          'cart/addToCart'
        ),
        
        removeFromCart: (itemId) => set(
          (state) => ({ cart: state.cart.filter((i) => i.id !== itemId) }),
          false,
          'cart/removeFromCart'
        ),
        
        updateQuantity: (itemId, quantity) => set(
          (state) => ({
            cart: quantity > 0
              ? state.cart.map(i => i.id === itemId ? { ...i, quantity } : i)
              : state.cart.filter(i => i.id !== itemId)
          }),
          false,
          'cart/updateQuantity'
        ),
        
        incrementQuantity: (itemId) => set(
          (state) => ({
            cart: state.cart.map(i => 
              i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
            )
          }),
          false,
          'cart/incrementQuantity'
        ),
        
        decrementQuantity: (itemId) => set(
          (state) => {
            const item = state.cart.find(i => i.id === itemId);
            if (item && item.quantity <= 1) {
              // Si la cantidad es 1 o menos, eliminar el item
              return { cart: state.cart.filter(i => i.id !== itemId) };
            }
            // Si no, decrementar
            return {
              cart: state.cart.map(i => 
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
              )
            };
          },
          false,
          'cart/decrementQuantity'
        ),
        
        clearCart: () => set(
          { cart: [] },
          false,
          'cart/clearCart'
        ),
        
        getTotal: () => {
          const { cart } = get();
          return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },
      }),
      {
        name: 'pos-cart-storage',
        version: 1,
      }
    ),
    { name: 'POS - Cart' }
  )
)

export default useCartStore
