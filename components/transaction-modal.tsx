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
import { useStore } from "@/lib/store"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionModalProps {
  open: boolean
  onClose: () => void
}

const incomeCategories = [
  "Ventas Suplementos",
  "Ventas Equipamiento",
  "Ventas Ropa",
  "Ventas Accesorios",
  "Ventas Bebidas",
  "Membresías",
  "Otros Ingresos",
]

const expenseCategories = [
  "Compra Inventario",
  "Gastos Operativos",
  "Salarios",
  "Servicios",
  "Mantenimiento",
  "Marketing",
  "Otros Gastos",
]

export function TransactionModal({ open, onClose }: TransactionModalProps) {
  const addTransaction = useStore((state) => state.addTransaction)

  const [type, setType] = useState<"ingreso" | "egreso">("ingreso")
  const [formData, setFormData] = useState({
    category: "",
    amount: 0,
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    addTransaction({
      type,
      category: formData.category,
      amount: formData.amount,
      description: formData.description,
      date: new Date(),
    })

    setFormData({ category: "", amount: 0, description: "" })
    onClose()
  }

  const categories = type === "ingreso" ? incomeCategories : expenseCategories

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Nueva Transacción
          </DialogTitle>
          <DialogDescription>Registra un nuevo movimiento financiero</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("ingreso")}
              className={cn(
                "flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                type === "ingreso"
                  ? "border-green-500 bg-green-500/10 text-green-500"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Ingreso</span>
            </button>
            <button
              type="button"
              onClick={() => setType("egreso")}
              className={cn(
                "flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                type === "egreso"
                  ? "border-red-500 bg-red-500/10 text-red-500"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <TrendingDown className="h-5 w-5" />
              <span className="font-medium">Egreso</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-7"
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalle de la transacción..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={cn(
                type === "ingreso" && "bg-green-600 hover:bg-green-700",
                type === "egreso" && "bg-red-600 hover:bg-red-700",
              )}
            >
              Registrar {type === "ingreso" ? "Ingreso" : "Egreso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
