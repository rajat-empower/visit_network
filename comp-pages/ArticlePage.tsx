import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { articlesAPI } from '@/utils/api';
import PageTitle from '@/components/PageTitle';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sanitizeHTML } from '@/utils/sanitize';
import Sidebar from "@/components/common/Sidebar";
import { Database } from '@/integrations/supabase/types';

type Article = Database['public']['Tables']['articles']['Row'] & {
  category?: Database['public']['Tables']['article_categories']['Row'];
  excerpt?: string;
  slug?: string;
};

interface LatestArticle {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
}

const createExcerpt = (content: string, length: number) => {
  const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, "");
  return strippedContent.length > length ? strippedContent.substring(0, length) + "..." : strippedContent;
};

// Hardcoded article for fallback
const hardcodedArticle: Article = {
  id: 1,
  title: "Slovenia Visa and Entry Requirements for European Getaway",
  content: `<p>Planning a trip to Slovenia? This comprehensive guide covers everything you need to know about visa requirements, entry regulations, and travel documentation for your European getaway.</p>
  <h2>Schengen Area Membership</h2>
  <p>Slovenia is a member of the Schengen Area, which means that travelers can enter Slovenia with a Schengen visa and travel freely within the Schengen zone without border controls.</p>`,
  feature_img: "https://visitslovenia.b-cdn.net/uploads/guides/slovenia-visa.jpg",
  author: "Travel Slovenia Team",
  tags: "Slovenia, Visa, Travel Requirements, Schengen, Europe, Travel Tips",
  keywords: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category_id: null,
  excerpt: "Planning a trip to Slovenia? This comprehensive guide covers everything you need to know about visa requirements...",
  slug: "travel-tips/slovenia-visa-requirements"
};

const ArticlePage: React.FC = () => {
  const { slug, category, categoryOrslug } = useParams<{ slug: string; category?: string, categoryOrslug?: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestArticles, setLatestArticles] = useState<LatestArticle[]>([]);
  const [loadingLatestArticles, setLoadingLatestArticles] = useState(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoadingLatestArticles(true);

        const response = await articlesAPI.getArticles({ limit: 4 });
        
        if (response && typeof response === 'object' && 'articles' in response) {
          const articles = response.articles as Article[];
          
          if (articles && articles.length > 0) {
            const processedArticles = articles.map((article) => ({
              id: article.id,
              title: article.title,
              excerpt: article.excerpt || createExcerpt(article.content, 80),
              slug: article.slug || createSlug(article.title, article.category?.name)
            }));
            
            setLatestArticles(processedArticles);
          }
        } else {
          console.error('Invalid response format from API');
        }
      } catch (error) {
        console.error('Error fetching latest articles:', error);
      } finally {
        setLoadingLatestArticles(false);
      }
    };

    fetchLatestArticles();
  }, []);

  // Helper function to create a slug from title and category
  const createSlug = (title: string, categoryName?: string): string => {
    const titleSlug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return categoryName 
      ? `${categoryName.toLowerCase().replace(/\s+/g, '-')}/${titleSlug}`
      : titleSlug;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log(`Fetching article with slug: ${slug}, category: ${category || 'none'}`);

        if (!categoryOrslug) {
          console.log("No slug provided, using hardcoded article");
          setArticle(hardcodedArticle);
          setLoading(false);
          return;
        }

        const response = await articlesAPI.getArticleBySlug(categoryOrslug);
        
        if (response && typeof response === 'object' && 'article' in response) {
          const articleData = response.article as Article;
          console.log("Article found:", articleData);
          setArticle(articleData);
          
          if ('relatedArticles' in response && Array.isArray(response.relatedArticles)) {
            const processedRelatedArticles = (response.relatedArticles as Article[]).map((article) => ({
              id: article.id,
              title: article.title,
              excerpt: article.excerpt || createExcerpt(article.content, 80),
              slug: article.slug || createSlug(article.title, article.category?.name)
            }));
            
            setLatestArticles(processedRelatedArticles);
          }
        } else {
          console.log("No article found, using hardcoded article");
          setArticle(hardcodedArticle);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(hardcodedArticle);
      } finally {
        setLoading(false);
      }
    };

    if (slug || category) {
      fetchArticle();
    }
    console.log(categoryOrslug)
    if(categoryOrslug){
      fetchArticle();
    }
  }, [slug, category]);

  if (loading) {
    return (
      <div>
        <PageTitle title="Loading Article" description="Please wait while we load the article" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div>
        <PageTitle title="Article Not Found" description="The requested article could not be found" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="mb-6">We couldn't find the article you're looking for.</p>
            <Link href="/travel-guides" className="text-blue-600 hover:underline">
              Browse all travel guides
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const featuredImage = article.feature_img;

  const tagsList = article.tags
    ? article.tags.split(',').map(tag => tag.trim())
    : [];

  return (
    <div>
      <PageTitle title={article.title} description={article.title} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/travel-guides" className="hover:text-blue-600">Travel Guides</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{article.title}</span>
        </div>

        <h1 style={{
          fontSize: '30px',
          fontWeight: 800,
          margin: '15px 0 20px'
        }}>{article.title}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <article className="article-content">
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt={`Featured image for ${article.title}`}
                  className="w-full h-auto rounded-lg mb-6"
                />
              )}

              {article.author && (
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-500 font-bold">{article.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">By {article.author}</p>
                    {article.created_at && (
                      <p className="text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tagsList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tagsList.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 article-content"
                dangerouslySetInnerHTML={sanitizeHTML(article.content)}
              />

              <div className="mt-8 p-4 border-t border-gray-200">
                <div className="text-sm text-red-600 font-bold">
                  {article.created_at ? (
                    <p>Posted on: {new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  ) : (
                    <p>Posted on: February 28, 2025</p>
                  )}
                  {article.author && (
                    <p>By: {article.author}</p>
                  )}
                </div>
              </div>
            </article>
          </div>

          <Sidebar 
            showWeatherWidget={true}
            showTourCategories={false}
            showTravelGuides={true}
          />
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
