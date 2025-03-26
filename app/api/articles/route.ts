import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Article = Database['public']['Tables']['articles']['Row'] & {
  category?: Database['public']['Tables']['article_categories']['Row'];
  excerpt?: string;
  slug?: string;
};

// Helper function to create an excerpt from HTML content
function createExcerpt(content: string, length: number = 150): string {
  const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, "");
  return strippedContent.length > length ? strippedContent.substring(0, length) + "..." : strippedContent;
}

// Helper function to create a slug from a title
function createSlug(title: string, categoryName?: string): string {
  const titleSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  
  if (categoryName) {
    const categorySlug = categoryName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `${categorySlug}/${titleSlug}`;
  }
  
  return titleSlug;
}

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const featured = searchParams.get('featured') === 'true';
    
    // Fetch categories first (this is a small table, so it's fast)
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('article_categories')
      .select('*');
      
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
    
    // Build the query for articles
    let query = supabase
      .from('articles')
      .select(`
        *,
        category:article_categories(*)
      `)
      .order('created_at', { ascending: false });
    
    // Apply category filter if provided
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    // Apply featured filter if requested
    if (featured) {
      query = query.eq('is_featured', true);
    }
    
    // Apply limit
    query = query.limit(limit);
    
    // Execute the query
    const { data: articlesData, error: articlesError } = await query.returns<Article[]>();
    
    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
    
    // Process the articles to add excerpts and slugs
    const processedArticles = articlesData.map(article => {
      const categoryName = article.category ? article.category.name : undefined;
      
      return {
        ...article,
        excerpt: article.excerpt || createExcerpt(article.content),
        slug: article.slug || createSlug(article.title, categoryName)
      };
    });
    
    return NextResponse.json({ 
      categories: categoriesData,
      articles: processedArticles
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 