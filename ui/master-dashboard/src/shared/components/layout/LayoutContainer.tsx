import React from 'react';
import { useLocation } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { DashboardLayout } from './DashboardLayout';
import { PublicLayout } from './PublicLayout';
import { LAYOUT_TYPES, ROUTE_PATTERNS } from './constants';

export type LayoutType = keyof typeof LAYOUT_TYPES;

interface LayoutContainerProps {
  children: React.ReactNode;
  layout?: LayoutType;
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({ 
  children, 
  layout 
}) => {
  const location = useLocation();
  
  // Auto-detect layout based on route if not explicitly provided
  const detectedLayout = layout || getLayoutFromRoute(location.pathname);
  
  const renderLayout = () => {
    switch (detectedLayout) {
      case LAYOUT_TYPES.AUTH:
        return <AuthLayout>{children}</AuthLayout>;
      case LAYOUT_TYPES.DASHBOARD:
        return <DashboardLayout>{children}</DashboardLayout>;
      case LAYOUT_TYPES.PUBLIC:
        return <PublicLayout>{children}</PublicLayout>;
      case LAYOUT_TYPES.NONE:
      default:
        return <>{children}</>;
    }
  };
  
  return renderLayout();
};

// Helper function to determine layout based on route
const getLayoutFromRoute = (pathname: string): LayoutType => {
  // Auth routes
  if (ROUTE_PATTERNS.AUTH.some(pattern => pathname.startsWith(pattern))) {
    return LAYOUT_TYPES.AUTH;
  }
  
  // Dashboard routes
  if (ROUTE_PATTERNS.DASHBOARD.some(pattern => pathname.startsWith(pattern))) {
    return LAYOUT_TYPES.DASHBOARD;
  }
  
  // Public routes (home, about, contact, etc.)
  if (ROUTE_PATTERNS.PUBLIC.some(pattern => pathname.startsWith(pattern))) {
    return LAYOUT_TYPES.PUBLIC;
  }
  
  // Default to no layout for flexibility
  return LAYOUT_TYPES.NONE;
};

export default LayoutContainer;
