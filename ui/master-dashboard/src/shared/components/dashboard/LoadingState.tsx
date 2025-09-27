import { LoadingLogo } from '@/shared/components/common';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function LoadingState({ 
  message = "Loading...", 
  size = "lg", 
  showText = true,
  className = ""
}: LoadingStateProps) {
  return (
    <div className={`w-full px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-center min-h-[400px] ${className}`}>
      <LoadingLogo size={size} showText={showText} />
    </div>
  );
}
