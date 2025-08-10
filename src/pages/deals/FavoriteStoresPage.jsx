import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
// ... outros imports permanecem iguais

function FavoriteStoresPage() {
  // ... todo o estado e funções permanecem iguais

  return (
    <DashboardLayout
      title="❤️ Your Favorite Stores"
      subtitle="Personalized deals from stores you love most"
      icon={{
        element: <Heart className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-red-500 to-pink-500"
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

export default FavoriteStoresPage;