"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Week 1",
    completed: 5,
    pending: 8,
  },
  {
    name: "Week 2",
    completed: 7,
    pending: 6,
  },
  {
    name: "Week 3",
    completed: 10,
    pending: 4,
  },
  {
    name: "Week 4",
    completed: 8,
    pending: 7,
  }
];

export function TaskCompletionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="completed" name="Completed Tasks" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="pending" name="Pending Tasks" stroke="hsl(var(--chart-2))" />
      </LineChart>
    </ResponsiveContainer>
  );
}