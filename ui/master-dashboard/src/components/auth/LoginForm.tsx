import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui';
import { Checkbox } from '@/shared/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { Alert, AlertDescription } from '@/shared/components/ui';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/store/slices/authSlice';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { I3MLogo } from '@/shared/components/common/I3MLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import RegisterForm from './RegisterForm';

export default function LoginForm() {
  const dispatch = useDispatch();
  const { t, getLanguageInfo } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Debug language detection info
  React.useEffect(() => {
    const info = getLanguageInfo();
    if (info) {
      console.log('🌐 Language Detection Info:', info);
    }
  }, [getLanguageInfo]);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await dispatch(loginUser(loginData));
      if (loginUser.fulfilled.match(result)) {
        // Login successful, navigate to appropriate dashboard
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
        setError(result.payload as string || t('auth.failedToSignIn'));
      }
    } catch (err: any) {
      setError(err.message || t('auth.failedToSignIn'));
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
          <p className="text-muted-foreground">{t('auth.enterCredentials')}</p>
          <div className="flex justify-center mt-4">
            <LanguageSwitcher />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.signIn')}</CardTitle>
            <CardDescription>{t('auth.enterCredentials')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email')}
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.password')}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('auth.rememberMe')}
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading ? t('auth.signingIn') : t('auth.signIn')}
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