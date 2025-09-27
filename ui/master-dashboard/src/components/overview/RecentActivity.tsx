import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui";
import { TrendingUp } from "lucide-react";
import { ActivityItem } from "./types";
import { ACTIVITY_TYPE_COLORS } from "./constants";

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-semibold text-foreground">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mr-3">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          Recent Activity
        </CardTitle>
        <CardDescription className="text-base font-medium text-muted-foreground">
          Latest platform activities and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
            >
              <div className={`w-3 h-3 rounded-full ${ACTIVITY_TYPE_COLORS[activity.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.action}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.customer}
                </p>
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
