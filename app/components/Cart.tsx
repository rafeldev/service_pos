"use client";

import { TbShoppingCartFilled } from "react-icons/tb";
import { ComboboxDemo } from "./ComboBox/ComboBox";
import useOrderStore from "@/store/useOrderStore";
import { Label } from "@/components/ui/label";
import CartItem from "./CartItem/CartItem";
import useCartStore from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const items = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export default function Cart() {
  const { currentOrder, setCustomer, setTable, submitOrder } = useOrderStore();
  const { getTotal, clearCart, cart } = useCartStore()


  const tableValue = currentOrder.table;
  const customerValue = currentOrder.customer;


  // Al confirmar la orden
  const handleSubmitOrder = () => {
    if (!currentOrder.customer || !currentOrder.table) {
      toast.error('Selecciona cliente y mesa');
      return;
    }

    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    // Enviar orden con el cart y total
    submitOrder(cart, getTotal());

    // Limpiar el carrito
    clearCart();

    toast.success('Orden enviada!');
  };


  return (
    <aside className="w-1/3 border-r border-gray-200 p-4 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-1 flex-col gap-0">
          <Label className="text-sm font-medium mb-0">Table</Label>
          <ComboboxDemo
            items={items}
            placeholder="Select table"
            value={tableValue}
            setValue={setTable}

          />
        </div>
        <div className="flex flex-1 flex-col gap-0">
          <Label className="text-sm font-medium mb-0">Customer</Label>
          <ComboboxDemo
            items={items}
            placeholder="Select customer"
            value={customerValue}
            setValue={setCustomer}

          />
        </div>
      </div>
      {/* Lista de items */}
      {cart.length > 0 ? (
        <>
          <div className="mt-4 flex-1 overflow-y-auto">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                nombre={item.nombre}
                precio={item.price}
                cantidad={item.quantity}
              />
            ))}
          </div>
          <div>
            <div className="flex justify-between">
            <p>Impuestos:</p>
            <p>10%</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold text-lg">Total:</p>
              <p className="text-lg">{getTotal().toFixed(2)} USD</p>
            </div>
          </div>
          <Button onClick={handleSubmitOrder}>Submit Order</Button>

        </>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
          <TbShoppingCartFilled className="w-24 h-24" color="gray" />
          <p className="text-gray-500">No items in cart</p>
        </div>
      )}
    </aside>
  );
}

