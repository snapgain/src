import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente do Supabase
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (session?.user) {
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
          localStorage.setItem('snapgain_user', JSON.stringify(userData));
          setUser(userData);
        } else {
          // Tentar localStorage como fallback
          const storedUser = localStorage.getItem('snapgain_user');
          if (storedUser) {
            const userObj = JSON.parse(storedUser);
            if (!userObj.trialStart) {
              userObj.trialStart = new Date().toISOString();
              localStorage.setItem('snapgain_user', JSON.stringify(userObj));
            }
            setUser(userObj);
          }
        }
      } catch (error) {
        console.error("Failed to load session", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
          localStorage.setItem('snapgain_user', JSON.stringify(userData));
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('snapgain_user');
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (email && password && email.includes('@') && password.length >= 6) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Supabase login error:', error);
          throw error;
        }
        
        if (data.user) {
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
          localStorage.setItem('snapgain_user', JSON.stringify(userData));
          setUser(userData);
          toast({ title: "Login Successful!", description: "Welcome back to SnapGain." });
        }
        
        return data;
      } else {
        throw new Error('Please provide valid email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({ 
        title: "Login Error", 
        description: error.message || "Invalid email or password", 
        variant: "destructive" 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, captchaToken) => {
    setLoading(true);
    try {
      if (name && email && password && email.includes('@') && validatePassword(password)) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            captchaToken,
            data: {
              name: name
            }
          },
        });

        if (error) {
          console.error('Supabase signup error:', error);
          toast({ 
            title: "Signup Failed", 
            description: error.message || "Failed to create account", 
            variant: "destructive" 
          });
          return false;
        }

        if (data.user) {
          const trialStart = new Date().toISOString();
          const userData = { 
            id: data.user.id,
            name, 
            email, 
            isRegistered: false, 
            trialStart,
            subscription: 'trial',
            supabaseUser: data.user
          };
          localStorage.setItem('snapgain_user', JSON.stringify(userData));
          setUser(userData);
          toast({ 
            title: "Account Created!", 
            description: "Please check your email to verify your account." 
          });
          return true;
        }
      } else {
        toast({ 
          title: "Signup Failed", 
          description: "Please fill all fields correctly and ensure password meets requirements.", 
          variant: "destructive" 
        });
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({ 
        title: "Signup Error", 
        description: "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const completeRegistration = (formData) => {
    setLoading(true);
    const updatedUser = { ...user, ...formData, isRegistered: true };
    localStorage.setItem('snapgain_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast({ title: "Registration Complete!", description: "You're all set to use SnapGain." });
    setLoading(false);
  };

  const signInWithProvider = async (provider) => {
    setLoading(true);
    try {
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
      await supabase.auth.signOut();
      localStorage.removeItem('snapgain_user');
      setUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('snapgain_user');
      setUser(null);
    }
  };

  const updateSubscription = (subscriptionType) => {
    if (user) {
      const updatedUser = { ...user, subscription: subscriptionType };
      localStorage.setItem('snapgain_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Verifica se trial expirou
  const isTrialExpired = user && user.trialStart && ((new Date() - new Date(user.trialStart)) > 3 * 24 * 60 * 60 * 1000);

  const value = {
    user,
    loading,
    login,
    signup,
    signInWithProvider,
    completeRegistration,
    logout,
    updateSubscription,
    isTrialExpired
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