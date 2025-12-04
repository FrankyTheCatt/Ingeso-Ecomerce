"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { PieChart as PieChartIcon } from "lucide-react"

interface CategorySalesChartProps {
  data: Array<{ name: string; value: number }>
}

// Voodoo palette colors
const COLORS = [
  "#7c4f79", // voodoo-700
  "#b481b3", // voodoo-500
  "#cca6cb", // voodoo-400
  "#e0c7e0", // voodoo-300
  "#976295", // voodoo-600
]

export function CategorySalesChart({ data }: CategorySalesChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-voodoo-100 dark:border-voodoo-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-voodoo-900 dark:text-voodoo-50">Ventas por Categoría</CardTitle>
          <p className="text-sm text-muted-foreground">Distribución de ingresos</p>
        </div>
        <div className="h-8 w-8 bg-voodoo-100 dark:bg-voodoo-900 rounded-full flex items-center justify-center text-voodoo-600 dark:text-voodoo-400">
            <PieChartIcon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
            {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        border: '1px solid #e0c7e0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => `$${value}`}
                />
                <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                />
                <Pie 
                    data={data} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="40%" 
                    cy="50%" 
                    innerRadius={60}
                    outerRadius={100} 
                    paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                No hay datos de categorías
            </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
