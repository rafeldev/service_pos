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
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/api/customers"
import { toast } from "sonner"
import type { Customer } from "@/app/types/customerTypes"
import { Spinner } from "@/components/ui/spinner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import LoadingTable from "./LoadingTable"


export function CustomersTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    cedula: "",
    email: "",
    telefono: "",
  })

  const queryClient = useQueryClient()

  const { data: customersData = [], isLoading: loading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  })

  const handleCreate = () => {
    setEditingCustomer(null)
    setFormData({
      nombre: "",
      direccion: "",
      cedula: "",
      email: "",
      telefono: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      nombre: customer.nombre,
      direccion: customer.direccion || "",
      cedula: customer.cedula || "",
      email: customer.email || "",
      telefono: customer.telefono || "",
    })
    setIsDialogOpen(true)
  }

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      toast.success("Cliente eliminado correctamente")
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
    onError: () => {
      toast.error("Error al eliminar cliente")
    },
  })

  const handleDelete = (customer: Customer) => {
    if (!confirm(`¿Estás seguro de eliminar a ${customer.nombre}?`)) return
    deleteCustomerMutation.mutate(customer.id)
  }

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success("Cliente creado correctamente")
      setIsDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Error al guardar cliente"
      toast.error(message)
    },
  })

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof formData }) => updateCustomer(id, data),
    onSuccess: () => {
      toast.success("Cliente actualizado correctamente")
      setIsDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
    onError: (error: unknown) => {
      let message = "Error al guardar cliente"
      if (error instanceof Error) {
        message = error.message
        // Si hay detalles adicionales, mostrarlos en consola para debugging
        const errorWithDetails = error as Error & { details?: unknown }
        if (errorWithDetails.details) {
          console.error("Error details:", errorWithDetails.details)
        }
      }
      toast.error(message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCustomer) {
      updateCustomerMutation.mutate({ id: editingCustomer.id, data: formData })
    } else {
      createCustomerMutation.mutate(formData)
    }
  }

  const isLoading = createCustomerMutation.isPending || updateCustomerMutation.isPending

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "cedula", label: "Cédula" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    {
      key: "activo",
      label: "Estado",
      render: (item: Customer) => (
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
    return <LoadingTable message="Cargando clientes..." color="purple" />
  }

  return (
    <>
      <DataTable
        title="Clientes"
        data={customersData}
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
              {editingCustomer ? "Editar Cliente" : "Crear Cliente"}
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cedula">Cédula *</Label>
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) =>
                  setFormData({ ...formData, cedula: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2"  >
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
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

