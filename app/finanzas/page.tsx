"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { TransactionModal } from "@/components/transaction-modal"
import { useStore, type Transaction } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { RevenueChart } from "@/components/charts/revenue-chart"
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function FinanzasPage() {
  const transactions = useStore((state) => state.transactions)
  const deleteTransaction = useStore((state) => state.deleteTransaction)
  const getTotalRevenue = useStore((state) => state.getTotalRevenue)
  const getTotalExpenses = useStore((state) => state.getTotalExpenses)

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

  const totalRevenue = getTotalRevenue()
  const totalExpenses = getTotalExpenses()
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id)
      setDeleteDialogOpen(false)
      setTransactionToDelete(null)
    }
  }

  const columns = [
    {
      key: "date",
      label: "Fecha",
      sortable: true,
      render: (transaction: Transaction) => (
        <div>
          <p className="font-medium">{format(new Date(transaction.date), "d MMM yyyy", { locale: es })}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(transaction.date), "HH:mm", { locale: es })}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Tipo",
      sortable: true,
      render: (transaction: Transaction) => (
        <div className="flex items-center gap-2">
          {transaction.type === "ingreso" ? (
            <ArrowUpCircle className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
          )}
          <Badge
            variant="outline"
            className={cn(
              transaction.type === "ingreso"
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20",
            )}
          >
            {transaction.type === "ingreso" ? "Ingreso" : "Egreso"}
          </Badge>
        </div>
      ),
    },
    {
      key: "category",
      label: "Categoría",
      sortable: true,
      render: (transaction: Transaction) => <p className="font-medium">{transaction.category}</p>,
    },
    {
      key: "description",
      label: "Descripción",
      render: (transaction: Transaction) => (
        <p className="text-muted-foreground max-w-[300px] truncate">{transaction.description}</p>
      ),
    },
    {
      key: "amount",
      label: "Monto",
      sortable: true,
      className: "text-right",
      render: (transaction: Transaction) => (
        <p className={cn("font-bold text-right", transaction.type === "ingreso" ? "text-green-500" : "text-red-500")}>
          {transaction.type === "ingreso" ? "+" : "-"}$
          {transaction.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
        </p>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (transaction: Transaction) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(transaction)
          }}
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const filterOptions = [
    { value: "ingreso", label: "Ingresos" },
    { value: "egreso", label: "Egresos" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header title="Finanzas" subtitle="Control de ingresos y gastos" />

        <main className="p-4 lg:p-6 space-y-6 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            <StatCard
              title="Ingresos Totales"
              value={`$${totalRevenue.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
              subtitle={`${transactions.filter((t) => t.type === "ingreso").length} transacciones`}
              icon={TrendingUp}
              trend={{ value: 12.5, label: "vs mes anterior" }}
              variant="success"
            />
            <StatCard
              title="Gastos Totales"
              value={`$${totalExpenses.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
              subtitle={`${transactions.filter((t) => t.type === "egreso").length} transacciones`}
              icon={TrendingDown}
              trend={{ value: -5.2, label: "vs mes anterior" }}
              variant="danger"
            />
            <StatCard
              title="Utilidad Neta"
              value={`$${netProfit.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
              subtitle={`Margen: ${profitMargin}%`}
              icon={DollarSign}
              trend={{ value: netProfit > 0 ? 18.3 : -10.5, label: "tendencia" }}
              variant={netProfit > 0 ? "success" : "danger"}
            />
            <StatCard
              title="Balance"
              value={`$${netProfit.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
              subtitle="Saldo disponible"
              icon={Wallet}
            />
          </div>

          {/* Chart */}
          <div className="grid gap-4 lg:grid-cols-3">
            <RevenueChart />

            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen por Categoría</CardTitle>
                <CardDescription>Distribución de ingresos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Ventas Suplementos",
                  "Ventas Equipamiento",
                  "Ventas Ropa",
                  "Ventas Accesorios",
                  "Ventas Bebidas",
                ].map((category) => {
                  const total = transactions
                    .filter((t) => t.type === "ingreso" && t.category === category)
                    .reduce((sum, t) => sum + t.amount, 0)
                  const percentage = totalRevenue > 0 ? (total / totalRevenue) * 100 : 0

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{category.replace("Ventas ", "")}</span>
                        <span className="font-medium">${total.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Transacciones</CardTitle>
                <CardDescription>Historial de movimientos financieros</CardDescription>
              </div>
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Transacción
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                data={transactions}
                columns={columns}
                searchKey="description"
                searchPlaceholder="Buscar transacciones..."
                filterOptions={filterOptions}
                filterKey="type"
                pageSize={10}
              />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modals */}
      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar transacción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La transacción será eliminada permanentemente del historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
