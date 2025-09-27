import React, { ReactNode } from 'react';
import { I3MLogo } from '@/shared/components/common/I3MLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import '@/styles/login.css';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showLanguageSwitcher?: boolean;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showLogo = true
}: AuthLayoutProps) {
  // Ensure body has no margin/padding for full screen background
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
    }

    // Cleanup body styles when component unmounts
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.margin = '';
        document.body.style.padding = '';
        document.body.style.overflow = '';
      }
    };
  }, []);

  return (
    <div
      className="auth-layout flex items-center justify-center relative overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
        zIndex: 9999
      }}
    >
      {/* Simple Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>



      {/* Main Content */}
      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6" 
           style={{ 
             width: 'clamp(400px, 40vw, 600px)',
             maxWidth: '600px'
           }}>
        
        {/* Top Controls - Language Switcher */}
        <div className="flex justify-end items-center mb-4">
          {/* Language Switcher - Right */}
          <LanguageSwitcher />
        </div>

        {/* Logo and Header - Only show if showLogo is true */}
        {showLogo && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 mb-4 mx-auto">
              <I3MLogo size="lg" animated={false} theme="dark" className="text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">
              I3M Platform
            </h1>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto"></div>
          </div>
        )}

        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="text-center">
            {title && (
              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">{title}</h1>
            )}
            {subtitle && (
              <p className="text-white/90 text-lg font-medium">{subtitle}</p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
        `
      }} />
    </div>
  );
}