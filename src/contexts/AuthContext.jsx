
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('snapgain_user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        // Verifica trial
        if (!userObj.trialStart) {
          userObj.trialStart = new Date().toISOString();
          localStorage.setItem('snapgain_user', JSON.stringify(userObj));
        }
        setUser(userObj);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
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
      // Mock login - aceita qualquer email/senha válida para demo
      if (email && password && email.includes('@') && password.length >= 6) {
        const trialStart = new Date().toISOString();
        const userData = { 
          email, 
          name: email.split('@')[0], 
          isRegistered: true, 
          trialStart,
          subscription: 'trial' // trial, premium, canceled
        };
        localStorage.setItem('snapgain_user', JSON.stringify(userData));
        setUser(userData);
        toast({ title: "Login Successful!", description: "Welcome back to SnapGain." });
        setLoading(false);
        return true;
      } else {
        toast({ title: "Login Failed", description: "Please enter a valid email and password (6+ characters).", variant: "destructive" });
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({ title: "Login Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      setLoading(false);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      if (name && email && password && email.includes('@') && validatePassword(password)) {
        const trialStart = new Date().toISOString();
        const userData = { 
          name, 
          email, 
          isRegistered: false, 
          trialStart,
          subscription: 'trial'
        };
        localStorage.setItem('snapgain_user', JSON.stringify(userData));
        setUser(userData);
        toast({ title: "Account Created!", description: "Let's get you set up." });
        setLoading(false);
        return true;
      } else {
        toast({ title: "Signup Failed", description: "Please fill all fields correctly and ensure password meets requirements.", variant: "destructive" });
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({ title: "Signup Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      setLoading(false);
      return false;
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

  const logout = () => {
    localStorage.removeItem('snapgain_user');
    setUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
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
