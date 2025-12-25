"use client"

import { useState, useEffect } from "react"
import { DataTable } from "../DataTable/DataTable"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/api/products"
import { getCategories } from "@/services/api/categories"
import { toast } from "sonner"
import LoadingTable from "./LoadingTable"

type Product = {
  id: number
  nombre: string
  descripcion: string | null
  precio: string
  imagen: string | null
  activo: boolean
  categoriaId: number
  categoria: {
    id: number
    nombre: string
  }
  createdAt: string
  updatedAt: string
}

type Category = {
  id: number
  nombre: string
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoriaId: "",
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch {
      toast.error("Error al cargar productos")
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch {
      toast.error("Error al cargar categorías")
    }
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
      categoriaId: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio,
      imagen: product.imagen || "",
      categoriaId: product.categoriaId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar ${product.nombre}?`)) return

    try {
      await deleteProduct(product.id)
      toast.success("Producto eliminado correctamente")
      loadProducts()
    } catch {
      toast.error("Error al eliminar producto")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data: {
        nombre: string
        descripcion: string | null
        precio: number
        categoriaId: number
        imagen?: string
      } = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        precio: parseFloat(formData.precio),
        categoriaId: parseInt(formData.categoriaId),
      }
      if (formData.imagen) {
        data.imagen = formData.imagen
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
        toast.success("Producto actualizado correctamente")
      } else {
        await createProduct(data)
        toast.success("Producto creado correctamente")
      }
      setIsDialogOpen(false)
      loadProducts()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al guardar producto"
      toast.error(message)
    }
  }

  const columns = [
    { key: "nombre", label: "Nombre" },
    {
      key: "categoria",
      label: "Categoría",
      render: (item: Product) => item.categoria.nombre,
    },
    {
      key: "precio",
      label: "Precio",
      render: (item: Product) => `$${parseFloat(item.precio).toFixed(2)}`,
    },
    {
      key: "activo",
      label: "Estado",
      render: (item: Product) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.activo
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ]

  if (loading) {
    return <LoadingTable message="Cargando productos..." color="red" />
  }

  return (
    <>
      <DataTable
        title="Productos"
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        getId={(item) => item.id}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Producto" : "Crear Producto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precio">Precio *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="categoriaId">Categoría *</Label>
                <select
                  id="categoriaId"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.categoriaId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoriaId: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="imagen">URL de Imagen</Label>
              <Input
                id="imagen"
                value={formData.imagen}
                onChange={(e) =>
                  setFormData({ ...formData, imagen: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

