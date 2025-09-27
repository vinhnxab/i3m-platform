import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge
} from '@/shared/components/ui';
import {
  WorkflowStats,
  WorkflowList,
  ExecutionHistory,
  DEFAULT_WORKFLOW_STATS,
} from '@/components/workflow';
import {
  Plus,
  Edit,
  Pause,
  Play,
  Zap,
  ArrowRight
} from 'lucide-react';
import { mockWorkflows, mockExecutions, mockWorkflowTemplates } from '../../mock-data/workflow';

export function WorkflowManagement() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [searchQuery, setSearchQuery] = useState('');

  const workflowStats = DEFAULT_WORKFLOW_STATS;

  const workflows = mockWorkflows;

  const executions = mockExecutions;

  const automationRules = [
    {
      id: 1,
      name: 'High-Value Customer Alert',
      condition: 'Customer lifetime value > $10,000',
      action: 'Assign to VIP support team',
      status: 'active' as const,
      triggered: 23
    },
    {
      id: 2,
      name: 'Urgent Ticket Escalation',
      condition: 'Ticket priority = Critical AND unassigned > 5 minutes',
      action: 'Send alert to supervisors',
      status: 'active' as const,
      triggered: 7
    },
    {
      id: 3,
      name: 'Inventory Alert',
      condition: 'Stock level < 10 AND product category = Electronics',
      action: 'Create purchase order',
      status: 'active' as const,
      triggered: 15
    },
    {
      id: 4,
      name: 'Abandoned Cart Recovery',
      condition: 'Cart value > $100 AND inactive > 1 hour',
      action: 'Send email reminder',
      status: 'paused' as const,
      triggered: 156
    }
  ];

  const templates = mockWorkflowTemplates;

  // Handler functions
  const handleEditWorkflow = (workflow: any) => {
    console.log('Edit workflow:', workflow);
  };

  const handleViewWorkflow = (workflow: any) => {
    console.log('View workflow:', workflow);
  };

  const handleToggleWorkflowStatus = (workflow: any) => {
    console.log('Toggle workflow status:', workflow);
  };

  const handleCreateNewWorkflow = () => {
    console.log('Create new workflow');
  };

  const handleOpenFilters = () => {
    console.log('Open filters');
  };

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">Workflow Management</h1>
          <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">Automate business processes and workflows</p>
        </div>
      </div>

      {/* Workflow Stats */}
      <WorkflowStats stats={workflowStats} />

      {/* Workflow Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <WorkflowList
            workflows={workflows}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEdit={handleEditWorkflow}
            onView={handleViewWorkflow}
            onToggleStatus={handleToggleWorkflowStatus}
            onCreateNew={handleCreateNewWorkflow}
            onOpenFilters={handleOpenFilters}
          />
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions" className="space-y-6">
          <ExecutionHistory executions={executions} />
        </TabsContent>

        {/* Automation Rules Tab */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Define conditions and actions for automated processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                          <span>IF</span>
                          <Badge variant="outline">{rule.condition}</Badge>
                          <ArrowRight className="w-3 h-3" />
                          <span>THEN</span>
                          <Badge variant="outline">{rule.action}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Triggered {rule.triggered} times this week
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>Pre-built workflow templates for common business processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.steps} steps</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={template.category}>{template.category}</Badge>
                        <Button size="sm">
                          <Plus className="w-3 h-3 mr-1" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}