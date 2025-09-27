import {
  OverviewHeader,
  StatsGrid,
  SystemStatus,
  RecentActivity,
  LogoEffects,
  DEFAULT_STATS,
  DEFAULT_SYSTEM_STATUS,
  DEFAULT_RECENT_ACTIVITY,
  LOGO_EFFECTS,
} from '@/components/overview';

export function Overview() {
  // Use default data from constants, can be overridden with props in the future
  const stats = DEFAULT_STATS;
  const systemStatus = DEFAULT_SYSTEM_STATUS;
  const recentActivity = DEFAULT_RECENT_ACTIVITY;
  const logoEffects = LOGO_EFFECTS;

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <OverviewHeader />

      {/* Key Metrics */}
      <StatsGrid stats={stats} />

      {/* System Status & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-4">
        <SystemStatus services={systemStatus} />
        <LogoEffects effects={logoEffects} />
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  );
}