"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatCard } from "@/components/stat-card"
import { RevenueChart } from "@/components/charts/revenue-chart"
import { CategoryChart } from "@/components/charts/category-chart"
import { StockChart } from "@/components/charts/stock-chart"
import { RecentActivity } from "@/components/recent-activity"
import { LowStockAlert } from "@/components/low-stock-alert"
import { useStore } from "@/lib/store"
import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const products = useStore((state) => state.products)
  const getTotalInventoryValue = useStore((state) => state.getTotalInventoryValue)
  const getTotalRevenue = useStore((state) => state.getTotalRevenue)
  const getTotalExpenses = useStore((state) => state.getTotalExpenses)
  const getLowStockProducts = useStore((state) => state.getLowStockProducts)

  const totalInventoryValue = getTotalInventoryValue()
  const totalRevenue = getTotalRevenue()
  const totalExpenses = getTotalExpenses()
  const netProfit = totalRevenue - totalExpenses
  const lowStockCount = getLowStockProducts().length
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header title="Dashboard" subtitle="Resumen general del inventario y finanzas" />

        <main className="p-4 lg:p-6 space-y-6 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            <StatCard
              title="Valor del Inventario"
              value={`$${totalInventoryValue.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
              subtitle={`${totalProducts} productos`}
              icon={Package}
              trend={{ value: 12.5, label: "vs mes anterior" }}
            />
            <StatCard
              title="Ingresos Totales"
              value={`$${totalRevenue.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
              subtitle="Este período"
              icon={TrendingUp}
              trend={{ value: 8.2, label: "vs mes anterior" }}
              variant="success"
            />
            <StatCard
              title="Utilidad Neta"
              value={`$${netProfit.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
              subtitle={`Gastos: $${totalExpenses.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: netProfit > 0 ? 15.3 : -5.2, label: "margen" }}
              variant={netProfit > 0 ? "success" : "danger"}
            />
            <StatCard
              title="Alertas de Stock"
              value={lowStockCount}
              subtitle={`${totalStock.toLocaleString()} unidades totales`}
              icon={AlertTriangle}
              variant={lowStockCount > 0 ? "warning" : "default"}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 lg:grid-cols-3">
            <RevenueChart />
            <CategoryChart />
          </div>

          {/* Bottom Row */}
          <div className="grid gap-4 lg:grid-cols-3">
            <StockChart />
            <RecentActivity />
            <LowStockAlert />
          </div>
        </main>
      </div>
    </div>
  )
}
