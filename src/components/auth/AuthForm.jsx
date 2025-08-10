
import React, { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { GoogleAuthButton } from './GoogleAuthButton';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { staggerChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

function AuthForm({ mode }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState();
  const [passwordError, setPasswordError] = useState('');
  const captcha = useRef();
  const isLogin = mode === 'login';

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (!isLogin && newPassword) {
      const error = validatePassword(newPassword);
      setPasswordError(error);
    } else {
      setPasswordError('');
    }
  };

  const resetCaptcha = () => {
    if (captcha.current) {
      captcha.current.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast({ 
        title: "Verification Required", 
        description: "Please complete the captcha before submitting.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!isLogin) {
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        return;
      }
    }
    
    if (isLogin) {
      const success = await login(email, password, captchaToken);
      if (success) {
        navigate('/dashboard');
      } else {
        // Reset captcha se login falhar
        resetCaptcha();
      }
    } else {
      const success = await signup(name, email, password, captchaToken);
      if (success) {
        navigate('/auth/register');
      } else {
        // Reset captcha se signup falhar
        resetCaptcha();
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2 text-center">{isLogin ? "Welcome Back!" : "Create Account"}</h1>
        <p className="text-muted-foreground text-center mb-6">
          {isLogin ? "Sign in to access your dashboard." : "Get started with SnapGain today."}
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </motion.div>
        )}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </motion.div>
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={handlePasswordChange} 
            required 
            className={passwordError ? 'border-red-500' : ''}
          />
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}
          {!isLogin && (
            <div className="text-xs text-muted-foreground mt-2">
              Password must contain:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character (!@#$%^&*)</li>
              </ul>
            </div>
          )}
        </motion.div>
        
        {/* hCaptcha Component */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label>Human Verification</Label>
          <HCaptcha
            ref={captcha}
            sitekey="ES_b1112a2a44c543d8807090a20fc6b7cf"
            onVerify={(token) => {
              setCaptchaToken(token)
            }}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
            theme="light"
            size="normal"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={(!isLogin && passwordError) || !captchaToken}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </motion.div>
        <motion.div variants={itemVariants}>
          <GoogleAuthButton className="mt-2" />
        </motion.div>
      </form>
      
      <motion.p variants={itemVariants} className="text-sm text-center text-muted-foreground mt-6">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => navigate(isLogin ? '/auth/signup' : '/auth/login')} className="font-semibold text-primary hover:underline">
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </motion.p>
    </motion.div>
  );
}

export default AuthForm;
