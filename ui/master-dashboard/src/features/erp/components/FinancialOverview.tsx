import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialData {
  revenue: string;
  expenses: string;
  profit: string;
  revenueChange: string;
  expensesChange: string;
  profitChange: string;
}

interface FinancialOverviewProps {
  data: FinancialData;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Key financial metrics and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Revenue</h3>
                <TrendingUp className="w-4 h-4 text-chart-2" />
              </div>
              <p className="text-2xl font-bold text-chart-2">{data.revenue}</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-chart-2">{data.revenueChange}</span> from last month
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Expenses</h3>
                <TrendingDown className="w-4 h-4 text-chart-4" />
              </div>
              <p className="text-2xl font-bold text-chart-4">{data.expenses}</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-chart-4">{data.expensesChange}</span> from last month
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Profit</h3>
                <TrendingUp className="w-4 h-4 text-chart-1" />
              </div>
              <p className="text-2xl font-bold text-chart-1">{data.profit}</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-chart-1">{data.profitChange}</span> from last month
              </p>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
