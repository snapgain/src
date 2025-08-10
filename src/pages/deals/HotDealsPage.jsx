import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Search, 
  ExternalLink, 
  Star, 
  TrendingUp,
  Clock,
  Target,
  SortAsc,
  SortDesc,
  Filter,
  RefreshCw
} from 'lucide-react';

function HotDealsPage() {
  const navigate = useNavigate();
  const { favoriteStores, cards } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cashback');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock data - deals mais quentes
  const hotDeals = [
    {
      id: 1,
      store: 'Amazon',
      title: 'Prime Day Special - Electronics',
      description: 'Massive cashback on electronics, laptops, phones and gadgets',
      cashbackRate: 8.5,
      maxCashback: 100,
      originalRate: 5.0,
      increase: 3.5,
      category: 'Electronics',
      validUntil: '2025-08-15',
      featured: true,
      trending: true,
      logo: '🛒',
      color: 'from-orange-500 to-orange-600',
      recommendedCard: 'American Express Gold',
      isFavorite: favoriteStores.includes('Amazon'),
      terms: 'Prime members only. Excludes gift cards.',
      rating: 4.9,
      totalSavings: '£2.4M',
      usersUsed: 15420,
      timeLeft: '2 days',
      dealType: 'limited_time'
    },
    // ... resto dos deals (use os mesmos dados do código original)
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // ... resto das funções permanecem iguais

  return (
    <DashboardLayout
      title="🔥 Hot Deals"
      subtitle="The hottest cashback deals available right now"
      icon={{
        element: <Flame className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-orange-500 to-red-500"
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

export default HotDealsPage;