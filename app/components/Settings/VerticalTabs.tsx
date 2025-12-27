"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomersTable } from "./CustomersTable"
import { TablesTable } from "./TablesTable"
import { ProductsTable } from "./ProductsTable"
import { CategoriesTable } from "./CategoriesTable"
import { cn } from "@/lib/utils"

export function VerticalTabs() {
  const [activeTab, setActiveTab] = useState("customers")
  console.log(activeTab, 'activeTab');

  return (
    <div className="flex h-full min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-row w-full">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 p-0">
          <TabsList className="flex-col h-auto w-full bg-transparent p-0 gap-0">
            <TabsTrigger 
              value="customers" 
              className={cn(
                "w-full rounded-none justify-start px-4 py-3 h-auto transition-colors text-md",
                activeTab === "customers" && "!bg-gray-400 text-white shadow-sm font-medium"
              )}
            >
              Clientes
            </TabsTrigger>
            <TabsTrigger 
              value="tables" 
              className={cn(
                "w-full rounded-none justify-start px-4 py-3 h-auto transition-colors text-md",
                activeTab === "tables" && "!bg-gray-400 text-white shadow-sm font-medium"
              )}
            >
              Mesas
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className={cn(
                "w-full rounded-none justify-start px-4 py-3 h-auto transition-colors text-md",
                activeTab === "products" && "!bg-gray-400 text-white shadow-sm font-medium"
              )}
            >
              Productos
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className={cn(
                "w-full rounded-none justify-start px-4 py-3 h-auto transition-colors text-md",
                activeTab === "categories" && "!bg-gray-400 text-white shadow-sm font-medium"
              )}
            >
              Categorías
            </TabsTrigger>
          </TabsList>
        </aside>
        
        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <TabsContent value="customers" className="mt-0">
            <CustomersTable />
          </TabsContent>
          <TabsContent value="tables" className="mt-0">
            <TablesTable />
          </TabsContent>
          <TabsContent value="products" className="mt-0">
            <ProductsTable />
          </TabsContent>
          <TabsContent value="categories" className="mt-0">
            <CategoriesTable />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

