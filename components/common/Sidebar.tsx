import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { articlesAPI } from '@/utils/api';
import { slugify } from "@/utils/slugify";
import WeatherWidget from "@/components/WeatherWidget";

interface Article {
  id: number;
  title: string;
  content: string;
  feature_img?: string;
  author?: string;
  tags?: string;
  created_at?: string;
  category_id?: number;
  category?: {
    uuid: number;
    category: string;
  };
  slug?: string;
  excerpt?: string;
}

interface SidebarProps {
  showWeatherWidget?: boolean;
  showTourCategories?: boolean;
  showTravelGuides?: boolean;
  selectedTourTypes?: string[];
  setSelectedTourTypes?: (types: string[]) => void;
  width?: 'lg:w-1/4' | 'lg:w-1/3';
  tourTypesList?: string[];
  isLoadingTourTypes?: boolean;
}

const createExcerpt = (content: string, maxLength: number = 100): string => {
  const textOnly = content.replace(/<\/?[^>]+(>|$)/g, "");
  return textOnly.length > maxLength
    ? textOnly.substring(0, maxLength) + "..."
    : textOnly;
};

// Default tour types if none are provided
const defaultTourTypes = [
  "Walking Tours",
  "Day Trips",
  "Cultural Tours",
  "Food & Drink",
  "Outdoor Activities",
  "City Tours",
  "Historical Tours",
  "Wine Tours"
];

const Sidebar: React.FC<SidebarProps> = ({ 
  showWeatherWidget = true, 
  showTourCategories = true, 
  showTravelGuides = true,
  selectedTourTypes = [],
  setSelectedTourTypes = () => {},
  width = 'lg:w-1/4',
  tourTypesList,
  isLoadingTourTypes = false
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    if (showTravelGuides) {
      const fetchArticles = async () => {
        try {
          setLoadingArticles(true);

          const response = await articlesAPI.getArticles({ limit: 4 });
          
          if (response && typeof response === 'object' && 'articles' in response) {
            const articlesData = response.articles as Article[];
            
            if (articlesData && articlesData.length > 0) {
              const processedArticles = articlesData.map((article) => ({
                ...article,
                slug: article.slug || (article.category?.category
                  ? `${slugify(article.category.category)}/${slugify(article.title)}`
                  : slugify(article.title)),
                excerpt: article.excerpt || createExcerpt(article.content || '', 120)
              }));
              
              setArticles(processedArticles);
            }
          } else {
            console.error('Invalid response format from API');
          }
        } catch (error) {
          console.error('Error fetching articles:', error);
        } finally {
          setLoadingArticles(false);
        }
      };

      fetchArticles();
    }
  }, [showTravelGuides]);

  // Add console log to see what's being passed to the component
  React.useEffect(() => {
    console.log("Sidebar props:", { 
      showTourCategories, 
      tourTypesList, 
      isLoadingTourTypes,
      defaultTourTypes
    });
  }, [showTourCategories, tourTypesList, isLoadingTourTypes]);

  return (
    <div className={`${width} space-y-8`}>
      {showWeatherWidget && <WeatherWidget />}

      {showTourCategories && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tour Categories</CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto pr-2">
            {isLoadingTourTypes ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ea384c]"></div>
              </div>
            ) : tourTypesList && tourTypesList.length > 0 ? (
              <ul className="space-y-2">
                {tourTypesList.map((type) => (
                  <li key={type} className="flex items-center">
                    <button
                      className="text-gray-700 hover:text-[#ea384c] text-left w-full flex items-center"
                      onClick={() => {
                        if (selectedTourTypes.includes(type)) {
                          setSelectedTourTypes(selectedTourTypes.filter(t => t !== type));
                        } else {
                          setSelectedTourTypes([...selectedTourTypes, type]);
                        }
                      }}
                    >
                      <span className={`mr-2 ${selectedTourTypes.includes(type) ? 'text-[#ea384c]' : 'text-gray-700'}`}>
                        {selectedTourTypes.includes(type) ? '✓' : ''}
                      </span>
                      {type}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {defaultTourTypes.map((type) => (
                  <li key={type} className="flex items-center">
                    <button
                      className="text-gray-700 hover:text-[#ea384c] text-left w-full flex items-center"
                      onClick={() => {
                        if (selectedTourTypes.includes(type)) {
                          setSelectedTourTypes(selectedTourTypes.filter(t => t !== type));
                        } else {
                          setSelectedTourTypes([...selectedTourTypes, type]);
                        }
                      }}
                    >
                      <span className={`mr-2 ${selectedTourTypes.includes(type) ? 'text-[#ea384c]' : 'text-gray-700'}`}>
                        {selectedTourTypes.includes(type) ? '✓' : ''}
                      </span>
                      {type}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {showTravelGuides && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Travel Guides</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingArticles ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ea384c]"></div>
              </div>
            ) : articles.length > 0 ? (
              <ul className="space-y-4">
                {articles.map((article) => (
                  <li key={article.id} className="border-b border-gray-100 pb-2 last:border-0">
                    <Link
                      href={`/travel-guides/${article.slug}`}
                      className="text-[#888888] hover:text-[#ea384c] block"
                    >
                      {article.title}
                    </Link>
                    {article.excerpt && (
                      <p className="text-sm text-gray-500">{article.excerpt}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                    Best Time to Visit Slovenia: Seasonal Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                    Top 10 Must-See Attractions in Slovenia
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                    Transportation Guide: Getting Around Slovenia
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                    Slovenia&apos;s Hidden Gems: Off the Beaten Path
                  </Link>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Sidebar;
