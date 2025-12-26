"use client"

import { useState } from "react"
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
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/api/categories"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import LoadingTable from "./LoadingTable"
import { Spinner } from "@/components/ui/spinner"

type Product = {
  id: number
  nombre: string
  precio: string
  activo: boolean
}

type Category = {
  id: number
  nombre: string
  createdAt: string
  updatedAt: string
  productos: Product[]
}

export function CategoriesTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
  })

  const queryClient = useQueryClient()

  const { data: categoriesData = [], isLoading: loading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({
      nombre: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      nombre: category.nombre,
    })
    setIsDialogOpen(true)
  }

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Categoría eliminada correctamente")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: () => {
      toast.error("Error al eliminar categoría")
    },
  })

  const handleDelete = (category: Category) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría ${category.nombre}?`))
      return
    deleteCategoryMutation.mutate(category.id)
  }

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Categoría creada correctamente")
      setIsDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Error al guardar categoría"
      toast.error(message)
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof formData }) => updateCategory(id, data),
    onSuccess: () => {
      toast.success("Categoría actualizada correctamente")
      setIsDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Error al guardar categoría"
      toast.error(message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: formData })
    } else {
      createCategoryMutation.mutate(formData)
    }
  }

  const isLoading = createCategoryMutation.isPending || updateCategoryMutation.isPending

  const columns = [
    { key: "nombre", label: "Nombre" },
    {
      key: "productos",
      label: "Productos",
      render: (item: Category) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">
            {item.productos.length} producto{item.productos.length !== 1 ? 's' : ''}
          </span>
          {item.productos.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.productos.slice(0, 3).map((product) => (
                <span
                  key={product.id}
                  className={`px-2 py-0.5 rounded text-xs ${
                    product.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  title={product.nombre}
                >
                  {product.nombre}
                </span>
              ))}
              {item.productos.length > 3 && (
                <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                  +{item.productos.length - 3} más
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
  ]

  if (loading) {
    return <LoadingTable message="Cargando categorías..." color="blue" />
  }

  return (
    <>
      <DataTable
        title="Categorías"
        data={categoriesData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        getId={(item) => item.id}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoría" : "Crear Categoría"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}