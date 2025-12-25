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
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/api/categories"
import { toast } from "sonner"
import LoadingTable from "./LoadingTable"

type Category = {
  id: number
  nombre: string
  createdAt: string
  updatedAt: string
}

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
  })

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch {
      toast.error("Error al cargar categorías")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

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

  const handleDelete = async (category: Category) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría ${category.nombre}?`))
      return

    try {
      await deleteCategory(category.id)
      toast.success("Categoría eliminada correctamente")
      loadCategories()
    } catch {
      toast.error("Error al eliminar categoría")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
        toast.success("Categoría actualizada correctamente")
      } else {
        await createCategory(formData)
        toast.success("Categoría creada correctamente")
      }
      setIsDialogOpen(false)
      loadCategories()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al guardar categoría"
      toast.error(message)
    }
  }

  const columns = [{ key: "nombre", label: "Nombre" }]

  if (loading) {
    return <LoadingTable message="Cargando categorías..." color="blue" />
  }

  return (
    <>
      <DataTable
        title="Categorías"
        data={categories}
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

