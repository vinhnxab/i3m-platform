import React from "react";
import { Button, Input } from "@/shared/components/ui";
import { Search, Filter, Plus } from "lucide-react";
import WorkflowCard from "./WorkflowCard";
import { Workflow } from "./types";

interface WorkflowListProps {
  workflows: Workflow[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEdit: (workflow: Workflow) => void;
  onView: (workflow: Workflow) => void;
  onToggleStatus: (workflow: Workflow) => void;
  onCreateNew: () => void;
  onOpenFilters: () => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  searchQuery,
  onSearchChange,
  onEdit,
  onView,
  onToggleStatus,
  onCreateNew,
  onOpenFilters,
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={onOpenFilters}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
        <Button
          onClick={onCreateNew}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </Button>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onEdit={onEdit}
            onView={onView}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
            <p className="text-sm">
              {searchQuery 
                ? "Try adjusting your search criteria" 
                : "Create your first workflow to get started"
              }
            </p>
          </div>
          {!searchQuery && (
            <Button onClick={onCreateNew} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
