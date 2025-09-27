import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, CheckCircle, Settings, Bell, User } from "lucide-react";
import { Button, Badge, Input } from "@/shared/components/ui";
import { SearchOptions, FilterOptions } from "./types";

interface ScrumHeaderProps {
  onSearch: (options: SearchOptions) => void;
  onAddTask: () => void;
  onOpenFilters: () => void;
  onOpenSettings?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  isSystemOperational?: boolean;
  totalTasks?: number;
  completedTasks?: number;
}

const ScrumHeader: React.FC<ScrumHeaderProps> = ({
  onSearch,
  onAddTask,
  onOpenFilters,
  onOpenSettings,
  onNotifications,
  onProfile,
  isSystemOperational = true,
  totalTasks = 0,
  completedTasks = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with "/"
      if (e.key === "/" && !isSearchFocused) {
        e.preventDefault();
        const searchInput = document.getElementById("scrum-search");
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Add new task with "n"
      if (e.key === "n" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onAddTask();
      }
      
      // Open filters with "f"
      if (e.key === "f" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onOpenFilters();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchFocused, onAddTask, onOpenFilters]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch({
      query: value,
      filters: {} as FilterOptions, // Will be handled by parent component
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      filters: {} as FilterOptions,
    });
  };

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
      {/* Title and Description */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
          Scrum Management
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground font-medium mt-1 lg:mt-2">
          Quản lý sprint, backlog và theo dõi tiến độ phát triển theo phương pháp Scrum
        </p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {/* System Status */}
        <Badge
          variant="outline"
          className={`text-chart-2 border-current backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-semibold text-sm ${
            isSystemOperational 
              ? "bg-chart-2/10" 
              : "bg-red-500/10 text-red-600 border-red-500/20"
          }`}
        >
          <CheckCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2" />
          {isSystemOperational ? "All Systems Operational" : "System Issues"}
        </Badge>

        {/* Progress Indicator */}
        {totalTasks > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-full">
            <div className="text-xs text-muted-foreground">
              {completedTasks}/{totalTasks}
            </div>
            <div className="w-16 bg-muted/30 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {completionRate}%
            </div>
          </div>
        )}

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="scrum-search"
            placeholder="Tìm kiếm tasks... (/)"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10 pr-4 w-48 sm:w-56 lg:w-64 rounded-xl border-border/50 bg-input/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                handleSearchChange("");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </form>

        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="rounded-xl border-border/50 hover:bg-accent/50 hidden sm:flex"
          title="Filter tasks (F)"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          {onNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotifications}
              className="h-9 w-9 p-0 rounded-xl hover:bg-accent/50"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </Button>
          )}

          {/* Settings */}
          {onOpenSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="h-9 w-9 p-0 rounded-xl hover:bg-accent/50"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}

          {/* Profile */}
          {onProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfile}
              className="h-9 w-9 p-0 rounded-xl hover:bg-accent/50"
              title="Profile"
            >
              <User className="w-4 h-4" />
            </Button>
          )}

          {/* Add Task Button */}
          <Button
            size="sm"
            onClick={onAddTask}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            title="Add new task (N)"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      {isSearchFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg z-50">
          <div className="text-sm text-muted-foreground">
            <div className="font-medium text-foreground mb-2">Keyboard Shortcuts:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><kbd className="px-1 py-0.5 bg-muted rounded">/</kbd> Focus search</div>
              <div><kbd className="px-1 py-0.5 bg-muted rounded">N</kbd> New task</div>
              <div><kbd className="px-1 py-0.5 bg-muted rounded">F</kbd> Open filters</div>
              <div><kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> Close</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrumHeader;
