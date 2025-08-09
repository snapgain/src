import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Star, ExternalLink } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const mockData = [
  {
    retailer: 'Amazon UK',
    topCashback: '2.5%',
    quidco: '2.0%',
    amex: '1.5%',
    baAvios: '1 Avios per £1',
    best: 'TopCashback',
    category: 'Shopping'
  },
  {
    retailer: 'Tesco',
    topCashback: '1.0%',
    quidco: '1.5%',
    amex: '1.0%',
    baAvios: '1 Avios per £1',
    best: 'Quidco',
    category: 'Groceries'
  },
  {
    retailer: 'John Lewis',
    topCashback: '3.0%',
    quidco: '2.5%',
    amex: '2.0%',
    baAvios: '2 Avios per £1',
    best: 'TopCashback',
    category: 'Department Store'
  }
];

function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(mockData);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = mockData.filter(item =>
      item.retailer.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <Helmet>
        <title>Compare Cashback Rates - SnapGain</title>
        <meta name="description" content="Compare real-time cashback rates across all major UK platforms and find the best deals." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compare Cashback Rates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time comparison of cashback rates across all major UK platforms
            </p>
          </motion.div>

          <motion.div className="mb-8" variants={itemVariants}>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search retailers or categories..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            {filteredData.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-lg">{item.retailer}</h3>
                      <Badge variant="outline" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">TopCashback</p>
                      <p className={`font-semibold ${item.best === 'TopCashback' ? 'text-green-600' : ''}`}>
                        {item.topCashback}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Quidco</p>
                      <p className={`font-semibold ${item.best === 'Quidco' ? 'text-green-600' : ''}`}>
                        {item.quidco}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Amex</p>
                      <p className={`font-semibold ${item.best === 'Amex' ? 'text-green-600' : ''}`}>
                        {item.amex}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">BA Avios</p>
                      <p className={`font-semibold ${item.best === 'BA Avios' ? 'text-green-600' : ''}`}>
                        {item.baAvios}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <Badge className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {item.best}
                      </Badge>
                      <Button size="sm" className="mt-2 w-full">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Go to Site
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {filteredData.length === 0 && (
            <motion.div className="text-center py-12" variants={itemVariants}>
              <p className="text-muted-foreground">No retailers found matching your search.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default ComparePage;