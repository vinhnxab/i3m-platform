import { motion } from 'motion/react';
import { Button } from '../ui';
import { Settings, PanelRight, X } from 'lucide-react';

interface ContentSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export function ContentSidebar({ isOpen, onToggle, isMobile }: ContentSidebarProps) {
  if (isMobile) {
    return null; // Hide on mobile
  }

  return (
    <>
      {/* Content Sidebar */}
      {isOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col bg-background/95 backdrop-blur-xl border-l border-border/30 flex-shrink-0 overflow-hidden h-full"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between p-4 border-b border-border/30 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Settings</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="rounded-xl p-1 w-8 h-8 hover:bg-muted/50"
              title="Close Settings Panel"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="w-full flex-1 overflow-y-auto hide-scrollbar p-4">
            <div className="space-y-6 w-full">
              {/* Quick Actions Section */}
              <div className="space-y-4 w-full">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</h4>
                
                <div className="space-y-3 w-full">
                  <Button variant="outline" size="sm" className="w-full justify-start h-10 px-4">
                    <PanelRight className="w-4 h-4 mr-3" />
                    <span className="font-medium">New Document</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start h-10 px-4">
                    <Settings className="w-4 h-4 mr-3" />
                    <span className="font-medium">Settings</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start h-10 px-4">
                    <PanelRight className="w-4 h-4 mr-3" />
                    <span className="font-medium">Export Data</span>
                  </Button>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="space-y-4 w-full">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Recent Activity</h4>
                
                <div className="space-y-3 w-full">
                  <div className="p-4 bg-muted/30 rounded-xl w-full border border-border/20">
                    <div className="text-sm font-semibold text-foreground">Document Updated</div>
                    <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl w-full border border-border/20">
                    <div className="text-sm font-semibold text-foreground">Settings Changed</div>
                    <div className="text-xs text-muted-foreground mt-1">5 minutes ago</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl w-full border border-border/20">
                    <div className="text-sm font-semibold text-foreground">Export Completed</div>
                    <div className="text-xs text-muted-foreground mt-1">10 minutes ago</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Section */}
              <div className="space-y-4 w-full">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Stats</h4>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-4 bg-primary/10 rounded-xl text-center border border-primary/20">
                    <div className="text-xl font-bold text-primary">24</div>
                    <div className="text-xs text-muted-foreground font-medium">Documents</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-xl text-center border border-green-500/20">
                    <div className="text-xl font-bold text-green-600">12</div>
                    <div className="text-xs text-muted-foreground font-medium">Active</div>
                  </div>
                </div>
              </div>

              {/* Settings Preview Section */}
              <div className="space-y-4 w-full">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Preferences</h4>
                
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between w-full p-3 bg-muted/20 rounded-xl border border-border/20">
                    <span className="text-sm font-medium">Auto-save</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full p-3 bg-muted/20 rounded-xl border border-border/20">
                    <span className="text-sm font-medium">Notifications</span>
                    <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/30 flex-shrink-0 bg-gradient-to-r from-background to-background/50">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground font-medium mb-2">
              <div className="flex items-center justify-center w-8 h-8 min-w-[2rem] min-h-[2rem] aspect-square bg-primary/10 rounded-xl border border-primary/20">
                <Settings className="w-4 h-4 flex-shrink-0 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-semibold">Settings Panel</span>
                <p className="text-xs text-muted-foreground/60 font-medium">v2024.1.0</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
