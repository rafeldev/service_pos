import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HiTrash } from "react-icons/hi";
import type { Order } from "@/app/types/pedidoTypes";
import { cn } from "@/lib/utils";

// Componente para el Item de Orden
export default function OrderItem({ order, isSelected = false }: { order: Order; isSelected?: boolean }) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implementar eliminación
    console.log('Eliminar orden:', order.id);
  };

  return (
    <Card className={cn(
      "bg-cyan-50 border-cyan-200 hover:shadow-md transition-shadow",
      isSelected && "ring-2 ring-cyan-500 border-cyan-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Información Izquierda */}
          <div className="flex items-center gap-4 flex-1">
            {/* Fecha y Hora */}
            <div className="flex flex-col min-w-[80px]">
              <span className="text-sm font-medium text-gray-800">{order.fecha}</span>
              <span className="text-xs text-gray-600">{order.hora}</span>
            </div>

            {/* ID de Orden y Mesa */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{order.tableId}</span>
                <span className="text-xs text-gray-600">{order.id}</span>
              </div>
            </div>

            {/* Tags de Tipo y Mesa */}
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                {order.tipo}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                {order.mesa}
              </span>
            </div>
          </div>

          {/* Información Derecha */}
          <div className="flex items-center gap-4">
            {/* Total */}
            <div className="text-right">
              <span className="text-lg font-semibold text-green-600">
                $ {order.total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {/* Estado */}
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700 min-w-[80px] text-center">
              {order.estado}
            </span>

            {/* Botón Eliminar */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <HiTrash className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}