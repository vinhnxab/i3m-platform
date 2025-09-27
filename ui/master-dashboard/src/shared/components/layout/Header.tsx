import React, { memo } from 'react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { DesignSystemToggle } from '../ui/DesignSystemToggle';
import { LanguageSelector } from '../ui/LanguageSelector';
import { EmailPopover, MessagePopover, NotificationPopover, UserMenuPopover } from '../ui/HeaderPopovers';
import { ChatAIPopover } from '../chat/ChatAIPopover';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Menu,ChevronDown, User, Check, Shield, Building2, Code, Settings, Users, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  isMobile?: boolean;
  onMobileToggle?: () => void;
  onContentSidebarToggle?: () => void;
}

interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: {
      userRoles?: string[];
      role: string;
    } | null;
  };
}

export const Header: React.FC<HeaderProps> = memo(({ isMobile = false, onMobileToggle, onContentSidebarToggle }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  

  // Role mapping for display
  const roleDisplayNames: { [key: string]: string } = {
    'PLATFORM_ADMIN': 'Platform Administrator',
    'PLATFORM_USER': 'Platform User',
    'MARKETPLACE_DEVELOPER': 'Developer',
    'TENANT_ADMIN': 'Tenant Administrator',
    'TENANT_USER': 'Tenant User',
    'END_CUSTOMER': 'Customer',
  };

  // Role icons mapping
  const roleIcons: { [key: string]: any } = {
    'PLATFORM_ADMIN': Shield,
    'PLATFORM_USER': Building2,
    'MARKETPLACE_DEVELOPER': Code,
    'TENANT_ADMIN': Settings,
    'TENANT_USER': Users,
    'END_CUSTOMER': ShoppingCart,
  };

  // Handle role change
  const handleRoleChange = (selectedRole: string) => {
    console.log('🔍 Header - Role changed to:', selectedRole);
    
    // Navigate based on selected role using paths
    if (selectedRole === 'MARKETPLACE_DEVELOPER') {
      navigate('/developer/dashboard');
    } else if (selectedRole.startsWith('TENANT_')) {
      navigate('/tenant/dashboard');
    } else if (selectedRole.startsWith('PLATFORM_')) {
      navigate('/dashboard');
    } else if (selectedRole === 'END_CUSTOMER') {
      navigate('/customer/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileToggle}
            className="rounded-xl p-2 bg-muted/50 hover:bg-muted w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] aspect-square flex items-center justify-center"
          >
            <Menu className="w-5 h-5 flex-shrink-0" />
          </Button>
          <div className="flex items-center space-x-3">
          {/* Role Selector - Only show if user has multiple roles */}
          {isAuthenticated && user?.userRoles && (
            <>
              {user.userRoles.length > 1 ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl px-3 py-2 bg-muted/50 hover:bg-muted h-10 flex items-center space-x-2"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        {(() => {
                          const Icon = roleIcons[user.role] || User;
                          return <Icon className="w-4 h-4" />;
                        })()}
                      </div>
                      <span className="text-sm font-medium">{roleDisplayNames[user.role] || user.role}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-48 p-2 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl z-[10000]" 
                    align="end"
                    sideOffset={8}
                  >
                    <div className="space-y-1">
                      {user.userRoles.map((role) => {
                        const Icon = roleIcons[role] || User;
                        const isSelected = user.role === role;
                        
                        return (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl hover:bg-muted/50 transition-colors duration-200 group"
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                              <span className="text-foreground font-medium">{roleDisplayNames[role] || role}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-xl">
                  <div className="w-4 h-4 flex items-center justify-center">
                    {(() => {
                      const Icon = roleIcons[user.role] || User;
                      return <Icon className="w-4 h-4" />;
                    })()}
                  </div>
                  <span className="text-sm font-medium">{roleDisplayNames[user.role] || user.role}</span>
                </div>
              )}
            </>
          )}
          </div>
        </div>
        <div className="flex items-center space-x-2">

          
          {/* Mobile Design System Toggle */}
          <DesignSystemToggle />
          
          {/* Mobile Theme Toggle */}
          <ThemeToggle />
          
          {/* Mobile Language Selector */}
          <LanguageSelector />
          
          {/* Mobile Email Popover */}
          <EmailPopover isMobile={true} />
          
          {/* Mobile Message Popover */}
          <MessagePopover isMobile={true} />
          
          {/* Mobile Chat AI Popover */}
          <ChatAIPopover isMobile={true} />
          
          {/* Mobile Notification Popover */}
          <NotificationPopover isMobile={true} />
          
          {/* Mobile User Menu Popover */}
          <UserMenuPopover isMobile={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Role Selector - Only show if user has multiple roles */}
        {isAuthenticated && user?.userRoles && (
          <>
            {user.userRoles.length > 1 ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl px-3 py-2 bg-muted/50 hover:bg-muted h-10 flex items-center space-x-2"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      {(() => {
                        const Icon = roleIcons[user.role] || User;
                        return <Icon className="w-4 h-4" />;
                      })()}
                    </div>
                    <span className="text-sm font-medium">{roleDisplayNames[user.role] || user.role}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-48 p-2 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl z-[10000]" 
                  align="end"
                  sideOffset={8}
                >
                  <div className="space-y-1">
                    {user.userRoles.map((role) => {
                      const Icon = roleIcons[role] || User;
                      const isSelected = user.role === role;
                      
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(role)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl hover:bg-muted/50 transition-colors duration-200 group"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-foreground font-medium">{roleDisplayNames[role] || role}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-xl">
                <div className="w-4 h-4 flex items-center justify-center">
                  {(() => {
                    const Icon = roleIcons[user.role] || User;
                    return <Icon className="w-4 h-4" />;
                  })()}
                </div>
                <span className="text-sm font-medium">{roleDisplayNames[user.role] || user.role}</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center space-x-3">

       
        {/* Content Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onContentSidebarToggle}
          className="rounded-xl p-2 hover:bg-muted/50 w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] aspect-square flex items-center justify-center"
          title="Toggle Settings Panel"
        >
          <Settings className="w-5 h-5" />
        </Button>
        
        {/* Design System Toggle */}
        <DesignSystemToggle />
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Desktop Email Popover */}
        <EmailPopover />
        
        {/* Desktop Message Popover */}
        <MessagePopover />
        
        {/* Desktop Chat AI Popover */}
        <ChatAIPopover />
        
        {/* Desktop Notification Popover */}
        <NotificationPopover />
        
        {/* Desktop User Menu Popover */}
        <UserMenuPopover />
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
