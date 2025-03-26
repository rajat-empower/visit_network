import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import styles from './TravelGuides.module.css';
import Sidebar from "@/components/common/Sidebar";
import PageLayout from "@/components/common/PageLayout";
import { articlesAPI } from '@/utils/api';

interface Category {
  uuid: number;
  category: string;
  created_at?: string;
}

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
  // Derived properties
  slug?: string;
  excerpt?: string;
  image?: string;
  uniqueIndex?: number;
}

// Function to create excerpt from content
const createExcerpt = (content: string, maxLength: number = 100): string => {
  // Remove HTML tags
  const textOnly = content.replace(/<\/?[^>]+(>|$)/g, "");
  // Trim to maxLength
  return textOnly.length > maxLength 
    ? textOnly.substring(0, maxLength) + "..." 
    : textOnly;
};

const TravelGuides = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to create a slug from a title
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use the API utility instead of direct Supabase calls
        const response = await articlesAPI.getArticles();
        
        if (response && typeof response === 'object') {
          // Extract categories from the response if available
          if ('categories' in response && Array.isArray(response.categories)) {
            setCategories(response.categories as Category[]);
          }
          
          // Process articles if available
          if ('articles' in response && Array.isArray(response.articles)) {
            const articlesData = response.articles as any[];
            
            // Process articles to add derived properties
            const processedArticles = articlesData.map((article, index) => ({
              ...article,
              slug: article.slug || (article.category?.category 
                ? `${createSlug(article.category.category)}/${createSlug(article.title)}`
                : createSlug(article.title)),
              excerpt: article.excerpt || createExcerpt(article.content, 120),
              image: article.feature_img || '/images/guides/hidden-gems-slovenia.jpg', // Fallback image
              // Add a unique index to ensure unique keys even if category is undefined
              uniqueIndex: index
            }));
            
            setArticles(processedArticles);
          }
        } else {
          console.error('Invalid response format from API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
       <div className={styles['blog-banner']} style={{ backgroundImage: `url('/images/theme/bled-castle.jpg')` }}>
        <PageTitle title="Slovenia Travel Tips" description="Discover the enchanting beauty of Slovenia with our expert Slovenia travel tips. From picturesque lakes and stunning alpine scenery to vibrant cities and rich cultural experiences, our blog provides essential advice and insights to make your journey unforgettable. Explore hidden gems, plan your perfect itinerary, and immerse yourself in all that Slovenia has to offer. Happy travels!" />
        <h1>Slovenia Travel Guides</h1>
        <h3>Expert Guides from Our Travel Team</h3>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Slovenia Travel Tips</h1>
        <p className="text-lg text-gray-700 mb-8">
          Discover the enchanting beauty of Slovenia with our expert Slovenia travel tips. From picturesque lakes and stunning alpine scenery to vibrant cities and rich cultural experiences, our blog provides essential advice and insights to make your journey unforgettable. Explore hidden gems, plan your perfect itinerary, and immerse yourself in all that Slovenia has to offer. Happy travels!
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category, index) => (
            <Link
              key={`category-${category.uuid || index}`}
              href="#"
              className="bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
            >
              {category.category}
            </Link>
          ))}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <Card key={`article-card-${article.id || index}`} className="overflow-hidden group shadow-sm">
                  <div className="overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1" 
                    />
                  </div>
                  <CardContent>
                    <CardTitle className="text-lg font-bold text-red-500 mt-3">
                      {article.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-5">{article.excerpt}</p>
                    <div className="mt-4 pt-4">
                      <Link
                        href={`/travel-guides/${article.slug}`}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <Sidebar 
            showWeatherWidget={true}
            showTourCategories={false}
            showTravelGuides={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TravelGuides;
