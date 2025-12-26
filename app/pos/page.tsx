"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import DetailProduct from "../components/DetailProduct/DetailProduct";
import useCartStore from "@/store/useCartStore";
import { HiInformationCircle } from "react-icons/hi";
import { getCategories } from "@/services/api/categories";
import { getProducts } from "@/services/api/products";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/app/types/categoryTypes";


type Producto = {
  id: number;
  nombre: string;
  precio: string; // Viene como string desde Prisma (Decimal)
  descripcion: string | null;
  imagen: string | null;
  activo: boolean;
  categoriaId: number;
  categoria: {
    id: number;
    nombre: string;
  };
}

export default function PosPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null);

  const { addToCart } = useCartStore()

  const { data: categoriesData = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const { data: productsData = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products", categoriaSeleccionada],
    queryFn: () => getProducts(categoriaSeleccionada || undefined),
    enabled: true, // Siempre cargar productos
  })






  const handleAddToCart = (producto: Producto) => {
    const precio = parseFloat(producto.precio);
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      price: precio,
      quantity: 1,
    })
  }

  const getProductoImagen = (producto: Producto) => {
    return producto.imagen || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop";
  }
  return (
    <div className="w-full space-y-6">
      {/* Contenedor de Categorías */}
      <div className="flex gap-4 flex-wrap">
        <Card
          onClick={() => setCategoriaSeleccionada(null)}
          className={`cursor-pointer hover:shadow-lg transition-all min-w-[150px] rounded-[8px] ${categoriaSeleccionada === null
              ? "bg-gray-600 shadow-md"
              : "bg-white"
            }`}
        >
          <CardContent className="p-0 flex items-center justify-center">
            <span className={`font-medium ${categoriaSeleccionada === null
                ? "text-white"
                : "text-gray-800"
              }`}>
              Todos
            </span>
          </CardContent>
        </Card>
        {categoriesData.map((categoria: Category) => (
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
      {loadingProducts ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-500">Cargando productos...</span>
        </div>
      ) : productsData.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-gray-500">No hay productos disponibles</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {productsData.map((producto: Producto) => {
            const precio = parseFloat(producto.precio);
            return (
              <Card
                key={producto.id}
                className="cursor-pointer gap-0 hover:shadow-lg w-[150px] transition-shadow overflow-hidden rounded-[8px] py-0 flex flex-col"
                onClick={() => handleAddToCart(producto)}
              >
                {/* Imagen con botón de info */}
                <div className="relative w-full h-[100px] flex-shrink-0">
                  <Image
                    src={getProductoImagen(producto)}
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
                  <span className="font-semibold text-red-500 text-md mt-auto">${precio}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog fuera de las Cards - evita problemas de propagación */}
      {productoSeleccionado && (() => {
        const producto = productsData.find((p: Producto) => p.id === productoSeleccionado);
        if (!producto) return null;
        const precio = parseFloat(producto.precio);
        return (
          <DetailProduct
            producto={{
              id: producto.id,
              nombre: producto.nombre,
              imagen: getProductoImagen(producto),
              precio: precio,
              descripcion: producto.descripcion || "",
            }}
            open={true}
            setOpen={(open) => !open && setProductoSeleccionado(null)}
          />
        );
      })()}
    </div>
  );
}
