"use client";
import * as React from "react"
import * as Recharts from "recharts"

import { cn } from "@/lib/utils"

export function ChartContainer({ className, children, ...props }) {
  return (
    <div className={cn("relative w-full h-64", className)} {...props}>
      {children}
    </div>
  )
}

export const ResponsiveContainer = Recharts.ResponsiveContainer
export const LineChart = Recharts.LineChart
export const Line = Recharts.Line
export const XAxis = Recharts.XAxis
export const YAxis = Recharts.YAxis
export const Tooltip = Recharts.Tooltip
export const CartesianGrid = Recharts.CartesianGrid
export const Legend = Recharts.Legend
