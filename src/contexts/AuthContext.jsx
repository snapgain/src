
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

  const login = (email, password) => {
    setLoading(true);
    // Mock login
    if (email === "user@snapgain.com" && password === "password123") {
      const trialStart = new Date().toISOString();
      const userData = { email, name: 'Demo User', isRegistered: true, trialStart };
      localStorage.setItem('snapgain_user', JSON.stringify(userData));
      setUser(userData);
      toast({ title: "Login Successful!", description: "Welcome back to SnapGain." });
      setLoading(false);
      return true;
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
      setLoading(false);
      return false;
    }
  };

  const signup = (name, email, password) => {
    setLoading(true);
    const trialStart = new Date().toISOString();
    const userData = { name, email, isRegistered: false, trialStart };
    localStorage.setItem('snapgain_user', JSON.stringify(userData));
    setUser(userData);
    toast({ title: "Account Created!", description: "Let's get you set up." });
    setLoading(false);
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

  // Verifica se trial expirou
  const isTrialExpired = user && user.trialStart && ((new Date() - new Date(user.trialStart)) > 3 * 24 * 60 * 60 * 1000);

  const value = {
    user,
    loading,
    login,
    signup,
    completeRegistration,
    logout,
    isTrialExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
