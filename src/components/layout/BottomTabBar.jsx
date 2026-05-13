import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scale, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

const TABS = [
  { to: '/home',     key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/compare',  key: 'nav.compare',   icon: Scale },
  { to: '/profile',  key: 'nav.profile',   icon: User },
  { to: '/settings', key: 'nav.settings',  icon: Settings },
];

/**
 * BottomTabBar — fixed four-tab navigation for mobile, hidden on desktop.
 * Mirrors the desktop header nav so users have a consistent map of the
 * app regardless of screen size. Only rendered when authenticated.
 */
export function BottomTabBar() {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (!user) return null;
  // Hide on auth pages so the user can sign in/out without the tab bar
  if (location.pathname.startsWith('/auth')) return null;

  return (
    <>
      {/* Spacer so fixed bar doesn't cover content on mobile */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/95 backdrop-blur border-t shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
        aria-label="Primary"
      >
        <ul className="grid grid-cols-4">
          {TABS.map(({ to, key, icon: Icon }) => (
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
                    <span>{t(key)}</span>
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
