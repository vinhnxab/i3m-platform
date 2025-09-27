import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutContainer } from './LayoutContainer';

/**
 * LayoutWrapper component that provides layout context for all routes
 * This component must be used inside a Router context
 */
export const LayoutWrapper: React.FC = () => {
  return (
    <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  );
};

export default LayoutWrapper;
