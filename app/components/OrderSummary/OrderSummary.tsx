"use client";

import { Button } from "@/components/ui/button";
import type { OrderSummaryProps } from "@/app/types/domain/orderSummaryTypes";
import { X } from "lucide-react";

export default function OrderSummary({ order, onClose, onLoadOrder }: OrderSummaryProps) {
  if (!order) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Resumen del Pedido</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Items del Pedido */}
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {item.quantity} {item.nombre}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-800 ml-4">
                  $ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con Totales y Botón */}
      <div className="border-t p-4 space-y-3 bg-gray-50">
        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-base font-bold text-gray-800">Total</span>
          <span className="text-base font-bold text-gray-800">
            $ {order.total.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Botón Cargar Orden */}
        <Button
          onClick={onLoadOrder}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg"
        >
          Cargar orden
        </Button>
      </div>
    </div>
  );
}

