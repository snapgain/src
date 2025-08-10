import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // FUNÇÃO PARA LIMPAR STORAGE CORROMPIDO
  const clearCorruptedStorage = () => {
    try {
      localStorage.removeItem('snapgain_user');
      localStorage.removeItem('sb-ffowgyjdbgkphsflxybk-auth-token');
      sessionStorage.clear();
    } catch (error) {
      console.warn('Error clearing storage:', error);
    }
  };

  // FUNÇÃO HELPER PARA SAFELY PARSE JSON
  const safeJsonParse = (str) => {
    try {
      if (!str || str === 'undefined' || str === 'null') return null;
      const parsed = JSON.parse(str);
      return (parsed && typeof parsed === 'object') ? parsed : null;
    } catch (error) {
      console.warn('Failed to parse JSON, clearing corrupted data:', error);
      clearCorruptedStorage();
      return null;
    }
  };

  // FUNÇÃO HELPER PARA SAFELY SAVE JSON
  const safeJsonSave = (key, data) => {
    try {
      if (data && typeof data === 'object') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        // LIMPAR QUALQUER STORAGE CORROMPIDO PRIMEIRO
        clearCorruptedStorage();
        
        setLoading(true);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Session found for user:', session.user.email);
          const trialStart = new Date().toISOString();
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            isRegistered: true,
            trialStart,
            subscription: 'trial',
            supabaseUser: session.user
          };
          safeJsonSave('snapgain_user', userData);
          setUser(userData);
        } else {
          console.log('No session found');
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load session", error);
        clearCorruptedStorage();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const trialStart = new Date().toISOString();
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email.split('@')[0],
              isRegistered: true,
              trialStart,
              subscription: 'trial',
              supabaseUser: session.user
            };
            safeJsonSave('snapgain_user', userData);
            setUser(userData);
          } else if (event === 'SIGNED_OUT') {
            clearCorruptedStorage();
            setUser(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          clearCorruptedStorage();
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      if (!email || !password || !email.includes('@') || password.length < 6) {
        throw new Error('Please provide valid email and password');
      }

      // LIMPAR STORAGE ANTES DE TENTAR LOGIN
      clearCorruptedStorage();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        
        let errorMessage = 'Invalid email or password';
        if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        }
        
        toast({
          title: "Login Error",
          description: errorMessage,
          variant: "destructive"
        });
        throw error;
      }
      
      if (data.user) {
        console.log('Login successful for user:', data.user.email);
        const trialStart = new Date().toISOString();
        const userData = { 
          id: data.user.id,
          email: data.user.email, 
          name: data.user.user_metadata?.name || email.split('@')[0], 
          isRegistered: true, 
          trialStart,
          subscription: 'trial',
          supabaseUser: data.user
        };
        safeJsonSave('snapgain_user', userData);
        setUser(userData);
        
        toast({ 
          title: "Login Successful!", 
          description: "Welcome back to SnapGain." 
        });
        
        return data;
      }
      
    } catch (error) {
      console.error('Login error:', error);
      if (!error.message.includes('Email not confirmed') && !error.message.includes('Invalid login credentials')) {
        toast({ 
          title: "Login Error", 
          description: "Something went wrong. Please try again.", 
          variant: "destructive" 
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, captchaToken = null) => {
    setLoading(true);
    try {
      console.log('🔵 Starting signup process...');
      console.log('📧 Email (raw):', email);
      console.log('👤 Name (raw):', name);
      console.log('🔒 Password (raw):', password);
      console.log('🔒 Password length:', password?.length);
      console.log('🤖 Captcha token:', captchaToken ? 'Present' : 'Missing');
      
      // DETECTAR PARÂMETROS TROCADOS
      if (email && !email.includes('@') && name && name.includes('@')) {
        console.warn('⚠️ Parâmetros possivelmente trocados! Corrigindo...');
        console.log('🔄 Trocando name e email');
        const temp = email;
        email = name;
        name = temp;
        console.log('✅ Após correção - Email:', email, 'Name:', name);
      }
      
      if (!name || !email || !password || !email.includes('@')) {
        console.error('❌ Validation failed after correction');
        console.log('🔍 Final values:', { name, email, passwordLength: password?.length });
        toast({
          title: "Signup Failed",
          description: "Please fill all fields correctly.",
          variant: "destructive"
        });
        return false;
      }

      // LIMPAR STORAGE ANTES DE SIGNUP
      clearCorruptedStorage();

      console.log('🚀 Calling Supabase signUp...');
      
      const signUpOptions = {
        email: email.trim(),
        password: password,
        options: { 
          data: {
            name: name.trim()
          }
        }
      };

      // ADICIONAR CAPTCHA APENAS SE EXISTIR
      if (captchaToken) {
        signUpOptions.options.captchaToken = captchaToken;
        console.log('🤖 Added captcha token to options');
      }

      console.log('📋 SignUp options:', {
        email: signUpOptions.email,
        passwordLength: signUpOptions.password.length,
        hasName: !!signUpOptions.options.data.name,
        hasCaptcha: !!signUpOptions.options.captchaToken
      });

      const { data, error } = await supabase.auth.signUp(signUpOptions);

      console.log('📊 Supabase response:');
      console.log('✅ Data:', data);
      console.log('❌ Error:', error);

      if (error) {
        console.error('🚨 Supabase signup error:', error);
        console.error('🔍 Error details:', {
          message: error.message,
          status: error.status,
          statusCode: error.statusCode
        });
        
        toast({ 
          title: "Signup Failed", 
          description: error.message || "Failed to create account", 
          variant: "destructive" 
        });
        return false;
      }

      if (data?.user) {
        console.log('🎉 Signup successful!');
        console.log('👤 User created:', {
          id: data.user.id,
          email: data.user.email,
          confirmed: data.user.email_confirmed_at ? 'Yes' : 'No'
        });
        
        toast({ 
          title: "Account Created!", 
          description: "Please check your email to verify your account." 
        });
        return true;
      } else {
        console.warn('⚠️ No user in response but no error');
        console.log('📄 Full data:', data);
        return false;
      }
    } catch (error) {
      console.error('💥 Signup catch error:', error);
      console.error('🔍 Error stack:', error.stack);
      
      toast({ 
        title: "Signup Error", 
        description: error.message || "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      console.log('🏁 Signup process finished');
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider) => {
    setLoading(true);
    try {
      console.log('Attempting OAuth login with:', provider);
      
      // LIMPAR STORAGE ANTES DE OAUTH
      clearCorruptedStorage();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('OAuth error:', error);
        toast({ 
          title: "Authentication Error", 
          description: error.message || "Failed to authenticate with Google", 
          variant: "destructive" 
        });
        setLoading(false);
        return false;
      }

      return true;
    } catch (error) {
      console.error('OAuth error:', error);
      toast({ 
        title: "Authentication Error", 
        description: "Something went wrong with Google authentication", 
        variant: "destructive" 
      });
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
      clearCorruptedStorage();
      setUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      console.error('Logout error:', error);
      clearCorruptedStorage();
      setUser(null);
    }
  };

  const completeRegistration = (formData) => {
    setLoading(true);
    const updatedUser = { ...user, ...formData, isRegistered: true };
    safeJsonSave('snapgain_user', updatedUser);
    setUser(updatedUser);
    toast({ title: "Registration Complete!", description: "You're all set to use SnapGain." });
    setLoading(false);
  };

  const updateSubscription = (subscriptionType) => {
    if (user) {
      const updatedUser = { ...user, subscription: subscriptionType };
      safeJsonSave('snapgain_user', updatedUser);
      setUser(updatedUser);
    }
  };

  // Verifica se trial expirou
  const isTrialExpired = user && user.trialStart && ((new Date() - new Date(user.trialStart)) > 3 * 24 * 60 * 60 * 1000);

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const clearAllUserData = async () => {
    try {
      // Limpar Supabase
      await supabase.auth.signOut();
      
      // Limpar localStorage
      localStorage.clear();
      sessionStorage.clear();
      
      // Tentar limpar IndexedDB
      try {
        await indexedDB.deleteDatabase('supabase-auth-token');
      } catch (e) {
        console.warn('Could not clear IndexedDB:', e);
      }
      
      // Recarregar página
      window.location.reload();
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    signInWithProvider,
    completeRegistration,
    logout,
    updateSubscription,
    isTrialExpired,
    validatePassword,
    clearAllUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};