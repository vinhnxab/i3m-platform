import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Progress } from '@/shared/components/ui';
import { motion } from 'motion/react';
import { FolderOpen, Edit, Trash2, Plus, Calendar, DollarSign } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  budget: string;
  startDate: string;
  endDate: string;
  team: string[];
}

interface ProjectsListProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onAdd?: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onEdit,
  onDelete,
  onAdd
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-chart-2';
      case 'completed': return 'bg-chart-1';
      case 'planning': return 'bg-chart-3';
      case 'on-hold': return 'bg-chart-4';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Track and manage your projects</CardDescription>
          </div>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">{project.status}</Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(project)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete?.(project)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {project.budget}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.startDate} - {project.endDate}
                      </span>
                    </div>
                    <span>{project.team.length} team members</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
