"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import DetailProduct from "../components/DetailProduct/DetailProduct";
import useCartStore from "@/store/useCartStore";
import { HiInformationCircle } from "react-icons/hi";


const categorias = [
  { id: 1, nombre: "Bebidas" },
  { id: 2, nombre: "Comidas" },
  { id: 3, nombre: "Postres" },
  { id: 4, nombre: "Bebidas" },
  { id: 5, nombre: "Comidas" },
];

const productos = [
  {
    id: 1,
    nombre: "Ensalada César",
    imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Fresca ensalada con lechuga romana, crutones, queso parmesano y aderezo César casero."
  },
  {
    id: 2,
    nombre: "Pizza",
    imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Pizza artesanal con salsa de tomate, mozzarella fresca y albahaca."
  },
  {
    id: 3,
    nombre: "Pancakes",
    imagen: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Esponjosos pancakes servidos con miel de maple y mantequilla."
  },
  {
    id: 4,
    nombre: "Hamburguesa",
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Jugosa hamburguesa de res con queso cheddar, lechuga, tomate y salsa especial."
  },
  {
    id: 5,
    nombre: "Tacos",
    imagen: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Tacos mexicanos con carne al pastor, cebolla, cilantro y salsa verde."
  },
  {
    id: 6,
    nombre: "Sushi",
    imagen: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Selección de rolls de sushi fresco con salmón, atún y aguacate."
  },
  {
    id: 7,
    nombre: "Pasta Carbonara",
    imagen: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Pasta al dente con salsa cremosa de huevo, panceta y queso pecorino."
  },
  {
    id: 8,
    nombre: "Café Latte",
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop",
    precio: 10.00,
    descripcion: "Café espresso con leche vaporizada y una fina capa de espuma."
  },
];


type Producto = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
}

export default function PosPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null);

  const { addToCart } = useCartStore()




  const handleAddToCart = (producto: Producto) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      price: producto.precio,
      quantity: 1,
    })
  }
  return (
    <div className="w-full space-y-6">
      {/* Contenedor de Categorías */}
      <div className="flex gap-4 flex-wrap">
        {categorias.map((categoria) => (
          <Card
            key={categoria.id}
            onClick={() => setCategoriaSeleccionada(categoria.id)}
            className={`cursor-pointer hover:shadow-lg transition-all min-w-[150px] rounded-[8px] ${categoriaSeleccionada === categoria.id
                ? "bg-gray-600 shadow-md"
                : "bg-white"
              }`}
          >
            <CardContent className="p-0 flex items-center justify-center">
              <span className={`font-medium ${categoriaSeleccionada === categoria.id
                  ? "text-white"
                  : "text-gray-800"
                }`}>
                {categoria.nombre}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contenedor de Productos */}
      <div className="flex flex-wrap gap-4">
        {productos.map((producto) => (
          <Card
            key={producto.id}
            className="cursor-pointer gap-0 hover:shadow-lg w-[150px] transition-shadow overflow-hidden rounded-[8px] py-0 flex flex-col"
            onClick={() => handleAddToCart(producto)}
          >
            {/* Imagen con botón de info */}
            <div className="relative w-full h-[100px] flex-shrink-0">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                className="object-cover"
              />
              {/* Botón de info - separado del Dialog */}
              <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setProductoSeleccionado(producto.id);
                }}
              >
                <HiInformationCircle className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            {/* Contenido */}
            <CardContent className="p-2 flex flex-col flex-1 justify-between gap-4">
              <span className="font-medium text-gray-800 text-sm">{producto.nombre}</span>
              <span className="font-semibold text-red-500 text-md mt-auto">${producto.precio.toFixed(2)}</span>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Dialog fuera de las Cards - evita problemas de propagación */}
      {productoSeleccionado && (
        <DetailProduct
          producto={productos.find(p => p.id === productoSeleccionado)!}
          open={true}
          setOpen={(open) => !open && setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
}
