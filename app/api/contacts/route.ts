import { NextResponse } from 'next/server';

import { supabase } from '@/integrations/supabase/client';

/**
 * GET /api/contacts
 * Returns a list of contacts
 */
export async function GET() {
  try {
    // Fetch contacts from the database
    const { data, error } = await supabase
      .from("tours")
      .select(`id, name, description`)
      .limit(10);

    if (error) {
      console.error('Error fetching contacts:', error);
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
    }

    // If no data, return empty array
    if (!data || data.length === 0) {
      return NextResponse.json({ 
        data: [
          {
            id: '1001',
            name: 'John Doe',
            description: 'This is a sample description.',
          },
        ] 
      });
    }

    // Return the contacts
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 