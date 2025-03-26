import { NextResponse } from 'next/server';

import { supabase } from '@/integrations/supabase/client';

export async function GET() {
  try {
    // Fetch tour types
    const { data, error } = await supabase
      .from('tour_types')
      .select('id, name');
    
    if (error) {
      console.error('Error fetching tour types:', error);
      return NextResponse.json({ error: 'Failed to fetch tour types' }, { status: 500 });
    }
    
    // Add description field to match the interface
    const typesWithDescription = data.map(type => ({
      ...type,
      description: `Explore Slovenia with our ${type.name.toLowerCase()}. We've curated the best ${type.name.toLowerCase()} across Slovenia to help you discover this beautiful country.`
    }));
    
    return NextResponse.json({ data: typesWithDescription });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 