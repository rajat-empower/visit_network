import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

// Define a proper interface for articles with all needed properties
interface ArticleData {
  id: number;
  title: string;
  content: string;
  keywords: string | null;
  feature_img: string | null;
  author: string | null;
  tags: string | null;
  created_at: string | null;
  updated_at: string | null;
  category_id: number | null;
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  } | null;
  excerpt?: string;
}

type Article = ArticleData;

// Hardcoded fallback article
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
  excerpt: "Planning a trip to Slovenia? This comprehensive guide covers everything you need to know about visa requirements..."
};

// Sample articles for testing
const sampleArticles: Article[] = [
  hardcodedArticle,
  {
    id: 2,
    title: "Culture and Heritage: Slovenia Language and Customs - A Guide to Local Etiquette",
    content: `<p>Discover the rich cultural heritage of Slovenia through its language, customs, and local etiquette. This guide will help you navigate social situations with ease during your visit.</p>
    <h2>Slovenian Language Basics</h2>
    <p>While many Slovenians speak English, learning a few basic phrases in Slovenian will be greatly appreciated by locals and enhance your travel experience.</p>`,
    feature_img: "https://visitslovenia.b-cdn.net/uploads/guides/slovenia-culture.jpg",
    author: "Cultural Expert Team",
    tags: "Slovenia, Culture, Language, Customs, Etiquette, Travel Tips",
    keywords: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 2,
    category: {
      id: 2,
      name: "Culture and Heritage",
      slug: "culture-and-heritage",
      description: "Explore the rich cultural heritage of Slovenia"
    },
    excerpt: "Discover the rich cultural heritage of Slovenia through its language, customs, and local etiquette..."
  },
  {
    id: 3,
    title: "Top 10 Must-Visit Destinations in Slovenia",
    content: `<p>Slovenia may be small, but it packs a punch when it comes to stunning destinations. From alpine lakes to charming coastal towns, here are the top 10 places you must visit.</p>
    <h2>1. Lake Bled</h2>
    <p>No visit to Slovenia is complete without seeing the iconic Lake Bled with its island church and clifftop castle.</p>`,
    feature_img: "https://visitslovenia.b-cdn.net/uploads/guides/slovenia-destinations.jpg",
    author: "Travel Slovenia Team",
    tags: "Slovenia, Destinations, Lake Bled, Ljubljana, Piran, Travel Guide",
    keywords: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_id: 1,
    category: {
      id: 1,
      name: "Destinations",
      slug: "destinations",
      description: "Explore the best destinations in Slovenia"
    },
    excerpt: "Slovenia may be small, but it packs a punch when it comes to stunning destinations..."
  }
];

/**
 * Helper function to create a slug from a title
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
}

/**
 * GET /api/articles/[slug]
 * Returns details for a specific article by slug
 */
export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const params = context.params;
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json({ 
        article: hardcodedArticle,
        message: 'No slug provided, using hardcoded article'
      });
    }

    console.log(`Fetching article with slug: ${slug}`);
    
    const cleanSlug = slug.replace(/-+$/, '');
    console.log(`Cleaned slug: ${cleanSlug}`);

    // First try to find articles with a similar title slug
    const { data: articlesData, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:article_categories(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Use fetched articles or fall back to sample articles
    const articles: Article[] = articlesData || sampleArticles;

    if (error) {
      console.error("Error fetching articles:", error);
      
      // Use sample articles for testing if there's an error
      // Try to find a matching article using fuzzy matching
      const matchingArticle = sampleArticles.find(article => {
        const articleTitleSlug = createSlug(article.title);
        return articleTitleSlug.includes(cleanSlug) || cleanSlug.includes(articleTitleSlug);
      });

      if (matchingArticle) {
        console.log("Matching sample article found:", matchingArticle);
        return NextResponse.json({ 
          article: matchingArticle,
          relatedArticles: sampleArticles.filter(a => a.id !== matchingArticle.id).slice(0, 2),
          message: 'Using sample article due to database error'
        });
      }

      return NextResponse.json({ 
        article: hardcodedArticle,
        message: 'Error fetching articles, using hardcoded article'
      });
    }

    if (articles && articles.length > 0) {
      // Try to find a matching article using fuzzy matching
      const matchingArticle = articles.find(article => {
        const articleTitleSlug = createSlug(article.title);
        return articleTitleSlug.includes(cleanSlug) || cleanSlug.includes(articleTitleSlug);
      });

      if (matchingArticle) {
        console.log("Matching article found:", matchingArticle);

        // Create a properly typed article with excerpt
        const processedArticle: Article = {
          ...matchingArticle,
          excerpt: matchingArticle.excerpt || matchingArticle.content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
        };

        // Fetch related articles from the same category
        let relatedArticles: Article[] = [];
        if (processedArticle.category_id) {
          const { data: related, error: relatedError } = await supabase
            .from('articles')
            .select(`
              *,
              category:article_categories(*)
            `)
            .eq('category_id', processedArticle.category_id)
            .neq('id', processedArticle.id)
            .order('created_at', { ascending: false })
            .limit(4);

          if (!relatedError && related) {
            // Use a more explicit type assertion for the related articles
            relatedArticles = related.map(article => {
              const content = article.content || '';
              // Create a new object with all required properties
              const articleWithExcerpt = {
                ...article,
                // Add the excerpt property explicitly
                excerpt: content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
              };
              return articleWithExcerpt as unknown as Article;
            });
          }
        }

        return NextResponse.json({ 
          article: processedArticle,
          relatedArticles
        });
      } else {
        console.log("No matching article found, using first article as fallback");
        const firstArticle = articles[0];
        
        // Create a properly typed article with excerpt
        const processedArticle: Article = {
          ...firstArticle,
          excerpt: firstArticle.excerpt || firstArticle.content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
        };
        
        return NextResponse.json({ 
          article: processedArticle,
          message: 'No exact match found, using first available article'
        });
      }
    }

    // If we reach here, try to find a matching article in our sample data
    const matchingSampleArticle = sampleArticles.find(article => {
      const articleTitleSlug = createSlug(article.title);
      return articleTitleSlug.includes(cleanSlug) || cleanSlug.includes(articleTitleSlug);
    });

    if (matchingSampleArticle) {
      console.log("Matching sample article found:", matchingSampleArticle);
      return NextResponse.json({ 
        article: matchingSampleArticle,
        relatedArticles: sampleArticles.filter(a => a.id !== matchingSampleArticle.id).slice(0, 2),
        message: 'Using sample article as fallback'
      });
    }

    console.log("No articles found, using hardcoded article");
    return NextResponse.json({ 
      article: hardcodedArticle,
      message: 'No articles found, using hardcoded article'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      article: hardcodedArticle,
      message: 'Unexpected error occurred, using hardcoded article'
    });
  }
}