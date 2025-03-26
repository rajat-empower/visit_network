"use server"
import { supabase } from "@/integrations/supabase/client";

export async function updateToursSchema() {
  try {
    console.log('Updating tours table schema...');

    // Check if the is_featured column already exists
    const { data: columns, error: columnsError } = await supabase
      .from('tours')
      .select('is_featured')
      .limit(1);

    // If the column doesn't exist (we get an error), add it
    if (columnsError && columnsError.message.includes('column "is_featured" does not exist')) {
      console.log('Adding is_featured column to tours table...');
      
      // Use raw SQL to add the column
      const { error } = await supabase.rpc('execute_sql', {
        sql: 'ALTER TABLE tours ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false'
      });

      if (error) {
        console.error('Error adding is_featured column:', error);
        throw error;
      }
      
      console.log('Successfully added is_featured column to tours table');
    } else {
      console.log('is_featured column already exists in tours table');
    }

    return { success: true, message: 'Tours schema updated successfully' };
  } catch (error) {
    console.error('Error updating tours schema:', error);
    return { success: false, message: 'Error updating tours schema', error };
  }
}
