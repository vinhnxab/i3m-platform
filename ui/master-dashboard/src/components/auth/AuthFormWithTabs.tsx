import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, clearError } from '@/store/slices/authSlice';
import { useLanguage } from "@/app/providers/LanguageProvider";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AuthFormWithTabs() {
  const [activeTab, setActiveTab] = useState("login");
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.auth.isLoading);
  const error = useSelector((state: any) => state.auth.error);
  const { t } = useLanguage();

  // Auto-switch tab based on URL
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('signup');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname]);
  
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Debug: Log when signInData changes
  useEffect(() => {
    console.log('🔍 signInData changed:', signInData);
  }, [signInData]);

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    console.log('🔍 AuthFormWithTabs - Form data:', signInData);
    console.log('🔍 AuthFormWithTabs - Email:', signInData.email);
    console.log('🔍 AuthFormWithTabs - Password:', signInData.password ? '***' : 'empty');
    
    // Validate form data
    if (!signInData.email || !signInData.password) {
      console.log('❌ Form validation failed - missing email or password');
      console.log('❌ signInData state:', signInData);
      return;
    }
    
    // Don't reset form data here - let Redux handle it
    console.log('✅ Form validation passed, dispatching login...');
    
    try {
      // Create a copy of form data to prevent state changes
      const formData = {
        email: signInData.email,
        password: signInData.password
      };
      
      console.log('🔍 AuthFormWithTabs - Dispatching with data:', formData);
      
      const result = await dispatch(loginUser(formData));
      
      if (loginUser.fulfilled.match(result)) {
        // Login successful, check if user has multiple roles
        const user = result.payload.user;
        
        console.log('🔍 AuthFormWithTabs - User data:', user);
        console.log('🔍 AuthFormWithTabs - user role:', user?.role);
        
        // Check if user data exists
        if (!user) {
          console.error('❌ AuthFormWithTabs - No user data in response');
          return;
        }
        
        if (!user.role) {
          console.error('❌ AuthFormWithTabs - No role in user data');
          return;
        }
        
        // Always redirect to primary role dashboard using paths
        console.log('🔍 AuthFormWithTabs - Redirecting to primary role dashboard');
        if (user.role === 'MARKETPLACE_DEVELOPER') {
          navigate('/developer/dashboard');
        } else if (user.role.startsWith('TENANT_')) {
          navigate('/tenant/dashboard');
        } else if (user.role.startsWith('PLATFORM_')) {
          navigate('/dashboard');
        } else if (user.role === 'END_CUSTOMER') {
          navigate('/customer/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.log('❌ Login failed:', result);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!agreeToTerms) {
      return;
    }

    try {
      const result = await dispatch(registerUser({
        name: signUpData.fullName,
        email: signUpData.email,
        password: signUpData.password,
        confirmPassword: signUpData.confirmPassword,
        agreeToTerms: agreeToTerms,
      }));
      
      if (registerUser.fulfilled.match(result)) {
        // Registration successful, navigate to appropriate dashboard
        const user = result.payload.user;
        if (user.role === 'MARKETPLACE_DEVELOPER') {
          navigate('/developer/dashboard');
        } else if (user.role.startsWith('TENANT_')) {
          navigate('/tenant/dashboard');
        } else if (user.role.startsWith('PLATFORM_')) {
          navigate('/dashboard');
        } else if (user.role === 'END_CUSTOMER') {
          navigate('/customer/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Dynamic text based on active tab
  const getHeaderText = () => {
    return activeTab === "login" 
      ? { title: t('auth.welcomeBack'), description: t('auth.enterCredentials') }
      : { title: t('auth.createAccount'), description: t('auth.joinPlatform') };
  };

  return (
    <div className="w-full max-w-md mx-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-200 text-base">{error}</span>
          </div>
        )}

        {/* Main Card */}
        <Card className="backdrop-blur-xl bg-white/5 border-white/30 shadow-2xl glass-effect">
          <CardHeader className="text-center pb-2 pt-6">
            <CardTitle className="text-white text-xl">
              {getHeaderText().title}
            </CardTitle>
            <CardDescription className="text-white">
              {getHeaderText().description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Custom Tabs with Enhanced Slide Animation */}
            <div className="tabs-container">
              <div className={`tab-slider ${activeTab === 'signup' ? 'signup' : ''} ${isSwitching ? 'switching' : ''}`}></div>
                  <button
                    className={`tab-trigger ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => {
                      if (activeTab !== 'login') {
                        setIsSwitching(true);
                        setTimeout(() => {
                          setActiveTab('login');
                          clearError();
                          navigate('/login');
                          setIsSwitching(false);
                        }, 100);
                      }
                    }}
                >
                  {t('auth.signIn')}
                  </button>
                  <button
                    className={`tab-trigger ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => {
                      if (activeTab !== 'signup') {
                        setIsSwitching(true);
                        setTimeout(() => {
                          setActiveTab('signup');
                          clearError();
                          navigate('/register');
                          setIsSwitching(false);
                        }, 100);
                      }
                    }}
                >
                  {t('auth.signUp')}
                  </button>
            </div>

            {activeTab === 'login' && (
              <div className="space-y-4 mt-6 tab-content">
                <form
                  onSubmit={handleSignIn}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="signInEmail"
                      className="text-white"
                    >
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="signInEmail"
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          email: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/30 text-white placeholder-light focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signInPassword"
                      className="text-white"
                    >
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                    <Input
                        id="signInPassword"
                        type={showPassword ? "text" : "password"}
                      placeholder={t('auth.passwordPlaceholder')}
                      value={signInData.password}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          password: e.target.value,
                        })
                      }
                        className="bg-white/10 border-white/30 text-white placeholder-light focus:border-blue-400 focus:ring-blue-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={signInData.rememberMe}
                        onCheckedChange={(checked: boolean) =>
                          setSignInData({
                            ...signInData,
                            rememberMe: checked,
                          })
                        }
                        className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="text-white text-base"
                      >
                        {t('auth.rememberMe')}
                      </Label>
                    </div>
                    
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full submit-button disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('auth.signingIn')}
                      </>
                    ) : (
                      t('auth.signIn')
                    )}
                  </Button>
                </form>
                <div className="text-center">
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="text-white hover:text-blue-100 text-base underline bg-transparent border-none cursor-pointer"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="space-y-4 mt-6 tab-content">
                <form
                  onSubmit={handleSignUp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-white"
                    >
                      {t('auth.fullName')}
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t('auth.fullNamePlaceholder')}
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/30 text-white placeholder-light focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signUpEmail"
                      className="text-white"
                    >
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="signUpEmail"
                      type="email"
                      placeholder={t('auth.emailPlaceholder')}
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          email: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/30 text-white placeholder-light focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signUpPassword"
                      className="text-white"
                    >
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                    <Input
                      id="signUpPassword"
                        type={showPassword ? "text" : "password"}
                      placeholder={t('auth.passwordPlaceholder')}
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                        className="bg-white/10 border-white/30 text-white placeholder-light focus:border-blue-400 focus:ring-blue-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-white"
                    >
                      {t('auth.confirmPassword')}
                    </Label>
                    <div className="relative">
                    <Input
                      id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          confirmPassword: e.target.value,
                        })
                      }
                        className="bg-white/10 border-white/30 text-white placeholder-light focus:border-blue-400 focus:ring-blue-400 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Terms Agreement Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked: boolean) => setAgreeToTerms(checked)}
                      className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-base text-white cursor-pointer"
                    >
                      {t('auth.agreeToTerms')}
                    </Label>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!agreeToTerms || isLoading}
                    className="w-full submit-button disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('auth.creatingAccount')}
                      </>
                    ) : (
                      t('auth.createAccount')
                    )}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-base">
          <p>{t('auth.secureAccess')}</p>
      </div>
    </div>
  );
}