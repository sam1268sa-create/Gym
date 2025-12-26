"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Product {
  id: string
  name: string
  category: "suplementos" | "equipamiento" | "ropa" | "accesorios" | "bebidas"
  sku: string
  price: number
  cost: number
  stock: number
  minStock: number
  image: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  type: "ingreso" | "egreso"
  category: string
  amount: number
  description: string
  date: Date
  productId?: string
}

export interface StockMovement {
  id: string
  productId: string
  type: "entrada" | "salida" | "ajuste"
  quantity: number
  reason: string
  date: Date
  previousStock: number
  newStock: number
}

interface StoreState {
  products: Product[]
  transactions: Transaction[]
  stockMovements: StockMovement[]

  // Product actions
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  deleteTransaction: (id: string) => void

  // Stock movement actions
  addStockMovement: (movement: Omit<StockMovement, "id">) => void

  // Computed
  getTotalInventoryValue: () => number
  getTotalRevenue: () => number
  getTotalExpenses: () => number
  getLowStockProducts: () => Product[]
}

// Initial gym products
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Proteína Whey Gold Standard",
    category: "suplementos",
    sku: "SUP-001",
    price: 89.99,
    cost: 55.0,
    stock: 45,
    minStock: 10,
    image: "/whey-protein-gold-standard-container.jpg",
    description: "Proteína de suero de alta calidad, 24g de proteína por porción",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Creatina Monohidrato 500g",
    category: "suplementos",
    sku: "SUP-002",
    price: 34.99,
    cost: 18.0,
    stock: 32,
    minStock: 15,
    image: "/creatine-monohydrate-powder-container.jpg",
    description: "Creatina pura para mejorar rendimiento y fuerza",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    name: "Pre-Workout C4 Original",
    category: "suplementos",
    sku: "SUP-003",
    price: 44.99,
    cost: 25.0,
    stock: 28,
    minStock: 10,
    image: "/c4-pre-workout-supplement-container.jpg",
    description: "Pre-entreno con cafeína y beta-alanina para máxima energía",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "4",
    name: "Mancuernas Ajustables 24kg",
    category: "equipamiento",
    sku: "EQP-001",
    price: 299.99,
    cost: 180.0,
    stock: 8,
    minStock: 3,
    image: "/adjustable-dumbbells-set-black.jpg",
    description: "Par de mancuernas ajustables de 2.5kg a 24kg cada una",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "5",
    name: "Banda de Resistencia Set",
    category: "equipamiento",
    sku: "EQP-002",
    price: 29.99,
    cost: 12.0,
    stock: 65,
    minStock: 20,
    image: "/resistance-bands-set-colorful.jpg",
    description: "Set de 5 bandas de diferentes resistencias",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "6",
    name: "Camiseta Dry-Fit Premium",
    category: "ropa",
    sku: "ROP-001",
    price: 34.99,
    cost: 15.0,
    stock: 120,
    minStock: 30,
    image: "/black-dryfit-gym-tshirt.jpg",
    description: "Camiseta deportiva con tecnología de secado rápido",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "7",
    name: "Shorts Entrenamiento Pro",
    category: "ropa",
    sku: "ROP-002",
    price: 39.99,
    cost: 18.0,
    stock: 85,
    minStock: 25,
    image: "/black-gym-training-shorts.jpg",
    description: "Shorts ligeros con bolsillos laterales",
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
  },
  {
    id: "8",
    name: "Guantes de Entrenamiento",
    category: "accesorios",
    sku: "ACC-001",
    price: 24.99,
    cost: 10.0,
    stock: 55,
    minStock: 15,
    image: "/black-gym-training-gloves.jpg",
    description: "Guantes con soporte de muñeca y agarre antideslizante",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
  {
    id: "9",
    name: "Shaker Pro 700ml",
    category: "accesorios",
    sku: "ACC-002",
    price: 14.99,
    cost: 5.0,
    stock: 150,
    minStock: 40,
    image: "/black-protein-shaker-bottle.jpg",
    description: "Shaker con bola mezcladora y compartimento extra",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "10",
    name: "Bebida Isotónica Pack 12",
    category: "bebidas",
    sku: "BEB-001",
    price: 24.99,
    cost: 14.0,
    stock: 48,
    minStock: 20,
    image: "/isotonic-sports-drink-bottles-pack.jpg",
    description: "Pack de 12 bebidas isotónicas de 500ml",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "11",
    name: "BCAA Powder 300g",
    category: "suplementos",
    sku: "SUP-004",
    price: 29.99,
    cost: 15.0,
    stock: 5,
    minStock: 12,
    image: "/bcaa-amino-acids-powder-container.jpg",
    description: "Aminoácidos de cadena ramificada para recuperación",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "12",
    name: "Cinturón Levantamiento Pro",
    category: "accesorios",
    sku: "ACC-003",
    price: 49.99,
    cost: 25.0,
    stock: 3,
    minStock: 8,
    image: "/black-leather-weightlifting-belt.jpg",
    description: "Cinturón de cuero genuino para levantamiento de pesas",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
]

// Initial transactions
const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "ingreso",
    category: "Ventas Suplementos",
    amount: 2450.5,
    description: "Ventas del día - Proteínas y creatinas",
    date: new Date("2024-12-10"),
  },
  {
    id: "2",
    type: "ingreso",
    category: "Ventas Ropa",
    amount: 890.0,
    description: "Ventas camisetas y shorts",
    date: new Date("2024-12-11"),
  },
  {
    id: "3",
    type: "egreso",
    category: "Compra Inventario",
    amount: 3200.0,
    description: "Reposición de suplementos",
    date: new Date("2024-12-12"),
  },
  {
    id: "4",
    type: "ingreso",
    category: "Ventas Equipamiento",
    amount: 1799.94,
    description: "Venta 6 sets mancuernas",
    date: new Date("2024-12-13"),
  },
  {
    id: "5",
    type: "egreso",
    category: "Gastos Operativos",
    amount: 450.0,
    description: "Servicios y mantenimiento",
    date: new Date("2024-12-14"),
  },
  {
    id: "6",
    type: "ingreso",
    category: "Ventas Accesorios",
    amount: 560.0,
    description: "Guantes, shakers y cinturones",
    date: new Date("2024-12-15"),
  },
  {
    id: "7",
    type: "egreso",
    category: "Compra Inventario",
    amount: 1800.0,
    description: "Compra ropa deportiva",
    date: new Date("2024-12-15"),
  },
  {
    id: "8",
    type: "ingreso",
    category: "Ventas Bebidas",
    amount: 374.85,
    description: "Ventas bebidas isotónicas",
    date: new Date("2024-12-16"),
  },
]

// Initial stock movements
const initialStockMovements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    type: "entrada",
    quantity: 50,
    reason: "Reposición de inventario",
    date: new Date("2024-12-01"),
    previousStock: 15,
    newStock: 65,
  },
  {
    id: "2",
    productId: "1",
    type: "salida",
    quantity: 20,
    reason: "Ventas",
    date: new Date("2024-12-10"),
    previousStock: 65,
    newStock: 45,
  },
  {
    id: "3",
    productId: "4",
    type: "salida",
    quantity: 6,
    reason: "Ventas",
    date: new Date("2024-12-13"),
    previousStock: 14,
    newStock: 8,
  },
  {
    id: "4",
    productId: "11",
    type: "salida",
    quantity: 15,
    reason: "Ventas",
    date: new Date("2024-12-14"),
    previousStock: 20,
    newStock: 5,
  },
  {
    id: "5",
    productId: "12",
    type: "salida",
    quantity: 7,
    reason: "Ventas",
    date: new Date("2024-12-15"),
    previousStock: 10,
    newStock: 3,
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      transactions: initialTransactions,
      stockMovements: initialStockMovements,

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, { ...transaction, id: crypto.randomUUID() }],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      addStockMovement: (movement) => {
        const product = get().products.find((p) => p.id === movement.productId)
        if (product) {
          let newStock = product.stock
          if (movement.type === "entrada") newStock += movement.quantity
          else if (movement.type === "salida") newStock -= movement.quantity
          else newStock = movement.quantity

          set((state) => ({
            stockMovements: [...state.stockMovements, { ...movement, id: crypto.randomUUID() }],
            products: state.products.map((p) =>
              p.id === movement.productId ? { ...p, stock: newStock, updatedAt: new Date() } : p,
            ),
          }))
        }
      },

      getTotalInventoryValue: () => {
        return get().products.reduce((total, p) => total + p.price * p.stock, 0)
      },

      getTotalRevenue: () => {
        return get()
          .transactions.filter((t) => t.type === "ingreso")
          .reduce((total, t) => total + t.amount, 0)
      },

      getTotalExpenses: () => {
        return get()
          .transactions.filter((t) => t.type === "egreso")
          .reduce((total, t) => total + t.amount, 0)
      },

      getLowStockProducts: () => {
        return get().products.filter((p) => p.stock <= p.minStock)
      },
    }),
    {
      name: "powergym-storage",
    },
  ),
)
