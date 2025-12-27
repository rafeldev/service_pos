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
import type { Table } from "@/app/types/domain/tableTypes"
import LoadingTable from "./LoadingTable"
import { Spinner } from "@/components/ui/spinner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function TablesTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [formData, setFormData] = useState({
    numero: "",
    capacidad: "",
  })

  const queryClient = useQueryClient()


  const { data: tablesData = [], isLoading: loading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

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

  const deleteTableMutation = useMutation({
    mutationFn: (id: number) => deleteTable(id),
    onSuccess: () => {
      toast.success("Mesa eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: () => {
      toast.error("Error al eliminar mesa");
    }
  });

  const createTableMutation = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      toast.success("Mesa creada correctamente")
      setIsDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["tables"] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Error al guardar mesa"
      toast.error(message)
    }
  })

  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { numero: string; capacidad?: number } }) => updateTable(id, data),
    onSuccess: () => {
      toast.success("Mesa actualizada correctamente")
      setIsDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["tables"] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Error al guardar mesa"
      toast.error(message)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data: { numero: string; capacidad?: number } = {
      numero: formData.numero,
    }
    if (formData.capacidad) {
      data.capacidad = parseInt(formData.capacidad)
    }

    if (editingTable) {
      updateTableMutation.mutate({ id: editingTable.id, data })
    } else {
      createTableMutation.mutate(data)
    }
  }

  const handleDelete = (table: Table) => {
    if (!confirm(`¿Estás seguro de eliminar la ${table.numero}?`)) return;
    deleteTableMutation.mutate(table.id);
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

  const isLoading = createTableMutation.isPending || updateTableMutation.isPending
  
  if (loading) {
    return <LoadingTable message="Cargando mesas..." color="red" />
  }

  return (
    <>
      <DataTable
        title="Mesas"
        data={tablesData}
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
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Guardando...
                  </>
                ) : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

