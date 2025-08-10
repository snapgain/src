import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DashboardLayout = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER PADRÃO */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            )}
            <div className="flex items-center space-x-3">
              {icon && (
                <div className={`w-16 h-16 ${icon.bgColor} rounded-full flex items-center justify-center`}>
                  {icon.element}
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-muted-foreground text-lg">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* CONTEÚDO */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;