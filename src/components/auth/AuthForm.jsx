
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { PasswordInput, isPasswordValid } from '@/components/auth/PasswordInput';

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
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isLogin = mode === 'login';
  const redirectTo = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate(redirectTo, { replace: true });
        }
      } else {
        // Basic UK phone validation: allow +44 or 0 prefix, 10-11 digits
        const phoneClean = phone.replace(/\s|-/g, '');
        if (!/^(\+44|0)\d{9,10}$/.test(phoneClean)) {
          toast({
            title: 'Invalid phone',
            description: 'Use a valid UK number (e.g. 07123456789 or +447123456789).',
            variant: 'destructive',
          });
          setSubmitting(false);
          return;
        }
        // Password policy: 8+ chars, upper, lower, special
        if (!isPasswordValid(password)) {
          toast({
            title: 'Password too weak',
            description: 'Your password must meet all 4 requirements shown.',
            variant: 'destructive',
          });
          setSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          toast({
            title: 'Passwords do not match',
            description: 'Re-type both fields so they match exactly.',
            variant: 'destructive',
          });
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, {
          data: { name, phone: phoneClean },
        });
        if (!error) {
          toast({
            title: 'Account created — 7-day trial started',
            description: 'Check your email to confirm, then sign in.',
          });
          navigate('/auth/login', { replace: true });
        }
      }
    } finally {
      setSubmitting(false);
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
        <h1 className="text-3xl font-bold mb-2 text-center">{isLogin ? "Welcome back" : "Start your 7-day trial"}</h1>
        <p className="text-muted-foreground text-center mb-6">
          {isLogin
            ? "Sign in to access your dashboard."
            : "Free 7 days. No card required. Cancel anytime."}
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
        {!isLogin && (
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="phone">UK phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="07123 456 789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md p-2.5">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>
                We use your number only to verify your account and prevent
                abuse. <strong>We will never share it, sell it, or use it
                for marketing.</strong>
              </span>
            </div>
          </motion.div>
        )}
        <motion.div variants={itemVariants}>
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            showValidation={!isLogin}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </motion.div>
        {!isLogin && (
          <motion.div variants={itemVariants}>
            <PasswordInput
              id="confirm-password"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              matchAgainst={password}
              autoComplete="new-password"
            />
          </motion.div>
        )}
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {submitting
              ? (isLogin ? 'Signing in…' : 'Creating account…')
              : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex-1 h-px bg-border" />
        <span>or</span>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <OAuthButtons disabled={submitting} />
      </motion.div>
      
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
