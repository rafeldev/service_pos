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
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "@/services/api/tables"
import { toast } from "sonner"
import type { Table } from "@/app/types/tableTypes"
import LoadingTable from "./LoadingTable"

export function TablesTable() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [formData, setFormData] = useState({
    numero: "",
    capacidad: "",
  })

  const loadTables = async () => {
    try {
      setLoading(true)
      const data = await getTables()
      setTables(data)
    } catch {
      toast.error("Error al cargar mesas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTables()
  }, [])

  const handleCreate = () => {
    setEditingTable(null)
    setFormData({
      numero: "",
      capacidad: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (table: Table) => {
    setEditingTable(table)
    setFormData({
      numero: table.numero,
      capacidad: table.capacidad?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (table: Table) => {
    if (!confirm(`¿Estás seguro de eliminar la ${table.numero}?`)) return

    try {
      await deleteTable(table.id)
      toast.success("Mesa eliminada correctamente")
      loadTables()
    } catch {
      toast.error("Error al eliminar mesa")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data: { numero: string; capacidad?: number } = {
        numero: formData.numero,
      }
      if (formData.capacidad) {
        data.capacidad = parseInt(formData.capacidad)
      }

      if (editingTable) {
        await updateTable(editingTable.id, data)
        toast.success("Mesa actualizada correctamente")
      } else {
        await createTable(data)
        toast.success("Mesa creada correctamente")
      }
      setIsDialogOpen(false)
      loadTables()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al guardar mesa"
      toast.error(message)
    }
  }

  const columns = [
    { key: "numero", label: "Número" },
    {
      key: "capacidad",
      label: "Capacidad",
      render: (item: Table) => item.capacidad || "N/A",
    },
    {
      key: "activa",
      label: "Estado",
      render: (item: Table) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.activa
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.activa ? "Activa" : "Inactiva"}
        </span>
      ),
    },
  ]

  if (loading) {
    return <LoadingTable message="Cargando mesas..." color="red" />
  }

  return (
    <>
      <DataTable
        title="Mesas"
        data={tables}
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
              {editingTable ? "Editar Mesa" : "Crear Mesa"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="capacidad">Capacidad</Label>
              <Input
                id="capacidad"
                type="number"
                min="1"
                value={formData.capacidad}
                onChange={(e) =>
                  setFormData({ ...formData, capacidad: e.target.value })
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

