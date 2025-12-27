import type { Order } from './pedidoTypes';

export interface OrderSummaryProps {
  order: Order | null;
  onClose: () => void;
  onLoadOrder: () => void;
}

