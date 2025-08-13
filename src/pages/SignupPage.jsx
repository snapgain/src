import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import ProfileSetupModal from '@/components/profile/ProfileSetupModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  

  // ADICIONAR VERIFICAÇÃO DO SUPABASE
  useEffect(() => {
    console.log('🔍 Supabase config check:', {
      url: supabase.supabaseUrl,
      hasKey: !!supabase.supabaseKey,
      authUrl: `${supabase.supabaseUrl}/auth/v1`
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Atualizar a função handleSubmit
  // SUBSTITUIR A FUNÇÃO handleSubmit (linha 108):

  const handleSubmit = async (e) => {
    e.preventDefault();

      // ✅ NOVO: trava duplo submit nesse bloco, mesmo com múltiplos renders/listeners
  if (window.__snapgain_auth_busy) {
    console.warn('Signup already in progress — ignoring duplicate submit.');
    return;
  }
  window.__snapgain_auth_busy = true; // ✅ NOVO
    
    try {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

     // ✅ NOVO: jitter base para retries desta aba (evita rajada simultânea)
    const jitterBase = Math.floor(Math.random() * 500); // 0–500ms
    
    // ✅ FUNÇÃO PARA RETRY AUTOMÁTICO
    const attemptSignup = async (retryCount = 0) => {
      const maxRetries = 3;
      
      try {
        console.log('⏳ Starting signup process...');
        console.log('📝 Form data:', {
          name: formData.name,
          email: formData.email,
          passwordLength: formData.password.length,
          confirmPasswordLength: formData.confirmPassword.length
        });

        // DELAY APENAS NO PRIMEIRO RETRY
        if (retryCount > 0) {
          const waitMs = 3000 + jitterBase * retryCount; // ✅ NOVO: jitter progressivo
          console.log(`⏱️ Retry ${retryCount}/${maxRetries} - Waiting ${waitMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitMs));
        }
        
        console.log('🚀 Calling Supabase signUp...');

        const signUpData = {
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              name: formData.name.trim()
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        };

        console.log('📋 Signup payload:', {
          email: signUpData.email,
          passwordProvided: !!signUpData.password,
          hasName: !!signUpData.options.data.name,
          redirectTo: signUpData.options.emailRedirectTo
        });

        const { data, error } = await supabase.auth.signUp(signUpData);

        console.log('📊 Raw Supabase response:');
        console.log('✅ Data:', data);
        
        if (error) {
          console.log('❌ Error:', error);
          console.log('🚨 Supabase signup error details:', {
            message: error.message,
            status: error.status,
            statusCode: error.statusCode,
            name: error.name,
            details: error.__isSupabaseError ? 'Supabase Error' : 'Generic Error'
          });
          
          // ✅ RETRY PARA ERRO 504
          if ((error.status === 504 || error.name === 'AuthRetryableFetchError') && retryCount < maxRetries) {
            console.log(`🔄 Server timeout, retrying... (${retryCount + 1}/${maxRetries})`);
            return attemptSignup(retryCount + 1);
          }
          
          if (error.message.includes('rate limit') || error.message.includes('429') || error.status === 429) {
            toast({
              title: "Rate limit exceeded",
              description: "Too many signup attempts. Please wait 60 minutes or try Google signup.",
              variant: "destructive"
            });
            return;
          } else if (error.status === 504) {
            toast({
              title: "Server temporarily unavailable",
              description: "Please try again in a few minutes.",
              variant: "destructive"
            });
            return;
          } else if (error.message.includes('email')) {
            toast({
              title: "Email issue",
              description: error.message,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Signup Failed",
              description: error.message || "Failed to create account",
              variant: "destructive"
            });
          }
          return;
        }

        console.log('🔍 Checking response data...');
        
        if (data?.user) {
          console.log('✅ User created successfully!');
          console.log('👤 User details:', {
            id: data.user.id,
            email: data.user.email,
            confirmed: data.user.email_confirmed_at ? 'Yes' : 'No',
            createdAt: data.user.created_at
          });
          
          if (data.session) {
            console.log('🔐 Session created:', !!data.session);
          }
          
          toast({
            title: "Account Created!",
            description: "Please complete your profile setup.",
          });
          setShowProfileModal(true);
          
        } else if (data) {
          console.warn('⚠️ Data received but no user:', data);
          toast({
            title: "Unexpected response",
            description: "Account creation status unclear. Please try logging in.",
            variant: "destructive"
          });
        } else {
          console.error('❌ No data and no error - this should not happen');
          toast({
            title: "Unknown error",
            description: "Please try again or contact support.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('💥 Signup catch error:', error);
        
        // ✅ RETRY PARA NETWORK ERRORS
        if ((error.name === 'TypeError' || error.message.includes('fetch')) && retryCount < maxRetries) {
          console.log(`🔄 Network error, retrying... (${retryCount + 1}/${maxRetries})`);
          return attemptSignup(retryCount + 1);
        }
        
        console.error('🔍 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        });
        
        toast({
          title: "Network Error",
          description: "Please check your connection and try again.",
          variant: "destructive"
        });
      }
    };
    
    try {
      await attemptSignup();
    } finally {
      setIsLoading(false);
    }
    } finally {
    // ✅ NOVO: libera o lock mesmo em erro
    window.__snapgain_auth_busy = false;
  }
  };

  // Função para lidar com o Google signup
  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/compare`, // MUDANÇA AQUI
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        toast({
          title: "Google Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Google signup error:', error);
      toast({
        title: "Error",
        description: "Google sign up failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - SnapGain</title>
        <meta name="description" content="Create your SnapGain account and start your 3-day free trial." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 pt-32">
        <motion.div 
          className="max-w-md w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <span className="text-2xl font-bold">SnapGain</span>
                </div>
                <CardTitle className="text-2xl">Start your free trial</CardTitle>
                <p className="text-muted-foreground">
                  Create your account and get 3 days free access to all features
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button - ✅ CORRIGIR PARA MOBILE */}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-[#6B42F5] hover:to-[#E935B8] touch-manipulation"
                    disabled={isLoading}
                    style={{ minHeight: '44px' }}  // ✅ ALTURA MÍNIMA PARA MOBILE
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Start 3-Day Free Trial'
                    )}
                  </Button>
                </form>

                {/* Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Button - ✅ CORRIGIR PARA MOBILE */}
                <Button
                  variant="outline"
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                  className="w-full touch-manipulation"
                  style={{ minHeight: '44px' }}  // ✅ ALTURA MÍNIMA PARA MOBILE
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              
                {/* Login Link - ✅ CORRIGIR PARA MOBILE */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="font-semibold text-primary hover:underline touch-manipulation"
                    style={{ minHeight: '44px', padding: '8px' }}  // ✅ ÁREA DE TOQUE MAIOR
                  >
                    Sign in
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* ADICIONAR MODAL DE PROFILE SETUP */}
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={() => setShowProfileModal(false)}
      />
    </>
  );
}

export default SignupPage;