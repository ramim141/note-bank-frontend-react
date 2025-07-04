"use client"

// components/dashboard/Enhanced3DPieChart.jsx

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { SparklesIcon } from "./DashboardIcons"

// Custom Tooltip to match the design in the image
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-xl transition-all duration-200 transform scale-105">
        <p className="font-semibold text-gray-800">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

// Custom Label renderer to place labels outside the pie chart
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, payload }) => {
  const radius = outerRadius + 30 // Distance of the label from the pie chart
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill={payload.color}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm font-bold transition-all duration-300 hover:scale-110"
    >
      {`${payload.name} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const RechartsPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-80 text-gray-500">
        <SparklesIcon size={64} className="mb-4 text-gray-300" />
        <p className="text-lg font-medium text-center animate-pulse">
          Upload notes to see your magical distribution
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: "100%", height: 350 }} className="transition-all duration-500 hover:scale-105">
      <ResponsiveContainer>
        <PieChart>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            className="transition-all duration-300 hover:drop-shadow-lg"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={entry.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RechartsPieChart
