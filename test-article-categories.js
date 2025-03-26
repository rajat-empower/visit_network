// Script to test connection to the article_categories table
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = "https://ufgcupjjxgxghlhgdlie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTI5ODc3MCwiZXhwIjoyMDU0ODc0NzcwfQ.V8ZM704YXKSoLBfq-B1TRjsjbxV9RqcUzVjuEsR6TWQ";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log("Testing connection to the article_categories table...");
    
    // Try to select from the article_categories table
    console.log("Trying to select from article_categories table...");
    const { data: categories, error: categoriesError } = await supabase
      .from('article_categories')
      .select('*')
      .limit(5);
    
    if (categoriesError) {
      console.error("Error selecting from article_categories table:", categoriesError);
    } else {
      console.log("Categories found:", categories);
    }
    
    // Try to select from the article table with a join to article_categories
    console.log("Trying to select from article table with a join to article_categories...");
    const { data: articles, error: articlesError } = await supabase
      .from('article')
      .select(`
        *,
        category:article_categories(id, name, slug)
      `)
      .limit(5);
    
    if (articlesError) {
      console.error("Error selecting from article table with join:", articlesError);
    } else {
      console.log("Articles with categories found:", articles);
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

main();
