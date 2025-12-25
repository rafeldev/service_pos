"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  title: string
  data: T[]
  columns: Column<T>[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onCreate: () => void
  getId: (item: T) => number | string
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  onEdit,
  onDelete,
  onCreate,
  getId,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={onCreate}>Crear</Button>
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={getId(item)} className="border-b">
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-4 py-3">
                        {column.render
                          ? column.render(item)
                          : String(item[column.key] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

