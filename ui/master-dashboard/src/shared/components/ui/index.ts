// UI components barrel export - re-export from original location
export * from '@/shared/components/ui/button';
export * from '@/shared/components/ui/card';
export * from '@/shared/components/ui/badge';
export * from '@/shared/components/ui/tabs';
export * from '@/shared/components/ui/input';
export * from '@/shared/components/ui/utils';
export { cn } from '@/shared/components/ui/utils';
export * from '@/shared/components/ui/accordion';
export * from '@/shared/components/ui/alert-dialog';
export * from '@/shared/components/ui/alert';
export * from '@/shared/components/ui/aspect-ratio';
export * from '@/shared/components/ui/avatar';
export * from '@/shared/components/ui/breadcrumb';
export * from '@/shared/components/ui/calendar';
export * from '@/shared/components/ui/carousel';
export * from '@/shared/components/ui/chart';
export * from '@/shared/components/ui/checkbox';
export * from '@/shared/components/ui/collapsible';
export * from '@/shared/components/ui/command';
export * from '@/shared/components/ui/context-menu';
export * from '@/shared/components/ui/dialog';
export * from '@/shared/components/ui/drawer';
export * from '@/shared/components/ui/dropdown-menu';
export * from '@/shared/components/ui/form';
export * from '@/shared/components/ui/hover-card';
export * from '@/shared/components/ui/input-otp';
export * from '@/shared/components/ui/label';
export * from '@/shared/components/ui/menubar';
export * from '@/shared/components/ui/navigation-menu';
export * from '@/shared/components/ui/pagination';
export * from '@/shared/components/ui/popover';
export * from '@/shared/components/ui/progress';
export * from '@/shared/components/ui/radio-group';
export * from '@/shared/components/ui/resizable';
export * from '@/shared/components/ui/scroll-area';
export * from '@/shared/components/ui/select';
export * from '@/shared/components/ui/separator';
export * from '@/shared/components/ui/sheet';
export * from '@/shared/components/ui/Sidebar';
export * from '@/shared/components/ui/skeleton';
export * from '@/shared/components/ui/slider';
export * from '@/shared/components/ui/sonner';
export * from '@/shared/components/ui/switch';
export * from '@/shared/components/ui/table';
export * from '@/shared/components/ui/textarea';
export * from '@/shared/components/ui/toggle-group';
export * from '@/shared/components/ui/toggle';
export * from '@/shared/components/ui/tooltip';

// Scrollbar utilities
export const scrollbarHideStyles = {
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
};