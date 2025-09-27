import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthFormWithTabs from '@/components/auth/AuthFormWithTabs';
import AuthLayout from '@/components/auth/AuthLayout';
import { useSelector } from 'react-redux';

interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

const Register: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <AuthLayout>
      <AuthFormWithTabs />
    </AuthLayout>
  );
};

export default Register;
