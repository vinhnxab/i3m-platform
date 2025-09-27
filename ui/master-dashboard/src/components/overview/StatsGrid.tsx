import React from "react";
import StatCard from "./StatCard";
import { StatCard as StatCardType } from "./types";

interface StatsGridProps {
  stats: StatCardType[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
};

export default StatsGrid;
