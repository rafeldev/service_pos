export type Customer = {
  id: number;
  nombre: string;
  direccion: string;
  cedula: string;
  email: string | null;
  telefono: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}