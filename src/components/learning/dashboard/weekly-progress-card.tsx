"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type WeeklyProgressCardProps = {
  weekHistory: Array<{ day: string; xp: number }>;
  className?: string;
};

function WeeklyProgressCard({ weekHistory, className }: WeeklyProgressCardProps) {
  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-text-primary">
          XP tuần này
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart
            data={weekHistory}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-card)",
              }}
              cursor={{ fill: "var(--surface-muted)" }}
            />
            <Bar
              dataKey="xp"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              name="XP"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export { WeeklyProgressCard };
