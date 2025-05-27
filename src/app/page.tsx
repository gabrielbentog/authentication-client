import type React from "react"
// import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, TrendingUp, Activity } from "lucide-react"

// Card Components criados diretamente no arquivo
function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`} {...props}>
      {children}
    </h3>
  )
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-muted-foreground ${className || ""}`} {...props}>
      {children}
    </p>
  )
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Bem-vindo de volta! Aqui está um resumo das suas atividades.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total de Usuários", value: "2,543", change: "+12%", icon: Users, color: "text-blue-600" },
            { title: "Vendas", value: "R$ 45.2k", change: "+8%", icon: TrendingUp, color: "text-green-600" },
            { title: "Conversões", value: "18.2%", change: "+2.1%", icon: BarChart3, color: "text-purple-600" },
            { title: "Atividade", value: "892", change: "+5%", icon: Activity, color: "text-orange-600" },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                {/* <Badge variant="secondary" className="mt-1 text-xs">
                  {stat.change} vs mês anterior
                </Badge> */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Message */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="text-xl">🎉 Login realizado com sucesso!</CardTitle>
            <CardDescription className="text-green-100">
              Você está conectado e pronto para explorar todas as funcionalidades.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
