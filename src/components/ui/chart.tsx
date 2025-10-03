"use client"

import React from "react"
import { ResponsiveContainer, Tooltip, TooltipProps } from "recharts"

export interface ChartContainerProps {
    config?: Record<string, unknown>
  className?: string
  children: React.ReactElement
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ className, children }) => (
  <div className={`w-full ${className ?? "h-64"}`}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
)

export const ChartTooltip = (props: TooltipProps<any, any>) => <Tooltip {...props} />

export const ChartTooltipContent: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-[140px] bg-white dark:bg-slate-800 border rounded-md p-2 shadow-md text-sm">
      {label && <div className="text-xs text-gray-500 mb-1">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ background: p.color ?? p.payload?.fill }} />
            <div className="text-xs text-gray-600 dark:text-slate-300">{p.name ?? p.dataKey}</div>
          </div>
          <div className="font-medium">{p.value}</div>
        </div>
      ))}
    </div>
  )
}

interface CustomPieLabelProps {
  name?: string
  value?: number
  percent?: number
  x?: number
  y?: number
  midAngle?: number
  outerRadius?: number
  innerRadius?: number
  cx?: number
  cy?: number
  index?: number
}
