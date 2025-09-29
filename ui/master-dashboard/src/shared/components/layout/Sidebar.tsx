import { useEffect, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingCart, 
  MessageSquare, 
  Store, 
  Package,
  BarChart3, 
  Building2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Brain,
  Workflow,
  Shield,
  Activity,
  Database,
  X,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button, Badge, cn } from '../ui';
import { I3MLogo } from '../common/I3MLogo';
import { routes, RouteId } from '@/app/router';
import { usePermissions } from '../../../hooks/usePermissions';

interface SidebarProps {
  activeSection?: RouteId;
  onSectionChange?: (section: RouteId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileToggle: () => void;
}

export const Sidebar = memo(function Sidebar({
  activeSection, 
  onSectionChange, 
  collapsed, 
  onToggleCollapse, 
  isMobile, 
  mobileOpen, 
  onMobileToggle 
}: SidebarProps) {
  const location = useLocation();
  const { canAccess } = usePermissions();
  
  // Get active section from URL path
  const getActiveSectionFromPath = (): RouteId => {
    const path = location.pathname;
    const route = routes.find(r => r.path === path);
    return route?.id || 'overview';
  };

  // Filter routes based on user permissions
  const getFilteredRoutes = () => {
    return routes.filter(route => {
      // Always show overview
      if (route.id === 'overview') return true;
      
      // Check permission for other routes
      return canAccess(route.id as any);
    });
  };

  const filteredRoutes = getFilteredRoutes();

  // Use URL-based active section if no activeSection prop provided
  const currentActiveSection = activeSection || getActiveSectionFromPath();
  
  // Close mobile sidebar when section changes
  const handleSectionChange = (section: RouteId) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    if (isMobile && mobileOpen) {
      onMobileToggle();
    }
  };

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && mobileOpen) {
        onMobileToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, mobileOpen, onMobileToggle]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      LayoutDashboard,
      Building2,
      FileText,
      ShoppingCart,
      MessageSquare,
      Store,
      Package,
      BarChart3,
      Users,
      Calendar,
      Brain,
      Workflow,
      Shield,
      Activity,
      Database,
      Globe,
      Settings
    };
    return icons[iconName] || LayoutDashboard;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (mobileOpen ? 280 : 0) : (collapsed ? 80 : 280),
          opacity: isMobile ? (mobileOpen ? 1 : 0) : 1
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
          mass: 0.8
        }}
        className={cn(
          "bg-background/95 backdrop-blur-xl border-r border-border/30 flex flex-col flex-shrink-0",
          isMobile ? "fixed top-0 left-0 z-50 h-full" : "relative z-auto h-full mt-20",
          isMobile && !mobileOpen && "pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <I3MLogo size="sm" animated={false} theme="auto" />
              <span className="font-semibold text-foreground">I3M Platform</span>
            </motion.div>
          )}
          
          {collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center w-full"
            >
              <I3MLogo size="sm" animated={false} theme="auto" />
            </motion.div>
          )}

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden lg:flex rounded-xl p-2 hover:bg-muted/50"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>

          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileToggle}
              className="lg:hidden rounded-xl p-2 hover:bg-muted/50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto hide-scrollbar">
          {filteredRoutes.map((route, index) => {
            const Icon = getIcon(route.icon);
            const isActive = currentActiveSection === route.id;
            
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={route.path}
                  onClick={() => handleSectionChange(route.id)}
                  className={cn(
                    "flex items-center w-full h-12 px-4 rounded-xl transition-all duration-200",
                    "hover:bg-muted/50 hover:scale-[1.02]",
                    isActive && "bg-primary text-primary-foreground shadow-lg",
                    !isActive && "text-foreground",
                    collapsed && "justify-center px-3"
                  )}
                >
                  <Icon className={cn("w-4 h-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex-1 text-left"
                    >
                      {route.title}
                    </motion.span>
                  )}
                  {!collapsed && route.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-xs px-2 py-0.5"
                    >
                      {route.badge}
                    </Badge>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/30">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-muted-foreground text-center"
            >
              <p>I3M Platform v2.0</p>
              <p className="mt-1">Enterprise Management</p>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
});