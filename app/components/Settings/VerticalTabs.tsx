"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomersTable } from "./CustomersTable"
import { TablesTable } from "./TablesTable"
import { ProductsTable } from "./ProductsTable"
import { CategoriesTable } from "./CategoriesTable"

export function VerticalTabs() {
  return (
    <div className="flex h-full min-h-screen">
      <Tabs defaultValue="customers" className="flex flex-row w-full">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 p-4">
          <TabsList className="flex-col h-auto w-full bg-transparent p-0 gap-2">
            <TabsTrigger 
              value="customers" 
              className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Clientes
            </TabsTrigger>
            <TabsTrigger 
              value="tables" 
              className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Mesas
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Productos
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="w-full justify-start px-4 py-3 h-auto data-[state=active]:bg-background data-[state=active]:shadow-sm"
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

