
import React from 'react';
import { motion } from 'framer-motion';
import { features } from '@/data/appData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Features() {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
        className="text-center mb-12"
      >
        <motion.h2 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          className="text-4xl font-bold tracking-tight mb-4"
        >
          Why Choose SnapGain?
        </motion.h2>
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Stop guessing. Start saving. Maximize your rewards with our intelligent comparison platform.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card className="text-left h-full card-hover">
                <CardHeader>
                    <div className="text-primary mb-4">{React.cloneElement(feature.icon, { className: 'w-10 h-10' })}</div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
