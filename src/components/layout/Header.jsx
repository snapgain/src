import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, BarChart3, User, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useNotifications } from '@/contexts/NotificationContext';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Verificar se está na área de membros
  const isDashboardArea = ['/dashboard', '/compare', '/profile', '/settings'].includes(location.pathname);

  // Função para verificar se link está ativo
  const isActiveLink = (path) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] bg-clip-text text-transparent">
              SnapGain
            </span>
          </Link>

          {/* Navegação Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {user && isDashboardArea ? (
              // 🎯 NAVEGAÇÃO DA ÁREA DE MEMBROS
              <nav className="flex items-center space-x-1">
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActiveLink('/dashboard') 
                      ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white' 
                      : 'hover:text-primary transition-colors'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/compare" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActiveLink('/compare') 
                      ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white' 
                      : 'hover:text-primary transition-colors'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Compare</span>
                </Link>
                
                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActiveLink('/profile') 
                      ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white' 
                      : 'hover:text-primary transition-colors'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                
                <Link 
                  to="/settings" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActiveLink('/settings') 
                      ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white' 
                      : 'hover:text-primary transition-colors'
                  }`}
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </nav>
            ) : (
              // 🌐 NAVEGAÇÃO PÚBLICA
              <nav className="flex items-center space-x-6">
                <Link to="/features" onClick={scrollToTop} className="hover:text-primary transition-colors font-medium">
                  Features
                </Link>
                <Link to="/pricing" onClick={scrollToTop} className="hover:text-primary transition-colors font-medium">
                  Pricing
                </Link>
                <Link to="/about" onClick={scrollToTop} className="hover:text-primary transition-colors font-medium">
                  About Us
                </Link>
              </nav>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Avatar do usuário */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="font-medium text-sm">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="text-sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => { navigate('/login'); scrollToTop(); }}
                  className="font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => { navigate('/signup'); scrollToTop(); }}
                  className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && isDashboardArea ? (
                // Mobile - Área de Membros
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActiveLink('/dashboard')
                        ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/compare"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActiveLink('/compare')
                        ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Compare</span>
                  </Link>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActiveLink('/profile')
                        ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActiveLink('/settings')
                        ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </>
              ) : (
                // Mobile - Navegação Pública
                <>
                  <Link
                    to="/features"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary"
                    onClick={() => { setMobileMenuOpen(false); scrollToTop(); }}
                  >
                    Features
                  </Link>
                  <Link
                    to="/pricing"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary"
                    onClick={() => { setMobileMenuOpen(false); scrollToTop(); }}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/about"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary"
                    onClick={() => { setMobileMenuOpen(false); scrollToTop(); }}
                  >
                    About Us
                  </Link>
                </>
              )}
              
              {/* Botões Mobile */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="font-medium">
                        {user.name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full mx-3"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => { navigate('/auth/login'); setMobileMenuOpen(false); scrollToTop(); }}
                      className="w-full mx-3"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => { navigate('/auth/signup'); setMobileMenuOpen(false); scrollToTop(); }}
                      className="w-full mx-3 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}