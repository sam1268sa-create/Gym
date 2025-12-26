"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Ene", ingresos: 4200, gastos: 2400 },
  { month: "Feb", ingresos: 3800, gastos: 2100 },
  { month: "Mar", ingresos: 5100, gastos: 2800 },
  { month: "Abr", ingresos: 4600, gastos: 2500 },
  { month: "May", ingresos: 5400, gastos: 2900 },
  { month: "Jun", ingresos: 6200, gastos: 3200 },
  { month: "Jul", ingresos: 5800, gastos: 3000 },
  { month: "Ago", ingresos: 6800, gastos: 3400 },
  { month: "Sep", ingresos: 7200, gastos: 3600 },
  { month: "Oct", ingresos: 6500, gastos: 3300 },
  { month: "Nov", ingresos: 7800, gastos: 3800 },
  { month: "Dic", ingresos: 8500, gastos: 4100 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Flujo de Ingresos vs Gastos</CardTitle>
        <CardDescription>Comparativa mensual del año actual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#4ade80"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIngresos)"
                name="Ingresos"
              />
              <Area
                type="monotone"
                dataKey="gastos"
                stroke="#f87171"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGastos)"
                name="Gastos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#4ade80]" />
            <span className="text-sm text-muted-foreground">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#f87171]" />
            <span className="text-sm text-muted-foreground">Gastos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
