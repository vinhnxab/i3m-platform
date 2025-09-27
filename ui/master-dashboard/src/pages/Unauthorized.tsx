import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { Shield, Home, ArrowLeft, LogIn } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout 
      title="Access Denied"
      subtitle="You don't have permission to access this resource."
      showLogo={true}
      showLanguageSwitcher={false}
    >
      <div className="text-center space-y-6">
        {/* Unauthorized Illustration */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Unauthorized Access
          </h2>
          <p className="text-white/70 text-sm max-w-sm mx-auto">
            You don't have the necessary permissions to view this page. 
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Error Code */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="text-red-300 text-sm font-mono">Error 403 - Forbidden</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center space-x-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs">
            If you continue to experience issues, please contact support.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Unauthorized;
