import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { initializeAuth } from './slices/authSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

// Component to initialize auth state
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize auth state from localStorage
    store.dispatch(initializeAuth());
  }, []);

  return <>{children}</>;
};

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
};
