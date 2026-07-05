import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function Footer() {
  const { user } = useAuth();
  // Signed-in users clicking the footer logo should land on their
  // dashboard, not the visitor marketing page.
  const homeHref = user ? '/home' : '/';
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8 md:py-10">
        {/* 2026-07-05 (Bárbara): mobile footer was stacking every
            block vertically, which made it ~4 screens tall. Now the
            brand block is a compact row at the top (small logo left,
            tagline right, tagline breaks onto 2 lines), and the
            three link columns sit side-by-side underneath. md:contents
            promotes the three link columns back into the outer grid
            so the desktop 4-col layout is unchanged. */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-4">
          {/* Brand block */}
          <div className="flex items-center gap-4 md:col-span-1 md:block">
            <Link to={homeHref} aria-label="SnapGain home" className="inline-block shrink-0 md:mb-4">
              <img
                src="/snapgain-bigger.png"
                alt="SnapGain"
                className="h-14 md:h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-snug">
              Helping you save and earn more
              <br />
              through smart strategy.
            </p>
          </div>

          {/* Link columns — 3 across on mobile, then md:contents drops
              the wrapper so each column takes its own cell in the
              md:grid-cols-4 parent (unchanged desktop layout). */}
          <div className="grid grid-cols-3 gap-4 md:contents">
            {/* Company */}
            <div>
              <p className="font-semibold mb-3 text-sm md:text-base">Company</p>
              <nav className="flex flex-col space-y-2">
                <Link to="/features" className="text-xs md:text-sm text-muted-foreground hover:text-primary">Features</Link>
                <Link to="/pricing" className="text-xs md:text-sm text-muted-foreground hover:text-primary">Pricing</Link>
                <Link to="/about" className="text-xs md:text-sm text-muted-foreground hover:text-primary">About Us</Link>
              </nav>
            </div>

            {/* Support */}
            <div>
              <p className="font-semibold mb-3 text-sm md:text-base">Support</p>
              <nav className="flex flex-col space-y-2">
                <Link to="/contact" className="text-xs md:text-sm text-muted-foreground hover:text-primary">Contact</Link>
                <a
                  href="mailto:support@snapgain.uk"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary break-all"
                >
                  support@snapgain.uk
                </a>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <p className="font-semibold mb-3 text-sm md:text-base">Legal</p>
              <nav className="flex flex-col space-y-2">
                <Link to="/privacy-policy" className="text-xs md:text-sm text-muted-foreground hover:text-primary">Privacy</Link>
                <Link to="/terms-of-service" className="text-xs md:text-sm text-muted-foreground hover:text-primary">Terms</Link>
                <Link to="/cookie-policy" className="text-xs md:text-sm text-muted-foreground hover:text-primary">Cookies</Link>
                <Link to="/refund-policy" className="text-xs md:text-sm text-muted-foreground hover:text-primary">Refunds</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-xs md:text-sm mt-6 md:mt-10 border-t pt-4 md:pt-6">
          <p>© {new Date().getFullYear()} SnapGain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
