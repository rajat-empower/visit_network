// Script to test connection to the articles table
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = "https://ufgcupjjxgxghlhgdlie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTI5ODc3MCwiZXhwIjoyMDU0ODc0NzcwfQ.V8ZM704YXKSoLBfq-B1TRjsjbxV9RqcUzVjuEsR6TWQ";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log("Testing connection to the articles table...");
    
    // Try to select from the articles table
    console.log("Trying to select from article table...");
    const { data: articles, error: articlesError } = await supabase
      .from('article')
      .select('*')
      .limit(5);
    
    if (articlesError) {
      console.error("Error selecting from article table:", articlesError);
    } else {
      console.log("Articles found:", articles);
    }
    
    // Also try with articles (plural) just to be sure
    console.log("Trying to select from articles table...");
    const { data: articlesPlural, error: articlesPluralError } = await supabase
      .from('articles')
      .select('*')
      .limit(5);
    
    if (articlesPluralError) {
      console.error("Error selecting from articles table:", articlesPluralError);
    } else {
      console.log("Articles found (plural):", articlesPlural);
    }
    
    // Try to select from the tours table as a reference
    console.log("Trying to select from tours table for reference...");
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('*')
      .limit(1);
    
    if (toursError) {
      console.error("Error selecting from tours table:", toursError);
    } else {
      console.log("Tours found:", tours);
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

main();
