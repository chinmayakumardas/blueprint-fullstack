



"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

// Helper to get month name from date
const getMonthName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "short" });
};

// Transform Redux project data into chart format
const transformData = (projects) => {
  const monthMap = {};

  projects.forEach((project) => {
    const month = getMonthName(project.startDate);
    if (!monthMap[month]) {
      monthMap[month] = { name: month, completed: 0, active: 0, total: 0 };
    }

    if (project.status === "Completed") {
      monthMap[month].completed += 1;
    } else if (project.status === "In Progress") {
      monthMap[month].active += 1;
    }

    monthMap[month].total += 1;
  });

  const orderedMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return orderedMonths
    .map((month) => monthMap[month])
    .filter(Boolean);
};

export  function ProjectOverview() {
  const { projects = [] } = useSelector((state) => state.fetchallProjects);
  const chartData = useMemo(() => transformData(projects), [projects]);

  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          {/* Area under total projects */}
          <Area
            type="monotone"
            dataKey="total"
            fill="hsl(var(--chart-3), 0.2)"
            stroke="hsl(var(--chart-3), 1)"
            name="Total Projects"
          />

          {/* Bars for project statuses */}
          <Bar
            dataKey="completed"
            name="Completed"
            barSize={20}
            fill="hsl(var(--chart-1), 1)"
          />
          <Bar
            dataKey="active"
            name="In Progress"
            barSize={20}
            fill="hsl(var(--chart-2), 1)"
          />

          {/* Line for trend */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--chart-4), 1)"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Trend"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}




