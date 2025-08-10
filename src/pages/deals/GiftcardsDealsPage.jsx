import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
// ... outros imports permanecem iguais

function GiftcardsDealsPage() {
  // ... todo o estado e funções permanecem iguais

  return (
    <DashboardLayout
      title="🎁 Gift Card Deals"
      subtitle="Maximum cashback on gift cards for yourself or loved ones"
      icon={{
        element: <Gift className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-purple-500 to-pink-500"
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* ... todo o conteúdo permanece igual, apenas remove o header manual */}
      </motion.div>
    </DashboardLayout>
  );
}

export default GiftcardsDealsPage;