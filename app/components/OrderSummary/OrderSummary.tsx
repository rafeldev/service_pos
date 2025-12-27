"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/app/types/pedidoTypes";
import { X } from "lucide-react";

interface OrderSummaryProps {
  order: Order | null;
  onClose: () => void;
  onLoadOrder: () => void;
}

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
                    {item.cantidad} {item.nombre}
                  </p>
                  {item.modificaciones && item.modificaciones.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {item.modificaciones.map((mod, index) => (
                        <p key={index} className="text-xs text-gray-600 pl-4">
                          - {mod}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 ml-4">
                  $ {(item.precio * item.cantidad).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con Totales y Botón */}
      <div className="border-t p-4 space-y-3 bg-gray-50">
        {/* Impuestos */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Impuestos</span>
          <span className="text-gray-800 font-medium">
            $ {order.impuestos.toFixed(2).replace('.', ',')}
          </span>
        </div>

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

