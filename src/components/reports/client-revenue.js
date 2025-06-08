"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export function ClientRevenueTable() {
  const data = [
    {
      client: "ABC Corp",
      projectCount: 2,
      totalRevenue: "$15,000",
      growthRate: 15,
      status: "increasing",
    },
    {
      client: "XYZ Inc",
      projectCount: 3,
      totalRevenue: "$22,500",
      growthRate: -5,
      status: "decreasing",
    },
    {
      client: "client3",
      projectCount: 1,
      totalRevenue: "$8,000",
      growthRate: 0,
      status: "stable",
    },
    {
      client: "123 Shops",
      projectCount: 1,
      totalRevenue: "$12,000",
      growthRate: 20,
      status: "increasing",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Projects</TableHead>
          <TableHead>Total Revenue</TableHead>
          <TableHead>Growth Rate</TableHead>
          <TableHead>Utilization</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.client}>
            <TableCell className="font-medium">{item.client}</TableCell>
            <TableCell>{item.projectCount}</TableCell>
            <TableCell>{item.totalRevenue}</TableCell>
            <TableCell className={
              item.status === "increasing" 
                ? "text-green-500" 
                : item.status === "decreasing" 
                ? "text-red-500" 
                : ""
            }>
              {item.growthRate > 0 ? "+" : ""}{item.growthRate}%
            </TableCell>
            <TableCell>
              <div className="w-full">
                <Progress value={
                  item.client === "ABC Corp" ? 75 :
                  item.client === "XYZ Inc" ? 60 :
                  item.client === "client3" ? 25 :
                  item.client === "123 Shops" ? 100 : 0
                } />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}