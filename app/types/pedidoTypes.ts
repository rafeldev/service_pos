export type OrderItem = {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  modificaciones?: string[];
};

export type Order = {
  id: string;
  fecha: string;
  hora: string;
  tipo: string;
  mesa: string;
  total: number;
  estado: string;
  tableId: string;
  items: OrderItem[];
  impuestos: number;
  subtotal: number;
}