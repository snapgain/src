import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const DashboardLayout = ({
  children,
  title,
  subtitle,
  icon,
  showBackButton = true,
  withHeader = true,
  withFooter = true,
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Site Header (área de membros) */}
      {withHeader && <Header />}

      {/* Conteúdo principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Page header (título/ícone/back) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* Botão voltar */}
              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 w-full sm:w-auto"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sm:inline">Back to Dashboard</span>
                </Button>
              )}

              {/* Título + ícone */}
              <div className="flex items-start sm:items-center space-x-3 w-full sm:w-auto">
                {icon && (
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 ${icon.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    {React.cloneElement(icon.element, {
                      className: 'h-6 w-6 sm:h-8 sm:w-8 text-white',
                    })}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1 break-words">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo da página */}
          <div className="w-full overflow-x-hidden">{children}</div>
        </div>
      </main>

      {/* Site Footer (área de membros) */}
      {withFooter && <Footer />}
    </div>
  );
};

export default DashboardLayout;
