"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { AlertTriangle, ArrowRight, Package } from "lucide-react"
import Link from "next/link"

export function LowStockAlert() {
  const getLowStockProducts = useStore((state) => state.getLowStockProducts)
  const lowStockProducts = getLowStockProducts()

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Estado del Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">Todos los productos tienen stock suficiente</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Stock
          </CardTitle>
          <Badge variant="destructive" className="animate-pulse">
            {lowStockProducts.length} productos
          </Badge>
        </div>
        <CardDescription>Productos que necesitan reposición urgente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowStockProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-lg bg-destructive/5 p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  Mínimo: {product.minStock} | Actual:{" "}
                  <span className="text-destructive font-semibold">{product.stock}</span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {lowStockProducts.length > 4 && (
          <Link href="/inventario">
            <Button variant="outline" className="w-full mt-2 bg-transparent">
              Ver todos ({lowStockProducts.length - 4} más)
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
