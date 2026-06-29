import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page not found — SnapGain</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-light-pink/40 via-background to-light-green/30">
        <div className="container mx-auto px-4 py-20 text-center max-w-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Compass className="w-8 h-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
          <p className="text-lg text-muted-foreground mb-2">
            We couldn't find the page you were looking for.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            The link might be stale, or the page may have moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/')} size="lg">
              Back to home
            </Button>
            <Button onClick={() => navigate('/compare')} variant="outline" size="lg">
              Compare a purchase
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFoundPage;
