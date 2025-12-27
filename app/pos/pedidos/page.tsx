"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HiOutlineSearch } from 'react-icons/hi';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { ChevronDown } from 'lucide-react';
import OrderItem from '@/app/components/ItemOrder/ItemOrder';
import OrderSummary from '@/app/components/OrderSummary/OrderSummary';
import type { Order } from '@/app/types/store/storeTypes';
import useOrderStore from '@/store/useOrderStore';

type OrderType = 'Comer en el local' | 'Para llevar' | 'Entrega' | 'all';
type OrderStatus = 'Activo' | 'Completado' | 'Cancelado' | 'all';

export default function PedidosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<OrderType>('Comer en el local');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Activo');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const totalPages = 1;

  const { orders } = useOrderStore();
  console.log(orders, 'orders');

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleLoadOrder = () => {
    // TODO: Implementar carga de orden
    console.log('Cargar orden:', selectedOrder?.id);
  };

  const handleDeleteOrder = () => {
    // Cerrar el sidebar si la orden eliminada estaba seleccionada
    setSelectedOrder(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Barra de Filtros */}
      <div className="flex items-center justify-between gap-4 p-4 border-b bg-white">
        {/* Búsqueda */}
        <div className="relative flex items-center max-w-md">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar órdenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-[500px] rounded"
          />
          {/* Filtro de Estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded border-l-none s">
                {selectedStatus}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedStatus('Activo')}>
                Activo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('Completado')}>
                Completado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('Cancelado')}>
                Cancelado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                Todos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>



        {/* Botones de Tipo */}
        <div className="flex gap-2">
          <Button
            variant={selectedType === 'Comer en el local' ? 'default' : 'outline'}
            onClick={() => setSelectedType('Comer en el local')}
            className="whitespace-nowrap"
          >
            Comer en el local
          </Button>
          <Button
            variant={selectedType === 'Para llevar' ? 'default' : 'outline'}
            onClick={() => setSelectedType('Para llevar')}
            className="whitespace-nowrap"
          >
            Para llevar
          </Button>
          <Button
            variant={selectedType === 'Entrega' ? 'default' : 'outline'}
            onClick={() => setSelectedType('Entrega')}
            className="whitespace-nowrap"
          >
            Entrega
          </Button>
        </div>

        {/* Paginación */}
        {/* <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <HiChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[80px] text-center">
            {currentPage}-{orders.length} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <HiChevronRight className="w-5 h-5" />
          </Button>
        </div> */}
      </div>

      {/* Contenedor Principal con Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Lista de Órdenes */}
        {
          orders.length > 0 ? (
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 transition-all ${selectedOrder ? 'mr-96' : ''}`}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className="cursor-pointer"
                >
                  <OrderItem
                    order={order}
                    isSelected={selectedOrder?.id === order.id}
                    onDelete={handleDeleteOrder}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 transition-all">
              <p className="text-center text-gray-500">No hay órdenes pendientes</p>
            </div>
          )
        }


        {/* Sidebar de Resumen */}
        {selectedOrder && (
          <OrderSummary
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onLoadOrder={handleLoadOrder}
          />
        )}
      </div>
    </div>
  );
}

