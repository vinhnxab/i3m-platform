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
  LinearProgress
} from '@mui/material';
import {
  Code,
  Api,
  Book,
  Dashboard,
  TrendingUp,
  People,
  Settings,
  Notifications,
  Search,
  Download,
  Upload,
  Star,
  Visibility
} from '@mui/icons-material';

interface DeveloperDashboardProps {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
  };
}

const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalAPIs: 0,
    activeProjects: 0,
    downloads: 0,
    ratings: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      action: 'API Key Generated',
      timestamp: '2 hours ago',
      type: 'api'
    },
    {
      id: 2,
      action: 'Documentation Updated',
      timestamp: '4 hours ago',
      type: 'docs'
    },
    {
      id: 3,
      action: 'New Project Created',
      timestamp: '1 day ago',
      type: 'project'
    }
  ]);

  const [quickActions] = useState([
    {
      title: 'API Documentation',
      description: 'Access comprehensive API documentation',
      icon: <Book />,
      color: '#1976d2',
      action: '/api-docs'
    },
    {
      title: 'Developer Tools',
      description: 'Useful tools for development',
      icon: <Code />,
      color: '#388e3c',
      action: '/dev-tools'
    },
    {
      title: 'Marketplace',
      description: 'Browse and download templates',
      icon: <Dashboard />,
      color: '#f57c00',
      action: '/marketplace'
    },
    {
      title: 'API Keys',
      description: 'Manage your API keys',
      icon: <Api />,
      color: '#7b1fa2',
      action: '/api-keys'
    }
  ]);

  useEffect(() => {
    // Fetch developer stats
    fetchDeveloperStats();
  }, []);

  const fetchDeveloperStats = async () => {
    try {
      // Mock data for now
      setStats({
        totalAPIs: 12,
        activeProjects: 3,
        downloads: 156,
        ratings: 4.8
      });
    } catch (error) {
      console.error('Error fetching developer stats:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Developer Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user.firstName}! Manage your development tools and resources.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <Api />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.totalAPIs}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total APIs
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
                  <Code />
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
                  <Download />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.downloads}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Downloads
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
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.ratings}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            color: action.color,
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Typography variant="subtitle1">
                          {action.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
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
                        {activity.type === 'api' && <Api />}
                        {activity.type === 'docs' && <Book />}
                        {activity.type === 'project' && <Code />}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.timestamp}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* API Usage */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Usage
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Requests Today</Typography>
                  <Typography variant="body2">1,234</Typography>
                </Box>
                <LinearProgress variant="determinate" value={75} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Rate Limit</Typography>
                  <Typography variant="body2">75%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={75} />
              </Box>
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
                    primary="API Documentation Updated"
                    secondary="New endpoints added to the API"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText
                    primary="System Maintenance"
                    secondary="Scheduled maintenance on Sunday"
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

export default DeveloperDashboard;
