import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * RouteErrorBoundary — catches render-time errors inside any route so
 * a broken page never blanks out the whole app. Shows a friendly card
 * with a reset button and a quick way home.
 */
export class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[RouteErrorBoundary]', error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="container mx-auto px-4 py-16 max-w-xl">
        <div className="rounded-2xl border bg-white p-8 text-center space-y-4 shadow-sm">
          <h1 className="text-2xl font-bold">Something went wrong on this page</h1>
          <p className="text-sm text-muted-foreground">
            {this.state.error?.message || 'Unexpected error rendering this view.'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button variant="outline" onClick={this.reset}>
              Try again
            </Button>
            <Button asChild>
              <Link to="/">Go home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default RouteErrorBoundary;
