"use client";

import { Button } from "@/components/ui/button";
import { FiMinus, FiPlus } from "react-icons/fi";
import useCartStore from "@/store/useCartStore";

type CartItemProps = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
};

export default function CartItem({ id, nombre, descripcion, precio, cantidad }: CartItemProps) {
  const { incrementQuantity, decrementQuantity } = useCartStore();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-800">
      {/* Controles de cantidad - Izquierda */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => decrementQuantity(id)}
          className="h-7 w-7 rounded-full"
        >
          <FiMinus className="w-3 h-3" />
        </Button>
        <span className="text-sm font-semibold w-6 text-center">{cantidad}</span>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => incrementQuantity(id)}
          className="h-7 w-7 rounded-full"
        >
          <FiPlus className="w-3 h-3" />
        </Button>
      </div>

      {/* Info del producto - Centro */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{nombre}</p>
        {descripcion && (
          <p className="text-sm text-gray-500 truncate">- {descripcion}</p>
        )}
      </div>

      {/* Precio - Derecha */}
      <div className="text-right">
        <p className="font-semibold text-gray-900">$ {(precio * cantidad).toFixed(2)}</p>
      </div>
    </div>
  );
}
