import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Business,
  People,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
  Notifications,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Schedule,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

interface TenantDashboardProps {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
    tenantId: string;
    tenant: {
      id: string;
      name: string;
      subdomain: string;
    };
  };
}

const TenantDashboard: React.FC<TenantDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    revenue: 0,
    orders: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      action: 'New Order Received',
      timestamp: '1 hour ago',
      type: 'order',
      status: 'success'
    },
    {
      id: 2,
      action: 'User Registration',
      timestamp: '3 hours ago',
      type: 'user',
      status: 'info'
    },
    {
      id: 3,
      action: 'System Alert',
      timestamp: '5 hours ago',
      type: 'alert',
      status: 'warning'
    }
  ]);

  const [departmentServices] = useState({
    ERP: ['HR Management', 'Accounting', 'Inventory', 'Reports'],
    CMS: ['Content Management', 'Blog', 'Pages', 'Media'],
    ECOMMERCE: ['Products', 'Orders', 'Customers', 'Analytics'],
    HR: ['Employees', 'Payroll', 'Leave Management', 'Performance'],
    FINANCE: ['Accounting', 'Billing', 'Financial Reports', 'Tax Management']
  });

  useEffect(() => {
    fetchTenantStats();
  }, []);

  const fetchTenantStats = async () => {
    try {
      // Mock data based on department
      const departmentStats = {
        ERP: { totalUsers: 25, activeProjects: 5, revenue: 125000, orders: 45 },
        CMS: { totalUsers: 15, activeProjects: 3, revenue: 75000, orders: 30 },
        ECOMMERCE: { totalUsers: 40, activeProjects: 8, revenue: 200000, orders: 120 },
        HR: { totalUsers: 20, activeProjects: 4, revenue: 100000, orders: 25 },
        FINANCE: { totalUsers: 18, activeProjects: 6, revenue: 150000, orders: 35 }
      };

      setStats(departmentStats[user.department] || departmentStats.ERP);
    } catch (error) {
      console.error('Error fetching tenant stats:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Notifications color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {user.tenant.name} Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user.firstName}! Manage your {user.department} operations.
        </Typography>
        <Chip
          label={`${user.role} - ${user.department}`}
          color="primary"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.totalUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#388e3c', mr: 2 }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.activeProjects}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Projects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f57c00', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">${stats.revenue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#7b1fa2', mr: 2 }}>
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.orders}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department Services */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {user.department} Services
          </Typography>
          <Grid container spacing={2}>
            {departmentServices[user.department]?.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Typography variant="subtitle1">{service}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage {service.toLowerCase()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(activity.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.timestamp}
                      />
                      <Chip
                        label={activity.status}
                        color={getStatusColor(activity.status) as any}
                        size="small"
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">System Performance</Typography>
                  <Typography variant="body2">95%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={95} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">User Satisfaction</Typography>
                  <Typography variant="body2">88%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={88} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Task Completion</Typography>
                  <Typography variant="body2">92%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<People />}
                    sx={{ mb: 1 }}
                  >
                    Manage Users
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Settings />}
                    sx={{ mb: 1 }}
                  >
                    Settings
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Assessment />}
                    sx={{ mb: 1 }}
                  >
                    Reports
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Notifications />}
                    sx={{ mb: 1 }}
                  >
                    Notifications
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="System Update Available"
                    secondary="New features and improvements"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Maintenance Scheduled"
                    secondary="Sunday 2:00 AM - 4:00 AM"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TenantDashboard;
