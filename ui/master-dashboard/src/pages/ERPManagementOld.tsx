import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { mockEmployees, mockProjects, mockFinancialData, mockInventoryStats, mockHRStats } from '../../mock-data/erp';

import { 
  Users, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  FolderOpen, 
  UserPlus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/shared/components/ui';

// Stagger Animation Container
function StaggerContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Animation Item
function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 0.8
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function ERPManagement() {
  const [activeTab, setActiveTab] = useState('hr');

  const hrStats = mockHRStats;

  const employees = mockEmployees;

  const projects = mockProjects;

  const financialData = mockFinancialData;

  const inventoryStats = mockInventoryStats;

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-semibold">ERP Management System</h1>
          <p className="text-muted-foreground">Enterprise Resource Planning Dashboard</p>
        </div>
        <Button className="rounded-xl shadow-lg hover:scale-105 transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Add New Record
        </Button>
      </motion.div>

      {/* ERP Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hr">Human Resources</TabsTrigger>
          <TabsTrigger value="finance">Financial</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Human Resources Tab */}
        <TabsContent value="hr">
          <StaggerContainer className="space-y-6">
            {/* HR Stats */}
            <StaggerItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {hrStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                          <div className="stat-icon-container">
                            <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-semibold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+{stat.change}</span> this month
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </StaggerItem>

            {/* Employee Management */}
            <StaggerItem>
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Employee Management</CardTitle>
                      <CardDescription>Manage employee information and status</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.map((employee, index) => (
                      <motion.div
                        key={employee.id}
                        className="flex items-center justify-between p-4 border-0 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{employee.name}</h4>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">{employee.department}</span>
                          <Badge 
                            variant={employee.status === 'active' ? 'default' : 'secondary'}
                            className="rounded-full"
                          >
                            {employee.status}
                          </Badge>
                          <span className="text-sm font-medium">{employee.salary}</span>
                          <Button variant="outline" size="sm" className="rounded-xl">Edit</Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="finance">
          <StaggerContainer className="space-y-6">
            <StaggerItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {financialData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                          <div className="stat-icon-container">
                            <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-semibold">{item.value}</div>
                          <p className="text-xs text-muted-foreground">
                            <span className={item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                              {item.change}
                            </span> from last quarter
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest financial transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: 'income', desc: 'Customer Payment - TechCorp', amount: '+$25,000', time: '2h ago' },
                        { type: 'expense', desc: 'Office Supplies Purchase', amount: '-$1,250', time: '4h ago' },
                        { type: 'income', desc: 'Template Sale Commission', amount: '+$3,500', time: '6h ago' },
                        { type: 'expense', desc: 'Cloud Infrastructure', amount: '-$8,900', time: '1d ago' },
                      ].map((transaction, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium">{transaction.desc}</p>
                              <p className="text-xs text-muted-foreground">{transaction.time}</p>
                            </div>
                          </div>
                          <span className={`font-medium ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Invoice Status</CardTitle>
                    <CardDescription>Outstanding and recent invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: 'INV-001', customer: 'Global Corp', amount: '$45,000', status: 'paid', due: '2024-01-15' },
                        { id: 'INV-002', customer: 'StartupCo', amount: '$12,500', status: 'pending', due: '2024-01-20' },
                        { id: 'INV-003', customer: 'TechStart', amount: '$8,750', status: 'overdue', due: '2024-01-10' },
                        { id: 'INV-004', customer: 'Enterprise Ltd', amount: '$67,000', status: 'draft', due: '2024-01-25' },
                      ].map((invoice, index) => (
                        <motion.div
                          key={invoice.id}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div>
                            <p className="text-sm font-medium">{invoice.id}</p>
                            <p className="text-xs text-muted-foreground">{invoice.customer}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{invoice.amount}</p>
                            <Badge 
                              variant={
                                invoice.status === 'paid' ? 'default' :
                                invoice.status === 'pending' ? 'secondary' :
                                invoice.status === 'overdue' ? 'destructive' : 'outline'
                              }
                              className="rounded-full"
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <StaggerContainer className="space-y-6">
            <StaggerItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {inventoryStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                          <div className="stat-icon-container">
                            <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-semibold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">+{stat.change}</span> this week
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Low Stock Alerts</CardTitle>
                    <CardDescription>Products requiring immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { product: 'Enterprise License Keys', current: 12, minimum: 50, status: 'critical' },
                        { product: 'Premium Templates', current: 8, minimum: 25, status: 'warning' },
                        { product: 'SSL Certificates', current: 3, minimum: 15, status: 'critical' },
                        { product: 'Cloud Storage Credits', current: 45, minimum: 100, status: 'warning' },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-3 border-0 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div>
                            <p className="text-sm font-medium">{item.product}</p>
                            <p className="text-xs text-muted-foreground">Current: {item.current} | Min: {item.minimum}</p>
                          </div>
                          <Badge 
                            variant={item.status === 'critical' ? 'destructive' : 'secondary'}
                            className="rounded-full"
                          >
                            {item.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Warehouse Overview</CardTitle>
                    <CardDescription>Multi-location inventory status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { location: 'North America DC', utilization: 78, capacity: '85%' },
                        { location: 'Europe DC', utilization: 65, capacity: '72%' },
                        { location: 'Asia Pacific DC', utilization: 82, capacity: '91%' },
                        { location: 'South America DC', utilization: 45, capacity: '51%' },
                      ].map((warehouse, index) => (
                        <motion.div
                          key={index}
                          className="space-y-2 p-3 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{warehouse.location}</span>
                            <span className="text-sm text-muted-foreground">{warehouse.capacity}</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <motion.div 
                              className="bg-primary h-2 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${warehouse.utilization}%` }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <StaggerContainer className="space-y-6">
            <StaggerItem>
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Current project status and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="border-0 bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">Deadline: {project.deadline}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm">{project.team} team members</span>
                            <Badge 
                              variant={
                                project.status === 'in-progress' ? 'default' :
                                project.status === 'review' ? 'secondary' :
                                project.status === 'planning' ? 'outline' : 'default'
                              }
                              className="rounded-full"
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <motion.div 
                              className="bg-primary h-2 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}