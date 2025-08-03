
import React from 'react';
import { Helmet } from 'react-helmet';
import { ComparisonTool } from '@/components/comparison/ComparisonTool';
import { useAuth } from '@/contexts/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Dashboard - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome back, <span className="gradient-text">{user?.name || 'User'}!</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Ready to maximize your rewards? Let's find the best deals.
        </p>

        <ComparisonTool />
      </div>
    </>
  );
}

export default DashboardPage;
