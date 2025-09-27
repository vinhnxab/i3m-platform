import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui';
import { Alert, AlertDescription } from '@/shared/components/ui';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser } from '@/store/slices/authSlice';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { I3MLogo } from '@/shared/components/common/I3MLogo';
import { LanguageSwitcher } from './LanguageSwitcher';

interface RootState {
  auth: {
    isLoading: boolean;
    error: string | null;
  };
}

function AuthForm() {
  const dispatch = useDispatch();
  const authLoading = useSelector((state: RootState) => state.auth.isLoading);
  const authError = useSelector((state: RootState) => state.auth.error);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'author'
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await dispatch(loginUser({
        email: loginData.email,
        password: loginData.password,
      }));
      
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
        setError(result.payload as string || 'Failed to sign in');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

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
        setError(result.payload as string || 'Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">{t('auth.signIn')}</TabsTrigger>
          <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
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
                <div className="flex justify-end">
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
        </TabsContent>

        <TabsContent value="signup">
          <Card>
        <CardHeader>
          <CardTitle>{t('auth.createAccount')}</CardTitle>
          <CardDescription>{t('auth.enterCredentials')}</CardDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground font-medium">{t('auth.role')}</Label>
                  <select
                    id="role"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={signupData.role}
                    onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                  >
                    <option value="author">{t('auth.author')}</option>
                    <option value="editor">{t('auth.editor')}</option>
                    <option value="admin">{t('auth.admin')}</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked: boolean) => setAgreeToTerms(checked)}
                    className="border-border focus:ring-primary/20"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('auth.agreeToTerms')}
                  </Label>
                </div>
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
        </TabsContent>
      </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.demoCredentials')}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;