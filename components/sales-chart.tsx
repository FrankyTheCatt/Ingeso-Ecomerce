"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"

interface SalesChartProps {
  data: Array<{ total: number; created_at: string }>
}

export function SalesChart({ data }: SalesChartProps) {
  // Group sales by date
  const salesByDate = data.reduce(
    (acc: any, sale) => {
      const date = new Date(sale.created_at).toLocaleDateString("es-CL", {
        month: "short",
        day: "numeric",
      })
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += Number(sale.total)
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(salesByDate).map(([date, total]) => ({
    date,
    ventas: total,
  }))

  return (
    <Card className="col-span-1 shadow-sm border-voodoo-100 dark:border-voodoo-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-voodoo-900 dark:text-voodoo-50">Ventas Recientes</CardTitle>
          <p className="text-sm text-muted-foreground">Ingresos de los últimos 7 días</p>
        </div>
        <div className="h-8 w-8 bg-voodoo-100 dark:bg-voodoo-900 rounded-full flex items-center justify-center text-voodoo-600 dark:text-voodoo-400">
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c4f79" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c4f79" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0c7e0" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  tick={{ fill: '#664263', fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  tickFormatter={(value) => `$${value}`} 
                  tick={{ fill: '#664263', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #e0c7e0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`$${value}`, "Ventas"]}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#7c4f79"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVentas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No hay datos de ventas</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
