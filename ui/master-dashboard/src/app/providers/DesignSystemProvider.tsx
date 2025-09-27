import React, { createContext, useContext, useEffect, useState } from 'react';

export type DesignSystem = 'apple' | 'material' | 'fluent' | 'ant' | 'chakra' | 'custom';
export type ColorMode = 'light' | 'dark' | 'system';

interface DesignSystemContextType {
  designSystem: DesignSystem;
  colorMode: ColorMode;
  setDesignSystem: (system: DesignSystem) => void;
  setColorMode: (mode: ColorMode) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};

interface DesignSystemProviderProps {
  children: React.ReactNode;
  defaultSystem?: DesignSystem;
  defaultMode?: ColorMode;
  storageKey?: string;
  systemStorageKey?: string;
}

export function DesignSystemProvider({
  children,
  defaultSystem = 'apple',
  defaultMode = 'system',
  storageKey = 'i3m-theme-mode',
  systemStorageKey = 'i3m-design-system',
}: DesignSystemProviderProps) {
  const [designSystem, setDesignSystemState] = useState<DesignSystem>(defaultSystem);
  const [colorMode, setColorModeState] = useState<ColorMode>(defaultMode);

  useEffect(() => {
    // Load saved preferences
    try {
      const savedSystem = localStorage.getItem(systemStorageKey) as DesignSystem;
      const savedMode = localStorage.getItem(storageKey) as ColorMode;
      
      if (savedSystem && ['apple', 'material', 'fluent', 'ant', 'chakra', 'custom'].includes(savedSystem)) {
        setDesignSystemState(savedSystem);
      }
      
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setColorModeState(savedMode);
      }
    } catch (error) {
      console.error('Error loading design system preferences:', error);
    }
  }, [storageKey, systemStorageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('apple', 'material', 'fluent', 'ant', 'chakra', 'custom');
    root.classList.remove('light', 'dark');
    
    // Apply design system class
    root.classList.add(designSystem);
    
    // Apply color mode
    if (colorMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(colorMode);
    }
  }, [designSystem, colorMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (colorMode === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [colorMode]);

  const setDesignSystem = (system: DesignSystem) => {
    try {
      localStorage.setItem(systemStorageKey, system);
      setDesignSystemState(system);
    } catch (error) {
      console.error('Error saving design system preference:', error);
    }
  };

  const setColorMode = (mode: ColorMode) => {
    try {
      localStorage.setItem(storageKey, mode);
      setColorModeState(mode);
    } catch (error) {
      console.error('Error saving color mode preference:', error);
    }
  };

  const value = {
    designSystem,
    colorMode,
    setDesignSystem,
    setColorMode,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}
