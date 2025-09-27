import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui';
import { useDesignSystem, type DesignSystem } from '@/app/providers/DesignSystemProvider';

const designSystems = [
  { id: 'apple' as DesignSystem, name: 'Apple', color: '#007AFF' },
  { id: 'material' as DesignSystem, name: 'Material', color: '#6750A4' },
  { id: 'fluent' as DesignSystem, name: 'Fluent', color: '#0078D4' },
  { id: 'ant' as DesignSystem, name: 'Ant Design', color: '#1890FF' },
  { id: 'chakra' as DesignSystem, name: 'Chakra UI', color: '#3182CE' },
  { id: 'custom' as DesignSystem, name: 'Custom', color: '#8B5CF6' },
];

export function DesignSystemToggle() {
  const { designSystem, setDesignSystem } = useDesignSystem();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl p-2 bg-muted/50 hover:bg-muted w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] aspect-square flex items-center justify-center relative group"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Palette className="w-4 h-4 text-foreground transition-all group-hover:scale-110" />
          </div>
          <span className="sr-only">Change design system</span>
          
          {/* Subtle indicator */}
          <motion.div
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary opacity-60"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-56 p-2 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl z-[150]" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-sm font-semibold text-foreground border-b border-border/30 mb-2">
            Design System
          </div>
          {designSystems.map((system) => {
            const isSelected = designSystem === system.id;
            
            return (
              <button
                key={system.id}
                onClick={() => setDesignSystem(system.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl hover:bg-muted/50 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border border-border/50"
                    style={{ backgroundColor: system.color }}
                  />
                  <span className="text-foreground font-medium">{system.name}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}