"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore, type Product } from "@/lib/store"
import { Package, DollarSign, Hash, Layers, FileText } from "lucide-react"

interface ProductModalProps {
  open: boolean
  onClose: () => void
  product?: Product | null
}

const categories = [
  { value: "suplementos", label: "Suplementos" },
  { value: "equipamiento", label: "Equipamiento" },
  { value: "ropa", label: "Ropa" },
  { value: "accesorios", label: "Accesorios" },
  { value: "bebidas", label: "Bebidas" },
]

export function ProductModal({ open, onClose, product }: ProductModalProps) {
  const addProduct = useStore((state) => state.addProduct)
  const updateProduct = useStore((state) => state.updateProduct)

  const [formData, setFormData] = useState({
    name: "",
    category: "suplementos" as Product["category"],
    sku: "",
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 10,
    image: "",
    description: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        sku: product.sku,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: product.minStock,
        image: product.image,
        description: product.description,
      })
    } else {
      setFormData({
        name: "",
        category: "suplementos",
        sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 10,
        image: "/gym-product.jpg",
        description: "",
      })
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (product) {
      updateProduct(product.id, formData)
    } else {
      addProduct(formData)
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {product ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {product ? "Modifica los datos del producto" : "Añade un nuevo producto al inventario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Proteína Whey Premium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value: Product["category"]) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                SKU
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Precio de Venta
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Costo
              </Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Stock Actual
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Stock Mínimo
              </Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number.parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe el producto..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{product ? "Guardar Cambios" : "Crear Producto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
