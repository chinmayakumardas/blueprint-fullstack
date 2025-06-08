"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  {
    name: "Jan",
    revenue: 4000,
  },
  {
    name: "Feb",
    revenue: 5000,
  },
  {
    name: "Mar",
    revenue: 3500,
  },
  {
    name: "Apr",
    revenue: 6000,
  },
  {
    name: "May",
    revenue: 5500,
  },
  {
    name: "Jun",
    revenue: 7000,
  },
];

export function Chart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-1))" />
      </BarChart>
    </ResponsiveContainer>
  );
}