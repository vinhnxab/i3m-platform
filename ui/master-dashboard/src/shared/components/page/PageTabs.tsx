import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';

interface TabConfig {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface PageTabsProps {
  tabs: TabConfig[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function PageTabs({ tabs, defaultValue, onValueChange, className = "" }: PageTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} onValueChange={onValueChange} className={`space-y-6 ${className}`}>
      <TabsList className="grid w-full grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
