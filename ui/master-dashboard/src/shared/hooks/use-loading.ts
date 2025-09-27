import { useState, useEffect } from 'react';

interface UseLoadingOptions {
  initialDelay?: number;
  minDuration?: number;
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { initialDelay = 0, minDuration = 1000 } = options;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, initialDelay + minDuration);

    return () => clearTimeout(timer);
  }, [initialDelay, minDuration]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading
  };
}
