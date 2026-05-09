import React from 'react';
import { Helmet } from 'react-helmet';
import { features } from '@/data/appData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

function FeaturesPage() {
  return (
    <>
      <Helmet>
        <title>Features - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to <span className="gradient-text">Maximize Rewards</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            SnapGain is packed with powerful features designed to make saving money and earning rewards effortless and effective.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-left h-full card-hover bg-white">
              <CardHeader>
                <div className="text-primary mb-4">{React.cloneElement(feature.icon, { className: 'w-10 h-10' })}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default FeaturesPage;