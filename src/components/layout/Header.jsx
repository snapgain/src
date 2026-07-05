import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LogIn,
  UserPlus,
  LayoutDashboard,
  Settings,
  LogOut,
  Scale,
  User as UserIcon,
  Bookmark,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NotificationBell } from '@/components/NotificationBell';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

const AUTHED_NAV = [
  { to: '/home', key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/compare', key: 'nav.compare', icon: Scale },
  { to: '/profile', key: 'nav.profile', icon: UserIcon },
  { to: '/settings', key: 'nav.settings', icon: Settings },
];

// Marketing nav (visitors only) — anchors to landing-page sections.
// When user is on /, clicking scrolls smoothly; when on any other page,
// it navigates to / with the hash so the browser handles the scroll.
const MARKETING_NAV = [
  { hash: 'how-it-works', label: 'How it works' },
  { hash: 'travel', label: 'Travel' },
  { hash: 'faq', label: 'FAQ' },
  { hash: 'pricing', label: 'Pricing' },
];

function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
}

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayName =
    user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const isAdmin = user?.user_metadata?.role === 'admin';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleMarketingNav = (hash) => {
    if (window.location.pathname === '/') {
      // Already on landing — update URL (so back button + bookmarks work)
      // then smooth-scroll to the section. pushState avoids triggering a
      // React Router navigation, which would re-fire ScrollToTopOnNav.
      const el = document.getElementById(hash);
      if (el) {
        window.history.pushState(null, '', `/#${hash}`);
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Different page — route through React Router so ScrollToTopOnNav
      // picks up the hash on landing-mount and scrolls properly. Using
      // window.location.href here doesn't always work because the SPA
      // mounts the new route before the hash anchor is in the DOM.
      navigate(`/#${hash}`);
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Grid layout.
            - Mobile: [logo | nav | right] with nav taking the flexible
              middle so all 4 tab icons fit at 375px. Nav is icon-only
              on phones (labels reappear from md:), which lets the
              header replace the BottomTabBar entirely (Bárbara
              2026-07-05).
            - Desktop (md+): symmetric grid-cols-3 as before, so the
              text nav sits at the true visual centre. */}
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-2 md:gap-4">
          {/* Logo (left column, content aligned start) */}
          <Link to={user ? '/home' : '/'} className="justify-self-start">
            <img
              src="/snapgain-logo.png"
              alt="SnapGain"
              className="h-8 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Center nav — icon-only on mobile, icon+label from md+ */}
          <nav className="flex items-center justify-center gap-0.5 md:gap-1">
            {user
              ? AUTHED_NAV.map(({ to, key, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    aria-label={t(key)}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors',
                        // Compact icon-only tap target on mobile,
                        // pill with label from md upward.
                        'p-2 md:px-4 md:py-2',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                      )
                    }
                  >
                    <Icon className="w-5 h-5 md:w-4 md:h-4" />
                    <span className="hidden md:inline">{t(key)}</span>
                  </NavLink>
                ))
              : MARKETING_NAV.map(({ hash, label }) => (
                  <button
                    key={hash}
                    type="button"
                    onClick={() => handleMarketingNav(hash)}
                    className="px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {label}
                  </button>
                ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0 justify-self-end">
            {user ? (
              <>
                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 hover:bg-muted/60 rounded-full pl-1 pr-3 py-1 transition-colors"
                      aria-label="Account menu"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gradient-to-br from-accent to-light-green text-accent-foreground font-bold">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                        {displayName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52" align="end">
                    <DropdownMenuItem onClick={() => navigate('/saved-strategies')}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>{t('nav.savedStrategies')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/apps')}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Partner Apps</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin/hot-deals')}>
                          <Zap className="mr-2 h-4 w-4" />
                          <span>{t('nav.manageHotDeals')}</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('nav.logOut')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:inline-flex text-muted-foreground"
                >
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('nav.signIn')}
                </Button>
                <Button
                  onClick={() => navigate('/auth/signup')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('nav.signUp')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
