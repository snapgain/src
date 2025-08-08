import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  // Função para scroll to top quando clicar nos links
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    
    <footer className="bg-[#FEE4F9] py-12 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
            <div>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-2xl text-white font-bold">S</div>
                    <span className="text-xl font-bold">SnapGain UK</span>
                </div>
                <p className="text-muted-foreground text-sm">UK's smartest cashback comparison.
                  Real-time rates from UK stores and programs.</p>
            </div>
            <div className="grid grid-cols-4 md:col-span-4 gap-4">
                 <div>
                    <p className="font-semibold mb-3">Company</p>
                    <nav className="flex flex-col space-y-2">
                        <Link to="/features" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Features</Link>
                        <Link to="/pricing" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Pricing</Link>
                        <Link to="/about" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">About Us</Link>
                       
                    </nav>
                </div>
                 <div>
                    <p className="font-semibold mb-3">Legal</p>
                    <nav className="flex flex-col space-y-2">
                        <Link to="/privacy-policy" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
                        <Link to="/terms-of-service" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                        <Link to="/disclaimer" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Disclaimer</Link>
                        <Link to="/real-time-policy" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Real-Time Policy</Link>
                    </nav>
                </div>
                <div>
                    <p className="font-semibold mb-3">Support</p>
                    <nav className="flex flex-col space-y-2">
                        <Link to="/faq" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">FAQ</Link>
                        <Link to="/contact" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link>
                        <Link to="/feedback" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary">Feedback</Link>
                    </nav>
                </div>
            </div>
        </div>
        
        <div className="text-center text-muted-foreground text-sm mt-8 border-t pt-6">
          <p>© {new Date().getFullYear()} SnapGain UK. All rights reserved. Made with ❤️ in the UK.</p>
        </div>
      </div>
    </footer>
  );
}