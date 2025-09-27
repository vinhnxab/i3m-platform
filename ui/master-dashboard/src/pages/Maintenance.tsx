import React from 'react';
import { Button } from '@/shared/components/ui';
import { Wrench, Home, RefreshCw } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const Maintenance: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AuthLayout 
      title="System Maintenance"
      subtitle="We're currently performing scheduled maintenance to improve your experience."
      showLogo={true}
      showLanguageSwitcher={false}
    >
      <div className="text-center space-y-6">
        {/* Maintenance Illustration */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
            <Wrench className="h-12 w-12 text-orange-400" />
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            Maintenance in Progress
          </h2>
          <p className="text-white/70 text-sm max-w-sm mx-auto">
            Our team is working hard to bring you an improved experience. 
            We expect to be back online shortly.
          </p>
        </div>

        {/* Estimated Time */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="text-white/80 text-sm mb-2">Estimated completion time:</div>
          <div className="text-white font-semibold">30-60 minutes</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Check Again</span>
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs">
            Need immediate assistance? Contact us at{' '}
            <a href="mailto:support@i3m.com" className="text-blue-400 hover:text-blue-300">
              support@i3m.com
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Maintenance;
