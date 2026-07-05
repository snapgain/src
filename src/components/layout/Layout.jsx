import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RouteErrorBoundary } from '@/components/ErrorBoundary';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ScrollToTopOnNav } from '@/components/ScrollToTopOnNav';

// 2026-07-05 (Bárbara): removed <BottomTabBar />. Mobile nav now lives
// in the sticky header alongside the logo and account chip, so the
// fixed bottom bar is redundant. Kept the BottomTabBar file in place
// (not imported) in case we want to bring it back for a native-app
// wrapper down the line.

export function Layout() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ScrollToTopOnNav />
      <Header />
      <main className="flex-grow">
        {/* Reset boundary on navigation so a fixed page recovers */}
        <RouteErrorBoundary key={location.pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
