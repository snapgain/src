import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { RouteErrorBoundary } from '@/components/ErrorBoundary';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ScrollToTopOnNav } from '@/components/ScrollToTopOnNav';

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
      <BottomTabBar />
    </div>
  );
}
