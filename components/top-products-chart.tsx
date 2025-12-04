"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Award } from "lucide-react"

interface TopProductsChartProps {
  data: Array<{ name: string; quantity: number; revenue: number }>
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const chartData = data.map((product) => ({
    producto: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
    full_name: product.name,
    cantidad: product.quantity,
  }))

  return (
    <Card className="col-span-1 shadow-sm border-voodoo-100 dark:border-voodoo-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-voodoo-900 dark:text-voodoo-50">Top Productos</CardTitle>
          <p className="text-sm text-muted-foreground">Los más vendidos por cantidad</p>
        </div>
        <div className="h-8 w-8 bg-voodoo-100 dark:bg-voodoo-900 rounded-full flex items-center justify-center text-voodoo-600 dark:text-voodoo-400">
          <Award className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0c7e0" opacity={0.5} />
                <XAxis
                  dataKey="producto"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: '#664263', fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10}
                  allowDecimals={false}
                  tick={{ fill: '#664263', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--voodoo-50)', opacity: 0.5 }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #e0c7e0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [value, "Unidades"]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                        return payload[0].payload.full_name;
                    }
                    return label;
                  }}
                />
                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#7c4f79' : '#b481b3'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No hay datos de productos
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
