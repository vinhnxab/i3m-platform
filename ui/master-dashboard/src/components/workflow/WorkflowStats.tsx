import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";
import { WorkflowStat } from "./types";

interface WorkflowStatsProps {
  stats: WorkflowStat[];
}

const WorkflowStats: React.FC<WorkflowStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground tracking-tight mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                <span className={`font-semibold ${
                  stat.change.startsWith('+') ? 'text-chart-2' : 'text-chart-4'
                }`}>
                  {stat.change}
                </span>
                {' '}from yesterday
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WorkflowStats;
