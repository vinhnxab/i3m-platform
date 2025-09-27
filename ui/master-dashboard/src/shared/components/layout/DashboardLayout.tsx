import React, { useState, useCallback, memo } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ContentSidebar } from './ContentSidebar';
import { useMobile } from '../../hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = memo(({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMobile();
  const [contentSidebarOpen, setContentSidebarOpen] = useState(true);
  const handleContentSidebarToggle = useCallback(() => {
    setContentSidebarOpen(prev => !prev);
  }, []);
  

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-background/95">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/30 p-4 lg:hidden">
          <Header isMobile={true} onMobileToggle={handleMobileToggle} />
        </div>
      )}

      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileToggle={handleMobileToggle}
      />
      
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        {/* Desktop Header */}
        {!isMobile && (
          <div className="w-full bg-background/95 backdrop-blur-xl border-b border-border/30 px-4 lg:px-3 py-4 flex-shrink-0">
            <Header onContentSidebarToggle={handleContentSidebarToggle} />
          </div>
        )}
        
        {/* Main Content Area with Sidebar */}
        <div className="flex w-full overflow-hidden flex-1">
          {/* Content Area */}
          <div className={`flex-1 overflow-y-auto hide-scrollbar bg-gradient-to-br from-background/50 via-background to-muted/20 ${
            isMobile ? 'pt-20' : ''
          }`}>
            <div className="w-full px-4 lg:px-6 py-4 lg:py-6 relative">
              {children}
            </div>
          </div>
          
          {/* Content Sidebar - Inside main content */}
          <ContentSidebar
            isOpen={contentSidebarOpen}
            onToggle={handleContentSidebarToggle}
            isMobile={isMobile}
          />
        </div>
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/5 pointer-events-none" />
      </main>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
