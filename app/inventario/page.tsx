"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { ProductModal } from "@/components/product-modal"
import { StockModal } from "@/components/stock-modal"
import { useStore, type Product } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, Edit, Trash2, ArrowUpDown, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const categoryLabels: Record<string, string> = {
  suplementos: "Suplementos",
  equipamiento: "Equipamiento",
  ropa: "Ropa",
  accesorios: "Accesorios",
  bebidas: "Bebidas",
}

const categoryColors: Record<string, string> = {
  suplementos: "bg-green-500/10 text-green-500 border-green-500/20",
  equipamiento: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ropa: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  accesorios: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  bebidas: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
}

export default function InventarioPage() {
  const products = useStore((state) => state.products)
  const deleteProduct = useStore((state) => state.deleteProduct)

  const [productModalOpen, setProductModalOpen] = useState(false)
  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setProductModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id)
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleStockMovement = (product: Product) => {
    setSelectedProduct(product)
    setStockModalOpen(true)
  }

  const columns = [
    {
      key: "name",
      label: "Producto",
      sortable: true,
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Categoría",
      sortable: true,
      render: (product: Product) => (
        <Badge variant="outline" className={cn(categoryColors[product.category])}>
          {categoryLabels[product.category]}
        </Badge>
      ),
    },
    {
      key: "price",
      label: "Precio",
      sortable: true,
      render: (product: Product) => (
        <div>
          <p className="font-medium">${product.price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Costo: ${product.cost.toFixed(2)}</p>
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (product: Product) => {
        const isLow = product.stock <= product.minStock
        return (
          <div className="flex items-center gap-2">
            {isLow ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <div>
              <p className={cn("font-medium", isLow && "text-destructive")}>{product.stock} uds.</p>
              <p className="text-xs text-muted-foreground">Mín: {product.minStock}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "value",
      label: "Valor Total",
      sortable: true,
      render: (product: Product) => (
        <p className="font-medium">
          ${(product.price * product.stock).toLocaleString("es-ES", { minimumFractionDigits: 2 })}
        </p>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      className: "text-right",
      render: (product: Product) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleStockMovement(product)
            }}
            title="Movimiento de stock"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(product)
            }}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(product)
            }}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filterOptions = Object.entries(categoryLabels).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header title="Inventario" subtitle="Gestión de productos y stock" />

        <main className="p-4 lg:p-6 space-y-6 animate-fade-in">
          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Productos</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unidades Totales</p>
                    <p className="text-2xl font-bold">
                      {products.reduce((sum, p) => sum + p.stock, 0).toLocaleString()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Inventario</p>
                    <p className="text-2xl font-bold">
                      ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className={cn(products.filter((p) => p.stock <= p.minStock).length > 0 && "border-destructive/50")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Bajo</p>
                    <p className="text-2xl font-bold text-destructive">
                      {products.filter((p) => p.stock <= p.minStock).length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Productos</CardTitle>
                <CardDescription>Lista completa de productos del inventario</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProduct(null)
                    setStockModalOpen(true)
                  }}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Movimiento
                </Button>
                <Button
                  onClick={() => {
                    setSelectedProduct(null)
                    setProductModalOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={products}
                columns={columns}
                searchKey="name"
                searchPlaceholder="Buscar productos..."
                filterOptions={filterOptions}
                filterKey="category"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modals */}
      <ProductModal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
      />

      <StockModal
        open={stockModalOpen}
        onClose={() => {
          setStockModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto "{productToDelete?.name}" será eliminado permanentemente del
              inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
