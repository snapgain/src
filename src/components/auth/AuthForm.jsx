
import React, { useState } from 'react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

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
  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } else {
      const success = await signup(name, email, password);
      if (success) {
        navigate('/auth/register');
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
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
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
