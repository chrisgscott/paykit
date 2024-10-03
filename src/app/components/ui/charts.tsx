import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card } from "@/components/ui/card"

interface ChartData {
  [key: string]: string | number
}

interface ChartProps {
  data: ChartData[]
  type: 'line' | 'bar'
  dataKeys: string[]
  xAxisKey: string
  height?: number
  colors?: string[]
}

export const ChartContainer: React.FC<ChartProps> = ({
  data,
  type,
  dataKeys,
  xAxisKey,
  height = 350,
  colors = ['#2563eb', '#16a34a', '#dc2626']
}) => {
  const Chart = type === 'line' ? LineChart : BarChart

  return (
    <Card>
      <ResponsiveContainer width="100%" height={height}>
        <Chart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          {dataKeys.map((key, index) => (
            type === 'line' ? (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} />
            ) : (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
            )
          ))}
        </Chart>
      </ResponsiveContainer>
    </Card>
  )
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

export const ChartTooltipContent: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }

  return null
}