import { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { NotificationBadge } from '@/shared/components/common/NotificationBadge';
import { ChatAIPopover } from '@/shared/components/chat/ChatAIPopover';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  User,
  MoreHorizontal,
  Check,
  X,
  Settings,
  Archive,
  Reply,
  Star,
  AlertCircle,
  Users,
  Calendar,
  FileText,
  DollarSign,
  LogOut
} from 'lucide-react';

// Mock data
const emailNotifications = [
  {
    id: 1,
    subject: 'Invoice Payment Received',
    from: 'TechCorp Inc.',
    time: '2 min ago',
    preview: 'Thank you for your payment of $4,999. Your invoice #INV-001 has been marked as paid.',
    unread: true,
    priority: 'normal',
    type: 'payment'
  },
  {
    id: 2,
    subject: 'New Customer Registration',
    from: 'I3M Platform',
    time: '15 min ago',
    preview: 'StartupCo has completed their registration and subscription setup.',
    unread: true,
    priority: 'high',
    type: 'customer'
  },
  {
    id: 3,
    subject: 'Weekly Analytics Report',
    from: 'Analytics Team',
    time: '1 hour ago',
    preview: 'Your weekly performance report is ready. Revenue is up 23% this week.',
    unread: false,
    priority: 'normal',
    type: 'report'
  },
  {
    id: 4,
    subject: 'System Maintenance Notice',
    from: 'IT Operations',
    time: '3 hours ago',
    preview: 'Scheduled maintenance window this weekend. Expected downtime: 2 hours.',
    unread: false,
    priority: 'low',
    type: 'system'
  },
  {
    id: 5,
    subject: 'Template Marketplace Update',
    from: 'Product Team',
    time: '1 day ago',
    preview: '5 new premium templates have been added to the marketplace.',
    unread: false,
    priority: 'normal',
    type: 'product'
  }
];

const messageNotifications = [
  {
    id: 1,
    name: 'Sarah Johnson',
    message: 'Hey! Can you review the ERP module updates?',
    time: '2 min ago',
    avatar: 'SJ',
    online: true,
    unread: true,
    type: 'direct'
  },
  {
    id: 2,
    name: 'Design Team',
    message: 'Mike: The new design system is ready for testing',
    time: '8 min ago',
    avatar: 'DT',
    online: false,
    unread: true,
    type: 'group',
    members: 8
  },
  {
    id: 3,
    name: 'Customer Support',
    message: 'Emily: We have 3 high-priority tickets pending',
    time: '20 min ago',
    avatar: 'CS',
    online: true,
    unread: true,
    type: 'group',
    members: 12
  },
  {
    id: 4,
    name: 'Alex Chen',
    message: 'Database migration completed successfully ✅',
    time: '1 hour ago',
    avatar: 'AC',
    online: false,
    unread: false,
    type: 'direct'
  },
  {
    id: 5,
    name: 'Product Team',
    message: 'Lisa: Q1 roadmap review meeting tomorrow at 2 PM',
    time: '2 hours ago',
    avatar: 'PT',
    online: true,
    unread: false,
    type: 'group',
    members: 6
  }
];

const systemNotifications = [
  {
    id: 1,
    title: 'High CPU Usage Alert',
    description: 'Server EU-WEST-1 is experiencing 89% CPU usage',
    time: '5 min ago',
    type: 'warning',
    action: 'View Details',
    icon: AlertCircle,
    unread: true
  },
  {
    id: 2,
    title: 'New User Registration',
    description: 'Enterprise Solutions Ltd has joined your platform',
    time: '12 min ago',
    type: 'success',
    action: 'Welcome User',
    icon: Users,
    unread: true
  },
  {
    id: 3,
    title: 'Backup Completed',
    description: 'Daily database backup finished successfully',
    time: '30 min ago',
    type: 'info',
    action: 'View Logs',
    icon: Archive,
    unread: false
  },
  {
    id: 4,
    title: 'Payment Processed',
    description: '$12,500 payment received from StartupCo',
    time: '1 hour ago',
    type: 'success',
    action: 'View Invoice',
    icon: DollarSign,
    unread: false
  }
];

interface EmailPopoverProps {
  isMobile?: boolean;
}

export function EmailPopover({ isMobile = false }: EmailPopoverProps) {
  const [emails] = useState(emailNotifications);
  const unreadCount = emails.filter(email => email.unread).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return DollarSign;
      case 'customer': return Users;
      case 'report': return FileText;
      case 'system': return Settings;
      case 'product': return Star;
      default: return Mail;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'normal': return 'text-blue-500';
      case 'low': return 'text-gray-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative rounded-xl p-2 bg-muted/50 hover:bg-muted ${
            isMobile ? 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]' : 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]'
          } aspect-square flex items-center justify-center`}
        >
          <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} flex items-center justify-center`}>
            <Mail className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} flex-shrink-0`} />
          </div>
          <NotificationBadge count={unreadCount} isMobile={isMobile} color="primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 border-0 shadow-xl bg-card/95 backdrop-blur-xl rounded-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Email Notifications</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-96">
          <div className="p-2">
            {emails.map((email, index) => {
              const TypeIcon = getTypeIcon(email.type);
              return (
                <div key={email.id}>
                  <div className={`p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer ${
                    email.unread ? 'bg-primary/5' : ''
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        email.unread ? 'bg-primary/10' : 'bg-muted/50'
                      }`}>
                        <TypeIcon className={`w-4 h-4 ${getPriorityColor(email.priority)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm truncate ${email.unread ? 'font-semibold' : 'font-medium'}`}>
                            {email.subject}
                          </p>
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            {email.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                            <span className="text-xs text-muted-foreground">{email.time}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{email.from}</p>
                        <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis" style={{ 
                          display: '-webkit-box', 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: 'vertical' 
                        }}>
                          {email.preview}
                        </p>
                        
                        {email.unread && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                              <Reply className="w-3 h-3 mr-1" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <Archive className="w-3 h-3 mr-1" />
                              Archive
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < emails.length - 1 && <Separator className="my-1" />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border/50">
          <Button variant="outline" className="w-full h-8">
            View All Emails
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface MessagePopoverProps {
  isMobile?: boolean;
}

export function MessagePopover({ isMobile = false }: MessagePopoverProps) {
  const [messages] = useState(messageNotifications);
  const unreadCount = messages.filter(msg => msg.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative rounded-xl p-2 bg-muted/50 hover:bg-muted ${
            isMobile ? 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]' : 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]'
          } aspect-square flex items-center justify-center`}
        >
          <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} flex items-center justify-center`}>
            <MessageSquare className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} flex-shrink-0`} />
          </div>
          <NotificationBadge count={unreadCount} isMobile={isMobile} color="green" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 border-0 shadow-xl bg-card/95 backdrop-blur-xl rounded-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Messages</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-2">
            {messages.map((message, index) => (
              <div key={message.id}>
                <div className={`p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer ${
                  message.unread ? 'bg-primary/5' : ''
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        message.unread ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {message.avatar}
                      </div>
                      {message.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm truncate ${message.unread ? 'font-semibold' : 'font-medium'}`}>
                            {message.name}
                          </p>
                          {message.type === 'group' && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {message.members}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                          {message.unread && (
                            <div className="w-2 h-2 bg-chart-2 rounded-full" />
                          )}
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis" style={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical' 
                      }}>
                        {message.message}
                      </p>
                      
                      {message.unread && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Check className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < messages.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border/50">
          <Button variant="outline" className="w-full h-8">
            Open Chat App
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface NotificationPopoverProps {
  isMobile?: boolean;
}

export function NotificationPopover({ isMobile = false }: NotificationPopoverProps) {
  const [notifications] = useState(systemNotifications);
  const unreadCount = notifications.filter(notif => notif.unread).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'success': return 'text-green-500 bg-green-50 dark:bg-green-950/20';
      case 'info': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'error': return 'text-red-500 bg-red-50 dark:bg-red-950/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative rounded-xl p-2 bg-muted/50 hover:bg-muted ${
            isMobile ? 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]' : 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]'
          } aspect-square flex items-center justify-center`}
        >
          <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} flex items-center justify-center`}>
            <Bell className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} flex-shrink-0`} />
          </div>
          <NotificationBadge count={unreadCount} isMobile={isMobile} color="red" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 border-0 shadow-xl bg-card/95 backdrop-blur-xl rounded-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-2">
            {notifications.map((notification, index) => {
              const IconComponent = notification.icon;
              return (
                <div key={notification.id}>
                  <div className={`p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer ${
                    notification.unread ? 'bg-primary/5' : ''
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        getTypeColor(notification.type)
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm truncate ${notification.unread ? 'font-semibold' : 'font-medium'}`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            {notification.unread && (
                              <div className="w-2 h-2 bg-chart-4 rounded-full" />
                            )}
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{notification.description}</p>
                        
                        {notification.unread && (
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                              {notification.action}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-1" />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-border/50">
          <Button variant="outline" className="w-full h-8">
            View All Notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface UserMenuPopoverProps {
  isMobile?: boolean;
}

export function UserMenuPopover({ isMobile = false }: UserMenuPopoverProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux store
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  const userMenuItems = [
    { icon: User, label: 'Profile Settings', shortcut: '⌘P' },
    { icon: Settings, label: 'Account Settings', shortcut: '⌘,' },
    { icon: Calendar, label: 'Calendar', shortcut: '⌘K' },
    { icon: FileText, label: 'Documentation', shortcut: '⌘D' },
    { icon: Users, label: 'Team Management', shortcut: '' },
    { icon: Star, label: 'Favorites', shortcut: '' },
  ];

  const handleLogout = async () => {
    try {
      // Dispatch logout action to Redux store
      await dispatch(logoutUser()).unwrap();
      
      // Redirect to login page
      navigate('/login');
      // Reload the page to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      navigate('/login');
      window.location.reload();
    }
  };

  // Get current user info from Redux store
  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';
  const userEmail = user?.email || 'admin@i3m.com';
  const userName = user?.name || 'Admin User';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-xl p-2 bg-muted/50 hover:bg-muted ${
            isMobile ? 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]' : 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem]'
          } aspect-square flex items-center justify-center`}
        >
          <div className={`${
            isMobile ? 'w-5 h-5' : 'w-6 h-6'
          } rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold`}>
            {userInitials}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-0 border-0 shadow-xl bg-card/95 backdrop-blur-xl rounded-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {userInitials}
            </div>
            <div>
              <p className="font-semibold">{userName}</p>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          {userMenuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-10 px-3 rounded-xl hover:bg-muted/50"
              >
                <IconComponent className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-muted-foreground">{item.shortcut}</span>
                )}
              </Button>
            );
          })}
        </div>
        
        <Separator className="my-1" />
        
        <div className="p-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-10 px-3 rounded-xl hover:bg-destructive/10 text-destructive"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4 mr-3" />
            {isLoading ? 'Logging Out...' : 'Logout'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}