import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp, 
  Palette, 
  CheckCircle,
  FileText,
  Settings
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
  name: string;
  icon: LucideIcon;
  color: string;
  route?: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { name: 'Customers', icon: Users, color: 'bg-chart-2', route: '/customers' },
  { name: 'E-commerce', icon: ShoppingCart, color: 'bg-chart-3', route: '/ecommerce' },
  { name: 'Live Chat', icon: MessageSquare, color: 'bg-chart-4', route: '/livechat' },
  { name: 'Analytics', icon: TrendingUp, color: 'bg-primary', route: '/analytics' },
  { name: 'CMS', icon: FileText, color: 'bg-chart-5', route: '/cms' },
  { name: 'Settings', icon: Settings, color: 'bg-muted', route: '/settings' }
];

export function QuickActions({ 
  actions = DEFAULT_ACTIONS,
  title = "Quick Actions",
  description = "Frequently used platform features",
  className = ""
}: QuickActionsProps) {
  const navigate = useNavigate();

  const handleActionClick = (action: QuickAction) => {
    if (action.route) {
      navigate(action.route);
    } else if (action.onClick) {
      action.onClick();
    }
  };
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div 
                key={action.name} 
                className="flex flex-col items-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => handleActionClick(action)}
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center">{action.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
