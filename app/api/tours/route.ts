import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Count the total number of tours
    const { count, error: countError } = await supabase
      .from("tours")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Error counting tours:", countError);
      return NextResponse.json({ error: "Failed to count tours" }, { status: 500 });
    }
    
    // Fetch the tours with related data
    const { data, error } = await supabase
      .from("tours")
      .select(`
        id,
        name,
        description,
        image_url,
        price,
        duration,
        booking_link,
        city_id,
        tour_type_id,
        is_featured,
        rating,
        included,
        policy,
        additional,
        cities (
          name
        ),
        tour_types (
          id,
          name
        )
      `);
    
    if (error) {
      console.error("Error fetching tours:", error);
      return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
    }
    
    return NextResponse.json({ 
      data,
      count,
      city,
      category,
      search
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
} 