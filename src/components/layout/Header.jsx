import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  LogIn,
  UserPlus,
  LayoutDashboard,
  Settings,
  LogOut,
  Search,
  Calculator,
  Bookmark,
  Wallet,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from '@/components/NotificationBell';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const isAdmin = user?.user_metadata?.role === 'admin';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-2xl text-white font-bold">
                S
              </div>
              <span className="text-2xl font-bold gradient-text">SnapGain</span>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/home" className="hover:text-primary transition-colors font-medium">Home</Link>
                <Link to="/search" className="hover:text-primary transition-colors font-medium">Search</Link>
                <Link to="/compare" className="hover:text-primary transition-colors font-medium">Compare</Link>
              </>
            ) : (
              <>
                <Link to="/features" className="hover:text-primary transition-colors font-medium">Features</Link>
                <Link to="/pricing" className="hover:text-primary transition-colors font-medium">Pricing</Link>
                <Link to="/about" className="hover:text-primary transition-colors font-medium">About</Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {user && <NotificationBell />}
            {user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gradient-to-br from-accent to-light-green text-accent-foreground font-bold">
                            {getInitials(displayName)}
                        </AvatarFallback>
                     </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/home')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/compare')}>
                    <Calculator className="mr-2 h-4 w-4" />
                    <span>Compare</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/saved-strategies')}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Saved strategies</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wallet')}>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin/hot-deals')}>
                        <Zap className="mr-2 h-4 w-4" />
                        <span>Manage hot deals</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth/signup')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}