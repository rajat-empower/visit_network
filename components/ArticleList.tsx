"use client"; // Ensures this component only runs on the client side

import { useState, useEffect } from "react";
import Link from "next/link";
import { articlesAPI } from '@/utils/api';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Database } from '@/integrations/supabase/types';
import Image from "next/image";

// Define a base Article type for internal use
type DatabaseArticle = Database['public']['Tables']['articles']['Row'] & {
  category?: Database['public']['Tables']['article_categories']['Row'];
  excerpt?: string;
  slug?: string;
  feature_img?: string;
};

// Define a more flexible Article type that can also match the SearchResults.tsx Article interface
export interface Article {
  id: string;
  title: string;
  content: string;
  feature_img?: string;
  author?: string;
  tags?: string;
  created_at?: string;
  category?: any;
  slug?: string;
  excerpt?: string;
}

// Helper function to create URL-friendly slugs
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Function to create excerpt from content
const createExcerpt = (content: string, maxLength: number = 120): string => {
  const textOnly = content.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
  return textOnly.length > maxLength
    ? textOnly.substring(0, maxLength) + "..."
    : textOnly;
};

// Cache for articles to avoid unnecessary API calls
let articlesCache: {
  data: DatabaseArticle[];
  timestamp: number;
} | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface ArticleListProps {
  article?: Article;
  className?: string;
}

const ArticleList = ({ article, className = "" }: ArticleListProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset the image error state when a new article is received
    setImageError(false);
    
    // If an article is passed as prop, don't fetch articles
    if (article) {
      setArticles([article]);
      setLoadingArticles(false);
      return;
    }

    const fetchArticles = async () => {
      try {
        // Check if we have cached articles that are still valid
        if (articlesCache && (Date.now() - articlesCache.timestamp) < CACHE_TTL) {
          console.log('Using cached articles');
          setArticles(articlesCache.data as unknown as Article[]);
          setLoadingArticles(false);
          return;
        }

        setLoadingArticles(true);
        console.log('Fetching articles from API');
        
        // Use the API utility instead of direct Supabase calls
        const response = await articlesAPI.getArticles({ limit: 4 });
        
        if (response && typeof response === 'object' && 'articles' in response) {
          const articlesData = response.articles as unknown as Article[];
          
          if (articlesData && articlesData.length > 0) {
            // Update the cache
            articlesCache = {
              data: articlesData as unknown as DatabaseArticle[],
              timestamp: Date.now()
            };
            
            setArticles(articlesData);
          }
        } else {
          console.error('Invalid response format from API');
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [article]);

  // Render the fallback image if there's no image or if there was an error loading the image
  const renderImage = (article: Article) => {
    if (!article.feature_img || imageError) {
      return (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No image available</span>
        </div>
      );
    }
    
    return (
      <div className="relative w-full h-48 overflow-hidden">
        <Image 
          src={article.feature_img} 
          alt={article.title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  return (
    <div className={`article-list w-full ${className}`}>
      {loadingArticles ? (
        <div className="loading flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ea384c]"></div>
        </div>
      ) : articles.length > 0 ? (
        <Card className="article-item h-full overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
          {renderImage(articles[0])}
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2">
              <Link href={`/travel-guides/${articles[0].slug || createSlug(articles[0].title)}`} className="text-[#ea384c] hover:underline">
                {articles[0].title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            {articles[0].excerpt ? (
              <p className="article-excerpt text-gray-600 text-sm md:text-base line-clamp-3">{articles[0].excerpt}</p>
            ) : articles[0].content ? (
              <p className="article-excerpt text-gray-600 text-sm md:text-base line-clamp-3">{createExcerpt(articles[0].content)}</p>
            ) : (
              <p className="article-excerpt text-gray-600 text-sm md:text-base">Read more about this article...</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="fallback-articles text-gray-500 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2">No articles found. Here are some suggestions:</p>
          <ul className="list-disc ml-4 space-y-1 text-sm">
            <li>Best Time to Visit Slovenia: Seasonal Guide</li>
            <li>Top 10 Must-See Attractions in Slovenia</li>
            <li>Transportation Guide: Getting Around Slovenia</li>
            <li>Slovenia&apos;s Hidden Gems: Off the Beaten Path</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
