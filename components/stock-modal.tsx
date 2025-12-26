"use client"

import type React from "react"

import { useState } from "react"
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
import { Package, ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockModalProps {
  open: boolean
  onClose: () => void
  product?: Product | null
}

export function StockModal({ open, onClose, product }: StockModalProps) {
  const products = useStore((state) => state.products)
  const addStockMovement = useStore((state) => state.addStockMovement)

  const [selectedProductId, setSelectedProductId] = useState<string>(product?.id || "")
  const [type, setType] = useState<"entrada" | "salida" | "ajuste">("entrada")
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) return

    addStockMovement({
      productId: selectedProductId,
      type,
      quantity,
      reason,
      date: new Date(),
      previousStock: selectedProduct.stock,
      newStock:
        type === "entrada"
          ? selectedProduct.stock + quantity
          : type === "salida"
            ? selectedProduct.stock - quantity
            : quantity,
    })

    setQuantity(0)
    setReason("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Movimiento de Stock
          </DialogTitle>
          <DialogDescription>Registra entrada, salida o ajuste de inventario</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Producto</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Selection */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType("entrada")}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                type === "entrada"
                  ? "border-green-500 bg-green-500/10 text-green-500"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <ArrowUpCircle className="h-5 w-5" />
              <span className="text-xs font-medium">Entrada</span>
            </button>
            <button
              type="button"
              onClick={() => setType("salida")}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                type === "salida"
                  ? "border-red-500 bg-red-500/10 text-red-500"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <ArrowDownCircle className="h-5 w-5" />
              <span className="text-xs font-medium">Salida</span>
            </button>
            <button
              type="button"
              onClick={() => setType("ajuste")}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                type === "ajuste"
                  ? "border-blue-500 bg-blue-500/10 text-blue-500"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <RefreshCw className="h-5 w-5" />
              <span className="text-xs font-medium">Ajuste</span>
            </button>
          </div>

          {selectedProduct && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">
                Stock actual: <span className="font-bold text-foreground">{selectedProduct.stock}</span> unidades
              </p>
              {quantity > 0 && (
                <p className="text-muted-foreground mt-1">
                  Nuevo stock:{" "}
                  <span
                    className={cn(
                      "font-bold",
                      type === "entrada" && "text-green-500",
                      type === "salida" && "text-red-500",
                      type === "ajuste" && "text-blue-500",
                    )}
                  >
                    {type === "entrada"
                      ? selectedProduct.stock + quantity
                      : type === "salida"
                        ? selectedProduct.stock - quantity
                        : quantity}
                  </span>{" "}
                  unidades
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{type === "ajuste" ? "Nuevo Stock" : "Cantidad"}</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity || ""}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Razón del movimiento..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedProductId || quantity <= 0}>
              Confirmar Movimiento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
