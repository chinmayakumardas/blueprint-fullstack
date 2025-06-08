"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  {
    name: "John",
    tasksCompleted: 24,
    onTimePercentage: 92,
  },
  {
    name: "Jane",
    tasksCompleted: 18,
    onTimePercentage: 89,
  },
  {
    name: "Robert",
    tasksCompleted: 15,
    onTimePercentage: 95,
  },
  {
    name: "Sarah",
    tasksCompleted: 21,
    onTimePercentage: 86,
  },
];

export function TeamPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="tasksCompleted" name="Tasks Completed" fill="hsl(var(--chart-1))" />
        <Bar yAxisId="right" dataKey="onTimePercentage" name="On-Time %" fill="hsl(var(--chart-2))" />
      </BarChart>
    </ResponsiveContainer>
  );
}