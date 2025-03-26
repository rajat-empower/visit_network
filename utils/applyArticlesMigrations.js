"use server"
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase connection details
const supabaseUrl = "https://ufgcupjjxgxghlhgdlie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTI5ODc3MCwiZXhwIjoyMDU0ODc0NzcwfQ.V8ZM704YXKSoLBfq-B1TRjsjbxV9RqcUzVjuEsR6TWQ";

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(filePath) {
  try {
    console.log(`Running migration: ${path.basename(filePath)}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL file by semicolons to execute each statement separately
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing SQL: ${statement}`);
        console.error(error);
        return false;
      }
    }
    
    console.log(`Migration ${path.basename(filePath)} completed successfully`);
    return true;
  } catch (error) {
    console.error(`Error running migration ${path.basename(filePath)}:`, error);
    return false;
  }
}

async function main() {
  // Define the migration files to run in order
  const migrationFiles = [
    path.resolve('migrations/004_update_articles_table.sql'),
    path.resolve('migrations/005_add_sample_article.sql'),
    path.resolve('migrations/006_add_visa_article.sql'),
    path.resolve('migrations/007_create_article_categories_table.sql')
  ];
  
  let success = true;
  
  for (const file of migrationFiles) {
    const result = await runMigration(file);
    if (!result) {
      success = false;
      break;
    }
  }
  
  if (success) {
    console.log("All migrations completed successfully!");
  } else {
    console.error("Migration process failed. See errors above.");
    process.exit(1);
  }
}

main().catch(error => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
