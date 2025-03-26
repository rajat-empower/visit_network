import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

// Helper function to create URL-friendly slugs
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
    .trim();                  // Trim leading/trailing spaces or hyphens
};

/**
 * GET /api/tours/[name]
 * Returns details for a specific tour by name
 */
export async function GET(
  request: NextRequest,
  context: { params: { name: string } }
) {
  try {
    const params = await context.params;
    const { name } = params;
    
    if (!name) {
      return NextResponse.json({ error: 'Tour name is required' }, { status: 400 });
    }

    // Fetch all tours first
    const { data: allTours, error: toursError } = await supabase
      .from('tours')
      .select(`
        *,
        cities (
          id,
          name,
          region
        ),
        tour_types (
          id,
          name,
          description
        )
      `);

    if (toursError) {
      console.error('Error fetching tours:', toursError);
      return NextResponse.json({ error: 'Failed to fetch tour details' }, { status: 500 });
    }

    // Find the tour that matches the slug from the URL
    const matchingTour = allTours?.find(tour => 
      createSlug(tour.name) === name
    );

    if (!matchingTour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json({ data: matchingTour });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 