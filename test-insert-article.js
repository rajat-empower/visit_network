// Script to test inserting an article directly into the database
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = "https://ufgcupjjxgxghlhgdlie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTI5ODc3MCwiZXhwIjoyMDU0ODc0NzcwfQ.V8ZM704YXKSoLBfq-B1TRjsjbxV9RqcUzVjuEsR6TWQ";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log("Testing database connection...");
    
    // First, let's check if the articles table exists
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error("Error checking tables:", tablesError);
    } else {
      console.log("Tables in the database:", tables);
      
      // Check if articles table exists in the list
      const articlesTableExists = tables.some(table => table.tablename === 'articles');
      console.log("Articles table exists:", articlesTableExists);
    }
    
    // Try to select from the articles table
    console.log("Trying to select from articles table...");
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .limit(1);
    
    if (articlesError) {
      console.error("Error selecting from articles table:", articlesError);
      console.error("Error details:", {
        code: articlesError.code,
        message: articlesError.message,
        details: articlesError.details,
        hint: articlesError.hint
      });
    } else {
      console.log("Articles found:", articles);
    }
    
    // Try to insert a test article
    console.log("Trying to insert a test article...");
    const { data: insertData, error: insertError } = await supabase
      .from('articles')
      .insert([
        {
          title: 'Test Article',
          content: '<p>This is a test article.</p>',
          feature_img: 'https://example.com/test.jpg',
          author: 'Test Author',
          tags: 'Test, Article'
        }
      ])
      .select();
    
    if (insertError) {
      console.error("Error inserting article:", insertError);
      console.error("Error details:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
    } else {
      console.log("Article inserted successfully:", insertData);
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

main();
