"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { ArrowUpCircle, ArrowDownCircle, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function RecentActivity() {
  const transactions = useStore((state) => state.transactions)
  const stockMovements = useStore((state) => state.stockMovements)
  const products = useStore((state) => state.products)

  // Combine and sort activities
  const activities = [
    ...transactions.map((t) => ({
      id: t.id,
      type: "transaction" as const,
      subtype: t.type,
      title: t.category,
      description: t.description,
      amount: t.amount,
      date: new Date(t.date),
    })),
    ...stockMovements.map((m) => {
      const product = products.find((p) => p.id === m.productId)
      return {
        id: m.id,
        type: "stock" as const,
        subtype: m.type,
        title: product?.name || "Producto",
        description: m.reason,
        amount: m.quantity,
        date: new Date(m.date),
      }
    }),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8)

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimos movimientos del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 stagger-children">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  activity.type === "transaction" && activity.subtype === "ingreso" && "bg-green-500/10 text-green-500",
                  activity.type === "transaction" && activity.subtype === "egreso" && "bg-red-500/10 text-red-500",
                  activity.type === "stock" && activity.subtype === "entrada" && "bg-blue-500/10 text-blue-500",
                  activity.type === "stock" && activity.subtype === "salida" && "bg-orange-500/10 text-orange-500",
                  activity.type === "stock" && activity.subtype === "ajuste" && "bg-purple-500/10 text-purple-500",
                )}
              >
                {activity.type === "transaction" ? (
                  activity.subtype === "ingreso" ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )
                ) : (
                  <Package className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  {activity.type === "transaction" ? (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        activity.subtype === "ingreso" ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {activity.subtype === "ingreso" ? "+" : "-"}${activity.amount.toLocaleString()}
                    </span>
                  ) : (
                    <Badge variant="outline" className="shrink-0">
                      {activity.subtype === "entrada" ? "+" : activity.subtype === "salida" ? "-" : "="}
                      {activity.amount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(activity.date, "d MMM, HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
