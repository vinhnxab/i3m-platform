import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui';
import { useTheme } from '@/app/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="rounded-xl p-2 bg-muted/50 hover:bg-muted w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] aspect-square flex items-center justify-center"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <Sun className="w-4 h-4" />
        </div>
      </Button>
    );
  }

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl p-2 bg-muted/50 hover:bg-muted w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] aspect-square flex items-center justify-center"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {getCurrentIcon()}
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-40 p-2 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl z-[10000]" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-1">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl hover:bg-muted/50 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-foreground font-medium">{option.label}</span>
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