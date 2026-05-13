import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { features } from '@/data/appData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function FeaturesPage() {
  return (
    <>
      <Helmet>
        <title>Features — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything You Need to{' '}
            <span className="gradient-text">Maximize Rewards</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            SnapGain is packed with powerful features designed to make saving
            money and earning rewards effortless and effective.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-left h-full card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center mb-4 shadow-sm">
                    {React.cloneElement(feature.icon, { className: 'w-6 h-6' })}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-14 bg-gradient-to-br from-light-pink/30 to-light-green/30 border-primary/30">
          <CardContent className="py-8 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to <span className="gradient-text">stack smarter</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Sign up for free and start running real comparisons in under two
              minutes.
            </p>
            <Button asChild size="lg">
              <Link to="/auth/signup">
                Get started for free <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default FeaturesPage;