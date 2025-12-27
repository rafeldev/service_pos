import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HiTrash } from "react-icons/hi";
import type { OrderItemProps } from "@/app/types/domain/orderItemTypes";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/formatters";
import useOrderStore from "@/store/useOrderStore";
import { toast } from "sonner";

// Componente para el Item de Orden
export default function OrderItem({ order, isSelected = false, onDelete }: OrderItemProps) {
  const { deleteOrder } = useOrderStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteOrder(order.id);
    toast.success('Pedido eliminado');
    // Si hay un callback, ejecutarlo (para cerrar el sidebar si estaba seleccionado)
    if (onDelete) {
      onDelete();
    }
  };

  

  // Mapear status a texto en español
  const statusText = {
    pending: 'En curso',
    paid: 'Pagado',
    cancelled: 'Cancelado'
  };

  const statusColors = {
    pending: 'bg-gray-200 text-gray-700',
    paid: 'bg-green-200 text-green-700',
    cancelled: 'bg-red-200 text-red-700'
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
              <span className="text-sm font-medium text-gray-800">
                {formatDate(order.createdAt)}
              </span>
              <span className="text-xs text-gray-600">
                {formatTime(order.createdAt)}
              </span>
            </div>

            {/* ID de Orden */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-600">#{order.id}</span>
            </div>

            {/* Tags de Cliente y Mesa */}
            <div className="flex gap-2">
              {order.customer && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {order.customer.nombre}
                </span>
              )}
              {order.table && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  Mesa {order.table.numero}
                </span>
              )}
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
            <span className={cn(
              "px-3 py-1 text-xs font-medium rounded-full min-w-[80px] text-center",
              statusColors[order.status]
            )}>
              {statusText[order.status]}
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