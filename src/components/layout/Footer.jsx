import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  // Função para scroll to top quando clicar nos links
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FEE4F9] border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">SnapGain</span>
            </div>
            <p className="text-muted-foreground text-sm">
              UK's smartest cashback comparison. Real-time rates from UK stores and programs.
            </p>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Company</h3>
            <div className="space-y-2">
              <Link to="snapgain.uk/features" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                Features
              </Link>
              <Link to="snapgain.uk/pricing" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                Pricing
              </Link>
              <Link to="snapgain.uk/about" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                About Us
              </Link>
            </div>
          </div>

          
          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <div className="space-y-2">
              <Link to="snapgain.uk/privacy" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                Privacy Policy
              </Link>
              <Link to="snapgain.uk/terms" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                Terms of Service
              </Link>
              <Link to="snapgain.uk/disclaimer" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Support</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                
              <Link to="snapgain.uk/faq" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                FAQ
              </Link>
              <Link to="snapgain.uk/contact" onClick={scrollToTop} className="block text-sm text-muted-foreground hover:text-[#7D4DFB] transition-colors">
                Contact Us
              </Link>
              SnapGain uses affiliate links and public data sources. Not an official partner of any platform.
              </p>
              <a 
                href="mailto:support@snapgain.uk" 
                className="block text-sm text-[#7D4DFB] hover:text-purple-800 transition-colors"
              >
                support@snapgain.uk
              </a>
            </div>
          </div>

        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 SnapGain. All rights reserved. Made with ❤️ in the UK.
          </p>
        </div>
      </div>
    </footer>
  );
}