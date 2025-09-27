import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui';
import { Alert, AlertDescription } from '@/shared/components/ui';
import { useDispatch } from 'react-redux';
import { registerUser } from '@/store/slices/authSlice';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { I3MLogo } from '@/shared/components/common/I3MLogo';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'MARKETPLACE_DEVELOPER'
  });

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await dispatch(registerUser({
        firstName: signupData.name,
        lastName: '',
        email: signupData.email,
        password: signupData.password,
        username: signupData.email,
      }));
      
      if (registerUser.fulfilled.match(result)) {
        // Registration successful, navigate to appropriate dashboard
        const user = result.payload.user;
        if (user.role === 'MARKETPLACE_DEVELOPER') {
          navigate('/developer/dashboard');
        } else if (user.role.startsWith('TENANT_')) {
          navigate(`/tenant/${user.tenantId}/dashboard`);
        } else if (user.role.startsWith('PLATFORM_')) {
          navigate('/platform/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.payload as string || t('auth.failedToSignUp'));
      }
    } catch (err: any) {
      setError(err.message || t('auth.failedToSignUp'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <I3MLogo size="lg" animated={false} colorEffect="default" />
          </div>
          <h1 className="text-2xl font-bold">I3M Platform</h1>
          <p className="text-muted-foreground">{t('auth.createNewAccount')}</p>
          <div className="flex justify-center mt-4">
            <LanguageSwitcher />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.createAccount')}</CardTitle>
            <CardDescription>{t('auth.createNewAccount')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-foreground font-medium">{t('auth.fullName')}</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder={t('auth.fullName')}
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                  className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground font-medium">{t('auth.email')}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder={t('auth.email')}
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground font-medium">{t('auth.password')}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder={t('auth.password')}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {/* Role is fixed as MARKETPLACE_DEVELOPER for public registration */}
              <input type="hidden" value="MARKETPLACE_DEVELOPER" />
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.demoCredentials')}
        </div>
      </div>
    </div>
  );
}
