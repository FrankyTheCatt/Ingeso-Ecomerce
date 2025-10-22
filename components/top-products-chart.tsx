"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TopProductsChartProps {
  data: Array<{ name: string; quantity: number; revenue: number }>
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const chartData = data.map((product) => ({
    producto: product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name,
    cantidad: product.quantity,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer
            config={{
              cantidad: {
                label: "Cantidad",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px]"
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="producto"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="cantidad" fill="var(--color-cantidad)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No hay datos de productos
          </div>
        )}
      </CardContent>
    </Card>
  )
}
