import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className="min-h-screen bg-ocean-50 flex items-center justify-center section-padding">
      <div className="container max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-poppins font-bold text-ocean-900">
                Welcome Back
              </CardTitle>
              <p className="text-slate-600">
                Sign in to access your maritime dashboard
              </p>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#3370A9',
                        brandAccent: '#28598B',
                        brandButtonText: 'white',
                        defaultButtonBackground: '#f8f9fa',
                        defaultButtonBackgroundHover: '#e9ecef',
                        inputBackground: 'white',
                        inputBorder: '#e2e8f0',
                        inputBorderHover: '#3370A9',
                        inputBorderFocus: '#3370A9',
                      },
                      space: {
                        buttonPadding: '12px 16px',
                        inputPadding: '12px 16px',
                      },
                      borderWidths: {
                        buttonBorderWidth: '1px',
                        inputBorderWidth: '1px',
                      },
                      radii: {
                        borderRadiusButton: '6px',
                        buttonBorderRadius: '6px',
                        inputBorderRadius: '6px',
                      },
                    },
                  },
                  className: {
                    container: 'space-y-4',
                    button: 'font-medium transition-all duration-200 hover:shadow-sm focus-ring',
                    input: 'font-inter transition-all duration-200 focus-ring',
                    label: 'font-medium text-slate-700',
                    message: 'text-sm',
                  },
                }}
                providers={['google']}
                redirectTo={`${window.location.origin}/dashboard`}
                onlyThirdPartyProviders={false}
                magicLink={false}
                showLinks={true}
                view="sign_in"
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email address',
                      password_label: 'Password',
                      email_input_placeholder: 'Your email address',
                      password_input_placeholder: 'Your password',
                      button_label: 'Sign in',
                      loading_button_label: 'Signing in ...',
                      social_provider_text: 'Sign in with {{provider}}',
                      link_text: "Don't have an account? Sign up",
                      confirmation_text: 'Check your email for the login link!',
                    },
                    sign_up: {
                      email_label: 'Email address',
                      password_label: 'Create a Password',
                      email_input_placeholder: 'Your email address',
                      password_input_placeholder: 'Your password',
                      button_label: 'Sign up',
                      loading_button_label: 'Signing up ...',
                      social_provider_text: 'Sign up with {{provider}}',
                      link_text: 'Already have an account? Sign in',
                      confirmation_text: 'Check your email for the confirmation link!',
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}