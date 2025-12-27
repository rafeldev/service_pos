"use client";

import { TbShoppingCartFilled } from "react-icons/tb";
import { ComboboxDemo } from "../ComboBox/ComboBox";
import useOrderStore from "@/store/useOrderStore";
import { Label } from "@/components/ui/label";
import CartItem from "../CartItem/CartItem";
import useCartStore from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { getTables } from '@/services/api/tables';
import { getCustomers } from "@/services/api/customers";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

export default function Cart() {
  const { currentOrder, setCustomer, setTable, submitOrder } = useOrderStore();
  const { getTotal, clearCart, cart } = useCartStore()

  const { data: tables, isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: getTables,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const tableOptions = tables?.map((table: Table) => ({
    value: String(table.id),
    label: table.numero,
  })) || [];

  const customerOptions = customers?.map((customer: Customer) => ({
    value: String(customer.id),
    label: customer.nombre,
  })) || [];

  const tableValue = currentOrder.table ? String(currentOrder.table.id) : null;
  const customerValue = currentOrder.customer ? String(currentOrder.customer.id) : null;

  const handleTableChange = (value: string) => {
    const selectedTable = tables?.find((t: Table) => String(t.id) === value);
    if (selectedTable) {
      setTable({ id: selectedTable.id, numero: selectedTable.numero });
    } else {
      setTable(null);
    }
  };

  const handleCustomerChange = (value: string) => {
    const selectedCustomer = customers?.find((c: Customer) => String(c.id) === value);
    if (selectedCustomer) {
      setCustomer({ id: selectedCustomer.id, nombre: selectedCustomer.nombre });
    } else {
      setCustomer(null);
    }
  };


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
          <Label className="text-sm font-medium mb-0">Mesas</Label>
          <ComboboxDemo
            items={tableOptions}
            placeholder={isLoading ? "Cargando..." : "Selecciona una mesa"}
            value={tableValue}
            setValue={handleTableChange}
          />
        </div>
        <div className="flex flex-1 flex-col gap-0">
          <Label className="text-sm font-medium mb-0">Clientes</Label>
          <ComboboxDemo
            items={customerOptions}
            placeholder={customersLoading ? "Cargando..." : "Selecciona un cliente"}
            value={customerValue}
            setValue={handleCustomerChange}
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
              <p className="text-lg font-bold">{formatCurrency(getTotal())}</p>
            </div>
          </div>
          <Button
            onClick={handleSubmitOrder}
            disabled={!currentOrder.customer || !currentOrder.table}
            className={cn(
              "w-full",
              !currentOrder.customer || !currentOrder.table && "opacity-50 cursor-not-allowed"
            )}
          >Submit Order</Button>

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

