"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
    <Card>
      <CardHeader>
        <CardTitle>Ventas (Últimos 7 días)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer
            config={{
              ventas: {
                label: "Ventas",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="var(--color-ventas)"
                fill="var(--color-ventas)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">No hay datos de ventas</div>
        )}
      </CardContent>
    </Card>
  )
}
