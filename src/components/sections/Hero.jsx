
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero({ user, onSubscribe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
        UK's Smartest
        <span className="block gradient-text">Cashback Comparison 🇬🇧</span>
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Compare TopCashback, JamDoughnut, and Amazon UK in real-time. Find the best GBP cashback rates on every purchase across British retailers.
      </p>
      
      {!user && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            onClick={onSubscribe}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg"
          >
            Start Saving Now - Free Trial
          </Button>
        </motion.div>
      )}
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-4xl mb-2">💰</div>
          <h3 className="font-semibold text-lg">TopCashback UK</h3>
          <p className="text-sm text-muted-foreground">Up to 8% cashback</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-2">🍩</div>
          <h3 className="font-semibold text-lg">JamDoughnut</h3>
          <p className="text-sm text-muted-foreground">Student & young professional deals</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-2">🛒</div>
          <h3 className="font-semibold text-lg">Amazon UK</h3>
          <p className="text-sm text-muted-foreground">Prime deals & marketplace</p>
        </div>
      </div>
    </motion.div>
  );
}
