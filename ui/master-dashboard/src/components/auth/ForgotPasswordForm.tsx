import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useDispatch } from 'react-redux';
import { forgotPassword } from '@/store/slices/authSlice';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await dispatch(forgotPassword(email));
      if (forgotPassword.fulfilled.match(result)) {
        setIsSubmitted(true);
      } else {
        setError(result.payload as string || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="backdrop-blur-xl bg-white/5 border-white/30 shadow-2xl glass-effect">
          <CardHeader className="text-center pb-2 pt-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-white text-xl">
              {t('auth.checkYourEmail')}
            </CardTitle>
            <CardDescription className="text-white">
              {t('auth.resetLinkSent')} <span className="font-medium text-blue-300">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-white/80 text-base">
                Please check your email and click the link to reset your password.
              </p>
              <p className="text-white/60 text-sm">
                {t('auth.didntReceiveEmail')}
              </p>
              
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleBackToLogin}
                  className="w-full submit-button"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('auth.backToSignIn')}
                </Button>
                
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  {t('auth.tryAnotherEmail')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-base">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md flex items-center space-x-2">
          <span className="text-white text-base font-medium">{error}</span>
        </div>
      )}

      {/* Main Card */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/30 shadow-2xl glass-effect">
        <CardHeader className="text-center pb-2 pt-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
          <CardTitle className="text-white text-xl">
            {t('auth.forgotPasswordTitle')}
          </CardTitle>
          <CardDescription className="text-white">
            {t('auth.forgotPasswordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                {t('auth.email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder-light focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full submit-button disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('auth.sendResetLink')}...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {t('auth.sendResetLink')}
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={handleBackToLogin}
              className="text-white hover:text-blue-100 text-base underline flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('auth.backToSignIn')}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-6 text-white text-base">
        <p>Remember your password? <button onClick={() => navigate('/login')} className="text-blue-300 hover:text-blue-200 underline bg-transparent border-none cursor-pointer">{t('auth.signIn')}</button></p>
      </div>
    </div>
  );
}
