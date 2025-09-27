import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, verifyToken } from '../store/slices/authSlice';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
}

const SimpleAuthGuard: React.FC<SimpleAuthGuardProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // If we have a token but no user, try to verify the token
    if (token && !user) {
      dispatch(verifyToken());
    }
  }, [dispatch, token, user]);

  return <>{children}</>;
};

export default SimpleAuthGuard;
