import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

/**
 * GET /api/places-to-stay
 * Returns a list of places to stay with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    // Build the query
    let query = supabase
      .from('places_to_stay')
      .select(`
        *,
        city:cities(*),
        type:place_types(*)
      `);

    // Apply filters if provided
    if (city) {
      query = query.eq('city_id', city);
    }
    if (type) {
      query = query.eq('place_type_id', type);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching places:', error);
      return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 