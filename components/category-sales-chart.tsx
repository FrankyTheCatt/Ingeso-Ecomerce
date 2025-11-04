"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CategorySalesChartProps {
  data: Array<{ name: string; value: number }>
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function CategorySalesChart({ data }: CategorySalesChartProps) {
  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: COLORS[index % COLORS.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="flex items-center gap-8">
            <ChartContainer config={chartConfig} className="h-[250px] flex-1">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No hay datos de categorías
          </div>
        )}
      </CardContent>
    </Card>
  )
}
