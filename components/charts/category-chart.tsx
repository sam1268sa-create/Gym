"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

const COLORS = ["#4ade80", "#38bdf8", "#fbbf24", "#a78bfa", "#f87171"]

export function CategoryChart() {
  const products = useStore((state) => state.products)

  const categoryData = products.reduce(
    (acc, product) => {
      const existing = acc.find((c) => c.category === product.category)
      const value = product.price * product.stock
      if (existing) {
        existing.value += value
      } else {
        acc.push({ category: product.category, value })
      }
      return acc
    },
    [] as { category: string; value: number }[],
  )

  const categoryLabels: Record<string, string> = {
    suplementos: "Suplementos",
    equipamiento: "Equipamiento",
    ropa: "Ropa",
    accesorios: "Accesorios",
    bebidas: "Bebidas",
  }

  const formattedData = categoryData.map((item) => ({
    name: categoryLabels[item.category] || item.category,
    value: Math.round(item.value),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valor por Categoría</CardTitle>
        <CardDescription>Distribución del inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {formattedData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Valor"]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: "#888", fontSize: "12px" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
