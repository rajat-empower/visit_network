import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client'

/**
 * GET /api/cities/[name]
 * Returns details for a specific city by name
 */
export async function GET(
  request: NextRequest,
  context: { params: { name: string } }
) {
  try {
    const params = await context.params;
    const { name } = params;
    
    if (!name) {
      return NextResponse.json({ error: 'City name is required' }, { status: 400 });
    }
    console.log(name);
    // Convert URL-friendly format back to normal text
    const normalizedName = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Fetch city by name (case insensitive)
    const { data: city, error: cityError } = await supabase
      .from('cities')
      .select('*')
      .ilike('name', normalizedName)
      .maybeSingle();
    
    if (cityError) {
      console.error('Error fetching city:', cityError);
      return NextResponse.json({ error: 'Failed to fetch city details' }, { status: 500 });
    }
    
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    
    // Fetch places to stay in this city
    const { data: places, error: placesError } = await supabase
      .from('places_to_stay')
      .select('*')
      .eq('city_id', city.id);
    
    if (placesError) {
      console.error('Error fetching places:', placesError);
      return NextResponse.json({ error: 'Failed to fetch places in city' }, { status: 500 });
    }
    
    // Fetch tours that include this city
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select(`
        *,
        tour_types(*)
      `)
      .eq('city_id', city.id);
    
    if (toursError) {
      console.error('Error fetching tours:', toursError);
      return NextResponse.json({ error: 'Failed to fetch tours for city' }, { status: 500 });
    }
    console.log(city, places, tours);
    return NextResponse.json({
      city,
      places: places || [],
      tours: tours || []
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 