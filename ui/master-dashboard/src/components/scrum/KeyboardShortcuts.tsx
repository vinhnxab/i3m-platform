import React, { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface KeyboardShortcutsProps {
  onNewTask: () => void;
  onSearch: () => void;
  onFilter: () => void;
  onSave: () => void;
  onCancel: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkEdit: () => void;
  onBulkDelete: () => void;
  onBulkMove: (status: string) => void;
  onToggleFullscreen: () => void;
  onNextTab: () => void;
  onPrevTab: () => void;
  isDialogOpen?: boolean;
  hasSelection?: boolean;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onNewTask,
  onSearch,
  onFilter,
  onSave,
  onCancel,
  onSelectAll,
  onClearSelection,
  onBulkEdit,
  onBulkDelete,
  onBulkMove,
  onToggleFullscreen,
  onNextTab,
  onPrevTab,
  isDialogOpen = false,
  hasSelection = false,
}) => {
  // Global shortcuts (always active)
  useHotkeys("n", onNewTask, { preventDefault: true });
  useHotkeys("/", onSearch, { preventDefault: true });
  useHotkeys("f", onFilter, { preventDefault: true });
  useHotkeys("ctrl+`", onToggleFullscreen, { preventDefault: true });
  useHotkeys("ctrl+tab", onNextTab, { preventDefault: true });
  useHotkeys("ctrl+shift+tab", onPrevTab, { preventDefault: true });

  // Dialog shortcuts (only when dialog is open)
  useHotkeys("ctrl+s", onSave, { 
    preventDefault: true, 
    enabled: isDialogOpen 
  });
  useHotkeys("escape", onCancel, { 
    preventDefault: true, 
    enabled: isDialogOpen 
  });

  // Selection shortcuts (only when tasks are selected)
  useHotkeys("ctrl+a", onSelectAll, { preventDefault: true });
  useHotkeys("escape", onClearSelection, { 
    preventDefault: true, 
    enabled: hasSelection && !isDialogOpen 
  });
  useHotkeys("e", onBulkEdit, { 
    preventDefault: true, 
    enabled: hasSelection 
  });
  useHotkeys("delete", onBulkDelete, { 
    preventDefault: true, 
    enabled: hasSelection 
  });

  // Quick move shortcuts
  useHotkeys("1", () => onBulkMove("backlog"), { 
    preventDefault: true, 
    enabled: hasSelection 
  });
  useHotkeys("2", () => onBulkMove("todo"), { 
    preventDefault: true, 
    enabled: hasSelection 
  });
  useHotkeys("3", () => onBulkMove("in-progress"), { 
    preventDefault: true, 
    enabled: hasSelection 
  });
  useHotkeys("4", () => onBulkMove("review"), { 
    preventDefault: true, 
    enabled: hasSelection 
  });
  useHotkeys("5", () => onBulkMove("testing"), { 
    preventDefault: true, 
    enabled: hasSelection 
  });
  useHotkeys("6", () => onBulkMove("done"), { 
    preventDefault: true, 
    enabled: hasSelection 
  });
  useHotkeys("7", () => onBulkMove("deployed"), { 
    preventDefault: true, 
    enabled: hasSelection 
  });

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
