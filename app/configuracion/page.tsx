"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building, Bell, Shield, Save, Upload, Mail, Phone, MapPin, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracionPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState({
    lowStock: true,
    sales: true,
    reports: false,
    email: true,
  })

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido aplicados correctamente.",
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header title="Configuración" subtitle="Administra las preferencias del sistema" />

        <main className="p-4 lg:p-6 space-y-6 animate-fade-in">
          <Tabs defaultValue="perfil" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="perfil" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="empresa" className="gap-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Empresa</span>
              </TabsTrigger>
              <TabsTrigger value="notificaciones" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificaciones</span>
              </TabsTrigger>
              <TabsTrigger value="sistema" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Sistema</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="perfil">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Perfil</CardTitle>
                  <CardDescription>Actualiza tu información personal y preferencias</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/professional-gym-manager-portrait.jpg" />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">AD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Cambiar Foto
                      </Button>
                      <p className="text-xs text-muted-foreground">JPG, PNG o GIF. Máximo 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Form */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" defaultValue="Administrador" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" defaultValue="PowerGym" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="admin@powergym.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" defaultValue="+1 234 567 890" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select defaultValue="admin">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="manager">Gerente</SelectItem>
                          <SelectItem value="employee">Empleado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Tab */}
            <TabsContent value="empresa">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Empresa</CardTitle>
                  <CardDescription>Datos del gimnasio y configuración comercial</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="companyName">Nombre del Gimnasio</Label>
                      <Input id="companyName" defaultValue="PowerGym Pro" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">NIT / RIF</Label>
                      <Input id="taxId" defaultValue="123456789-0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moneda</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - Dólar</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="mxn">MXN - Peso Mexicano</SelectItem>
                          <SelectItem value="cop">COP - Peso Colombiano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Dirección</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="address" className="pl-9" defaultValue="Av. Principal #123, Centro Comercial" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email Comercial</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="companyEmail" className="pl-9" defaultValue="info@powergym.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="companyPhone" className="pl-9" defaultValue="+1 800 POWERGYM" />
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="website" className="pl-9" defaultValue="https://powergym.com" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notificaciones">
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de Notificaciones</CardTitle>
                  <CardDescription>Configura cómo y cuándo recibir alertas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <Label className="text-base">Alertas de Stock Bajo</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones cuando un producto alcance el stock mínimo
                        </p>
                      </div>
                      <Switch
                        checked={notifications.lowStock}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <Label className="text-base">Resumen de Ventas</Label>
                        <p className="text-sm text-muted-foreground">Notificaciones diarias con el resumen de ventas</p>
                      </div>
                      <Switch
                        checked={notifications.sales}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sales: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <Label className="text-base">Reportes Semanales</Label>
                        <p className="text-sm text-muted-foreground">Recibe un reporte completo cada semana</p>
                      </div>
                      <Switch
                        checked={notifications.reports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, reports: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notificaciones por Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar copias de las notificaciones al email registrado
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Preferencias
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="sistema">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración del Sistema</CardTitle>
                    <CardDescription>Ajustes generales y de rendimiento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Zona Horaria</Label>
                      <Select defaultValue="america_bogota">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america_bogota">América/Bogotá (GMT-5)</SelectItem>
                          <SelectItem value="america_mexico">América/México (GMT-6)</SelectItem>
                          <SelectItem value="america_lima">América/Lima (GMT-5)</SelectItem>
                          <SelectItem value="america_santiago">América/Santiago (GMT-4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Formato de Fecha</Label>
                      <Select defaultValue="dd_mm_yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Idioma</Label>
                      <Select defaultValue="es">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inventario</CardTitle>
                    <CardDescription>Configuración de alertas de stock</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultMinStock">Stock Mínimo por Defecto</Label>
                      <Input id="defaultMinStock" type="number" defaultValue="10" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Umbral de Alerta (%)</Label>
                      <Input id="lowStockThreshold" type="number" defaultValue="20" />
                      <p className="text-xs text-muted-foreground">
                        Alertar cuando el stock sea menor al X% del mínimo
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-reposición</Label>
                        <p className="text-xs text-muted-foreground">Generar órdenes automáticas de compra</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Datos del Sistema</CardTitle>
                    <CardDescription>Información y mantenimiento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-2xl font-bold text-primary">v2.1.0</p>
                        <p className="text-sm text-muted-foreground">Versión del Sistema</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-2xl font-bold text-primary">2.4 MB</p>
                        <p className="text-sm text-muted-foreground">Almacenamiento Usado</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-4 text-center">
                        <p className="text-2xl font-bold text-green-500">Activo</p>
                        <p className="text-sm text-muted-foreground">Estado del Sistema</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline">Exportar Datos</Button>
                      <Button variant="outline">Importar Datos</Button>
                      <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
                        Limpiar Caché
                      </Button>
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
