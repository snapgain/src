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
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="md:col-span-1">
            <Link to={homeHref} aria-label="SnapGain home" className="inline-block mb-4">
              <img
                src="/snapgain-bigger.png"
                alt="SnapGain"
                className="h-20 md:h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm">
              Helping you save and earn more through smart strategy.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="font-semibold mb-3">Company</p>
            <nav className="flex flex-col space-y-2">
              <Link to="/features" className="text-sm text-muted-foreground hover:text-primary">Features</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <p className="font-semibold mb-3">Support</p>
            <nav className="flex flex-col space-y-2">
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
              <a
                href="mailto:support@snapgain.uk"
                className="text-sm text-muted-foreground hover:text-primary break-all"
              >
                support@snapgain.uk
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="font-semibold mb-3">Legal</p>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
              <Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link>
              <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</Link>
            </nav>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-sm mt-10 border-t pt-6">
          <p>© {new Date().getFullYear()} SnapGain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
