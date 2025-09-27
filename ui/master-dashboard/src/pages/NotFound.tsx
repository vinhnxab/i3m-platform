import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { Home, ArrowLeft, Search } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout 
      title="404 - Page Not Found"
      subtitle="The page you're looking for doesn't exist or has been moved."
      showLogo={true}
      showLanguageSwitcher={false}
    >
      <div className="text-center space-y-6">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-8xl font-bold text-white/20 mb-4">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-blue-400/60" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-white/70 text-sm max-w-sm mx-auto">
            The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default NotFound;
