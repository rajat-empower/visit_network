// Script to apply the articles table migrations
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = "https://ufgcupjjxgxghlhgdlie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTI5ODc3MCwiZXhwIjoyMDU0ODc0NzcwfQ.V8ZM704YXKSoLBfq-B1TRjsjbxV9RqcUzVjuEsR6TWQ";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log("Starting migrations...");

    // Create article_categories table
    const { error: createTableError } = await supabase.schema.create('public', `
      CREATE TABLE IF NOT EXISTS article_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    if (createTableError) {
      console.error("Error creating article_categories table:", createTableError);
    } else {
      console.log("article_categories table created or already exists");
    }

    // Insert sample categories
    const { error: insertCategoriesError } = await supabase
      .from('article_categories')
      .insert([
        { name: 'Culture and Heritage', slug: 'culture-and-heritage', description: 'Explore Slovenia\'s rich cultural heritage and traditions' },
        { name: 'Editor\'s Picks', slug: 'editors-picks', description: 'Our editors\' favorite articles about Slovenia' },
        { name: 'Events and Festivals', slug: 'events-and-festivals', description: 'Discover Slovenia\'s vibrant events and festivals' },
        { name: 'Explore Gorenjska', slug: 'explore-gorenjska', description: 'Guide to exploring the Gorenjska region of Slovenia' },
        { name: 'Explore Primorsko-Notranjska', slug: 'explore-primorsko-notranjska', description: 'Discover the Primorsko-Notranjska region' },
        { name: 'Historical Sites', slug: 'historical-sites', description: 'Explore Slovenia\'s fascinating historical sites' },
        { name: 'Ljubljana and Central Slovenia', slug: 'ljubljana-and-central-slovenia', description: 'Guide to Ljubljana and Central Slovenia' },
        { name: 'Outdoor Adventures', slug: 'outdoor-adventures', description: 'Outdoor activities and adventures in Slovenia' },
        { name: 'Pomurska', slug: 'pomurska', description: 'Discover the Pomurska region of Slovenia' },
        { name: 'Slovenian Coast and Karst', slug: 'slovenian-coast-and-karst', description: 'Explore Slovenia\'s beautiful coastline and Karst region' }
      ]);

    if (insertCategoriesError) {
      console.error("Error inserting sample categories:", insertCategoriesError);
    } else {
      console.log("Sample categories inserted successfully");
    }

    console.log("Migrations completed!");
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

main();
