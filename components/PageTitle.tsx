"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

/**
 * PageTitle component - Sets document title client-side and provides visual elements
 * This works with Next.js App Router by directly manipulating the document title
 */
const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  description,
  className = "" 
}) => {
  const pathname = usePathname();

  // Update document title on client side
  useEffect(() => {
    if (title) {
      // Set the document title directly
      document.title = `${title} | Visit Slovenia`;
      
      // If description is provided, update the meta description
      if (description) {
        // Look for existing description meta tag
        let metaDescription = document.querySelector('meta[name="description"]');
        
        // If it doesn't exist, create it
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        
        // Set the content attribute
        metaDescription.setAttribute('content', description);
      }
    }
    
    // Log for debugging
    console.log(`PageTitle: Setting title to "${title}" on path "${pathname}"`);
    
    // Cleanup function
    return () => {
      console.log(`PageTitle: Cleaning up title "${title}"`);
    };
  }, [title, description, pathname]);

  return (
    <div className={`page-title-container ${className}`}>
      {/* Visual elements for the page title (optional) */}
      <h1 className="sr-only">{title}</h1>
      {description && <p className="sr-only">{description}</p>}
    </div>
  );
};

export default PageTitle;
