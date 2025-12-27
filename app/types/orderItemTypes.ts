import type { Order } from './pedidoTypes';

export interface OrderItemProps {
  order: Order;
  isSelected?: boolean;
  onDelete?: () => void;
}

