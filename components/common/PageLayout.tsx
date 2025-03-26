import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: ReactNode;
  showWeatherWidget?: boolean;
  showTourCategories?: boolean;
  showTravelGuides?: boolean;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showWeatherWidget = true,
  showTourCategories = false,
  showTravelGuides = true,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${className}`}>
      <div className="lg:col-span-3">
        {children}
      </div>
      
      <div className="lg:col-span-1">
        <Sidebar 
          showWeatherWidget={showWeatherWidget}
          showTourCategories={showTourCategories}
          showTravelGuides={showTravelGuides}
        />
      </div>
    </div>
  );
};

export default PageLayout;
