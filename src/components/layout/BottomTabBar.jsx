import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Plane, PiggyBank, Zap, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';

const TABS = [
  { to: '/home',      label: 'Home',     icon: Home },
  { to: '/miles',     label: 'Miles',    icon: Plane },
  { to: '/cashback',  label: 'Cashback', icon: PiggyBank },
  { to: '/hot-deals', label: 'Hot',      icon: Zap },
  { to: '/menu',      label: 'Menu',     icon: MenuIcon },
];

/**
 * BottomTabBar — fixed five-tab navigation for mobile, hidden on desktop.
 * Only rendered when the user is authenticated; the marketing pages use
 * the regular Header on mobile too.
 */
export function BottomTabBar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;
  // Hide on auth pages so the user can sign in/out without the tab bar
  if (location.pathname.startsWith('/auth')) return null;

  return (
    <>
      {/* Spacer so fixed bar doesn't cover content on mobile */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
        aria-label="Primary"
      >
        <ul className="grid grid-cols-5">
          {TABS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center py-2.5 gap-0.5 text-[11px] font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        isActive ? 'text-primary' : ''
                      )}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default BottomTabBar;
