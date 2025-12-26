"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { Download, Calendar, TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react"

const COLORS = ["#4ade80", "#38bdf8", "#fbbf24", "#a78bfa", "#f87171"]

export default function ReportesPage() {
  const products = useStore((state) => state.products)
  const transactions = useStore((state) => state.transactions)
  const stockMovements = useStore((state) => state.stockMovements)
  const [period, setPeriod] = useState("month")

  // Calculate data for reports
  const categoryData = products.reduce(
    (acc, product) => {
      const existing = acc.find((c) => c.category === product.category)
      const value = product.price * product.stock
      if (existing) {
        existing.value += value
        existing.count += 1
        existing.stock += product.stock
      } else {
        acc.push({
          category: product.category,
          value,
          count: 1,
          stock: product.stock,
        })
      }
      return acc
    },
    [] as { category: string; value: number; count: number; stock: number }[],
  )

  const categoryLabels: Record<string, string> = {
    suplementos: "Suplementos",
    equipamiento: "Equipamiento",
    ropa: "Ropa",
    accesorios: "Accesorios",
    bebidas: "Bebidas",
  }

  const formattedCategoryData = categoryData.map((item) => ({
    name: categoryLabels[item.category] || item.category,
    value: Math.round(item.value),
    count: item.count,
    stock: item.stock,
  }))

  // Top selling products (simulated based on low stock)
  const topProducts = [...products]
    .sort((a, b) => b.minStock - b.stock - (a.minStock - a.stock))
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
      ventas: Math.floor(Math.random() * 100) + 20,
      ingresos: Math.floor(Math.random() * 5000) + 1000,
    }))

  // Monthly trend data
  const monthlyData = [
    { month: "Ene", ingresos: 8200, gastos: 4100, utilidad: 4100 },
    { month: "Feb", ingresos: 7800, gastos: 3900, utilidad: 3900 },
    { month: "Mar", ingresos: 9100, gastos: 4500, utilidad: 4600 },
    { month: "Abr", ingresos: 8600, gastos: 4300, utilidad: 4300 },
    { month: "May", ingresos: 9400, gastos: 4700, utilidad: 4700 },
    { month: "Jun", ingresos: 10200, gastos: 5100, utilidad: 5100 },
    { month: "Jul", ingresos: 9800, gastos: 4900, utilidad: 4900 },
    { month: "Ago", ingresos: 11200, gastos: 5600, utilidad: 5600 },
    { month: "Sep", ingresos: 10800, gastos: 5400, utilidad: 5400 },
    { month: "Oct", ingresos: 11500, gastos: 5750, utilidad: 5750 },
    { month: "Nov", ingresos: 12800, gastos: 6400, utilidad: 6400 },
    { month: "Dic", ingresos: 14500, gastos: 7250, utilidad: 7250 },
  ]

  // Stock movement trend
  const stockTrend = [
    { dia: "Lun", entradas: 45, salidas: 32 },
    { dia: "Mar", entradas: 38, salidas: 28 },
    { dia: "Mie", entradas: 52, salidas: 41 },
    { dia: "Jue", entradas: 41, salidas: 35 },
    { dia: "Vie", entradas: 65, salidas: 55 },
    { dia: "Sab", entradas: 78, salidas: 68 },
    { dia: "Dom", entradas: 35, salidas: 25 },
  ]

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const totalCost = products.reduce((sum, p) => sum + p.cost * p.stock, 0)
  const potentialProfit = totalValue - totalCost

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header title="Reportes" subtitle="Análisis y estadísticas del negocio" />

        <main className="p-4 lg:p-6 space-y-6 animate-fade-in">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mes</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ventas Totales</p>
                    <p className="text-xl font-bold">$124,580</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Productos Vendidos</p>
                    <p className="text-xl font-bold">1,847</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Utilidad Potencial</p>
                    <p className="text-xl font-bold">${potentialProfit.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transacciones</p>
                    <p className="text-xl font-bold">{transactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ventas" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="ventas">Ventas</TabsTrigger>
              <TabsTrigger value="inventario">Inventario</TabsTrigger>
              <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
            </TabsList>

            <TabsContent value="ventas" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Monthly Revenue */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ingresos Mensuales</CardTitle>
                    <CardDescription>Comparativa de ingresos, gastos y utilidad</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 12 }}
                            tickFormatter={(v) => `$${v / 1000}k`}
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
                          <Bar dataKey="ingresos" fill="#4ade80" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="gastos" fill="#f87171" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                    <CardDescription>Top 5 por volumen de ventas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topProducts} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} horizontal={false} />
                          <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 12 }}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 11 }}
                            width={120}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f2e",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                          <Bar dataKey="ventas" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventario" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Categoría</CardTitle>
                    <CardDescription>Valor del inventario por categoría</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={formattedCategoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {formattedCategoryData.map((_, index) => (
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
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {formattedCategoryData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-xs text-muted-foreground">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stock by Category */}
                <Card>
                  <CardHeader>
                    <CardTitle>Stock por Categoría</CardTitle>
                    <CardDescription>Unidades disponibles por categoría</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formattedCategoryData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 11 }}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f2e",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                          <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                            {formattedCategoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tendencias" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Profit Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tendencia de Utilidad</CardTitle>
                    <CardDescription>Evolución mensual de la utilidad neta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                          <defs>
                            <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 12 }}
                            tickFormatter={(v) => `$${v / 1000}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f2e",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, "Utilidad"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="utilidad"
                            stroke="#4ade80"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorUtilidad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Stock Movement Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Movimiento de Stock</CardTitle>
                    <CardDescription>Entradas vs Salidas por día</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stockTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                          <XAxis
                            dataKey="dia"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#888", fontSize: 12 }}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f1f2e",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="entradas"
                            stroke="#4ade80"
                            strokeWidth={2}
                            dot={{ fill: "#4ade80" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="salidas"
                            stroke="#f87171"
                            strokeWidth={2}
                            dot={{ fill: "#f87171" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#4ade80]" />
                        <span className="text-sm text-muted-foreground">Entradas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#f87171]" />
                        <span className="text-sm text-muted-foreground">Salidas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
