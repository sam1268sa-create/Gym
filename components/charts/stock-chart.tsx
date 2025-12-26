"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export function StockChart() {
  const products = useStore((state) => state.products)

  const stockData = products
    .map((p) => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
      stock: p.stock,
      minStock: p.minStock,
      isLow: p.stock <= p.minStock,
    }))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles de Stock</CardTitle>
        <CardDescription>Productos con menor inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 11 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: number) => [value, "Unidades"]}
              />
              <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isLow ? "#f87171" : "#4ade80"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#4ade80]" />
            <span className="text-sm text-muted-foreground">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#f87171]" />
            <span className="text-sm text-muted-foreground">Stock bajo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
