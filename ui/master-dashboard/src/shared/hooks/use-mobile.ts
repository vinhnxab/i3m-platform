import { useState, useEffect, useCallback } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  const handleChange = useCallback((e: MediaQueryListEvent) => {
    setIsMobile(!e.matches);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    
    // Initial check
    setIsMobile(!mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [handleChange]);
  
  return isMobile;
}
