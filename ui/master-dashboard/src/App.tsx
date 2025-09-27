import React from 'react';
import { ErrorBoundary } from './app/ErrorBoundary';
import { ReduxProvider } from './store/ReduxProvider';
import { ThemeProvider, DesignSystemProvider, LanguageProvider } from './app/providers';
import { AppRouter } from './app/router/RouterConfig';
import SimpleAuthGuard from './components/SimpleAuthGuard';

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <LanguageProvider defaultLanguage="en">
          <DesignSystemProvider defaultSystem="apple" defaultMode="system">
            <ThemeProvider defaultTheme="system" storageKey="i3m-theme">
              <SimpleAuthGuard>
                <AppRouter />
              </SimpleAuthGuard>
            </ThemeProvider>
          </DesignSystemProvider>
        </LanguageProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default App;