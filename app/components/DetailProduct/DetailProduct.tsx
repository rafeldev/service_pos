import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useCartStore from "@/store/useCartStore";
import { toast } from "sonner";

type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  descripcion: string;
};

type DetailProductProps = {
  producto: Producto;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DetailProduct({ producto, open, setOpen }: DetailProductProps) {
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCartStore();

  const decrementar = () => setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
  const incrementar = () => setCantidad((prev) => prev + 1);

  const handleAddToCart = () => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      price: producto.precio,
      quantity: cantidad,
    });
    setCantidad(1);
    setOpen(false);
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{producto.nombre}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Imagen */}
          <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover"
            />
          </div>

          {/* Precio */}
          <p className="text-2xl font-bold text-red-500">${producto.precio.toFixed(2)}</p>

          {/* Descripción */}
          <p className="text-gray-600">{producto.descripcion}</p>

          {/* Controles de cantidad y botón agregar */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementar}
                className="h-10 w-10"
              >
                <FiMinus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-semibold w-8 text-center">{cantidad}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementar}
                className="h-10 w-10"
              >
                <FiPlus className="w-4 h-4" />
              </Button>
            </div>
            <Button className="flex-1" onClick={handleAddToCart}>
              Agregar ${(producto.precio * cantidad).toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
