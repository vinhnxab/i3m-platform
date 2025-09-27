import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui";
import {
  ScrumHeader,
  SprintInfo,
  KanbanBoard,
  BacklogTab,
  ReportsTab,
  TeamTab,
  TaskDialog,
  BulkActions,
  KeyboardShortcuts,
  Task,
  Sprint,
  TeamMember,
  SearchOptions,
} from "@/components/scrum";
import { mockTasks, mockSprint, mockTeamMembers } from "../../mock-data/scrum";

// All components are now imported from components/scrum

export const ScrumManagement: React.FC = () => {
  const [currentSprint] = useState<Sprint>(mockSprint);

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: "",
    filters: {},
  });

  // This will be moved after tasks declaration

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [currentTab, setCurrentTab] = useState("board");

  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);

  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  // Filter tasks based on search options
  const filteredTasks = React.useMemo(() => {
    if (!searchOptions.query && Object.keys(searchOptions.filters).length === 0) {
      return tasks;
    }

    return tasks.filter(task => {
      const matchesSearch = !searchOptions.query || 
        task.title.toLowerCase().includes(searchOptions.query.toLowerCase()) ||
        task.description.toLowerCase().includes(searchOptions.query.toLowerCase());
      
      const matchesFilters = Object.entries(searchOptions.filters).every(([key, value]) => {
        if (!value) return true;
        return (task as any)[key] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [tasks, searchOptions]);

  // Handler functions
  const handleDrop = useCallback((taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus as any } : task
      )
    );
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  }, []);

  const handleSaveTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const handleQuickEdit = useCallback((task: Task, field: string, value: any) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, [field]: value } : t))
    );
  }, []);

  const handleAddTask = useCallback(() => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  }, []);

  const handleSearch = useCallback((options: SearchOptions) => {
    setSearchOptions(options);
  }, []);

  const handleOpenFilters = useCallback(() => {
    // TODO: Implement filter modal
    console.log("Open filters");
  }, []);

  const handleOpenSettings = useCallback(() => {
    // TODO: Implement settings modal
    console.log("Open settings");
  }, []);

  const handleNotifications = useCallback(() => {
    // TODO: Implement notifications
    console.log("Open notifications");
  }, []);

  const handleProfile = useCallback(() => {
    // TODO: Implement profile
    console.log("Open profile");
  }, []);

  // Bulk actions handlers
  const handleBulkDelete = useCallback((taskIds: string[]) => {
    setTasks(prev => prev.filter(task => !taskIds.includes(task.id)));
    setSelectedTasks([]);
  }, []);

  const handleBulkEdit = useCallback((taskIds: string[]) => {
    // TODO: Implement bulk edit modal
    console.log("Bulk edit tasks:", taskIds);
  }, []);

  const handleBulkMove = useCallback((taskIds: string[], newStatus: string) => {
    setTasks(prev => 
      prev.map(task => 
        taskIds.includes(task.id) ? { ...task, status: newStatus as any } : task
      )
    );
    setSelectedTasks([]);
  }, []);

  const handleBulkArchive = useCallback((taskIds: string[]) => {
    // TODO: Implement archive functionality
    console.log("Archive tasks:", taskIds);
    setSelectedTasks([]);
  }, []);

  const handleBulkCopy = useCallback((taskIds: string[]) => {
    const tasksToCopy = tasks.filter(task => taskIds.includes(task.id));
    const copiedTasks = tasksToCopy.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: `${task.title} (Copy)`,
      status: "backlog" as const,
    }));
    setTasks(prev => [...prev, ...copiedTasks]);
    setSelectedTasks([]);
  }, [tasks]);

  const handleClearSelection = useCallback(() => {
    setSelectedTasks([]);
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedTasks(filteredTasks);
  }, [filteredTasks]);

  // Keyboard shortcuts handlers
  const handleFocusSearch = useCallback(() => {
    const searchInput = document.getElementById("scrum-search");
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    // TODO: Implement fullscreen toggle
    console.log("Toggle fullscreen");
  }, []);

  const handleNextTab = useCallback(() => {
    const tabs = ["board", "backlog", "reports", "team"];
    const currentIndex = tabs.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setCurrentTab(tabs[nextIndex]);
  }, [currentTab]);

  const handlePrevTab = useCallback(() => {
    const tabs = ["board", "backlog", "reports", "team"];
    const currentIndex = tabs.indexOf(currentTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setCurrentTab(tabs[prevIndex]);
  }, [currentTab]);

  // Calculate statistics
  const completedTasks = tasks.filter(task => 
    task.status === "done" || task.status === "deployed"
  ).length;

  return (
    <div className="w-full px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6">
        {/* Header */}
      <ScrumHeader
        onSearch={handleSearch}
        onAddTask={handleAddTask}
        onOpenFilters={handleOpenFilters}
        onOpenSettings={handleOpenSettings}
        onNotifications={handleNotifications}
        onProfile={handleProfile}
        isSystemOperational={true}
        totalTasks={tasks.length}
        completedTasks={completedTasks}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
          <div className="flex-shrink-0 px-4 sm:px-6 pb-0">
            <TabsList className="grid w-full grid-cols-4 bg-muted/30 rounded-xl p-1 h-10 sm:h-12">
              <TabsTrigger
                value="board"
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium px-2 sm:px-4 text-xs sm:text-sm"
              >
                Board
              </TabsTrigger>
              <TabsTrigger
                value="backlog"
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium px-2 sm:px-4 text-xs sm:text-sm"
              >
                Backlog
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium px-2 sm:px-4 text-xs sm:text-sm"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium px-2 sm:px-4 text-xs sm:text-sm"
              >
                Team
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Board Tab */}
          <TabsContent value="board" className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-2 sm:pt-3">
              <SprintInfo 
                sprint={currentSprint} 
                teamMembers={teamMembers.length}
                showDetails={true}
              />
              <KanbanBoard
                tasks={filteredTasks}
                onDrop={handleDrop}
                onEdit={handleEditTask}
                onQuickEdit={handleQuickEdit}
                onAddTask={handleAddTask}
              />
            </div>
          </TabsContent>

          {/* Backlog Tab */}
          <TabsContent
            value="backlog"
            className="flex-1 overflow-y-auto hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <BacklogTab
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onQuickEdit={handleQuickEdit}
              onAddTask={handleAddTask}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent
            value="reports"
            className="flex-1 overflow-y-auto hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <ReportsTab
              tasks={filteredTasks}
              sprint={currentSprint}
              teamMembers={teamMembers}
            />
          </TabsContent>

          {/* Team Tab */}
          <TabsContent
            value="team"
            className="flex-1 overflow-y-auto hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TeamTab
              tasks={filteredTasks}
              teamMembers={teamMembers}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        task={selectedTask}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        teamMembers={teamMembers}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedTasks={selectedTasks}
        onBulkDelete={handleBulkDelete}
        onBulkEdit={handleBulkEdit}
        onBulkMove={handleBulkMove}
        onBulkArchive={handleBulkArchive}
        onBulkCopy={handleBulkCopy}
        onClearSelection={handleClearSelection}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onNewTask={handleAddTask}
        onSearch={handleFocusSearch}
        onFilter={handleOpenFilters}
        onSave={() => {/* Handled by TaskDialog */}}
        onCancel={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onBulkEdit={() => handleBulkEdit(selectedTasks.map(t => t.id))}
        onBulkDelete={() => handleBulkDelete(selectedTasks.map(t => t.id))}
        onBulkMove={(status: string) => handleBulkMove(selectedTasks.map(t => t.id), status)}
        onToggleFullscreen={handleToggleFullscreen}
        onNextTab={handleNextTab}
        onPrevTab={handlePrevTab}
        isDialogOpen={isDialogOpen}
        hasSelection={selectedTasks.length > 0}
      />
    </div>
  );}
