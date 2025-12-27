// Formatear fecha
export const formatDate = (date: Date) => {
  const now = new Date();
  const orderDate = new Date(date);
  const isToday = 
    orderDate.getDate() === now.getDate() &&
    orderDate.getMonth() === now.getMonth() &&
    orderDate.getFullYear() === now.getFullYear();
  
  if (isToday) {
    return 'Hoy';
  }
  return orderDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

// Formatear hora
export const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};