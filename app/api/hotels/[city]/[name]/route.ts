import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

// Helper functions for name formatting
const formatNameForQuery = (name: string): string => {
  return decodeURIComponent(name).replace(/-+/g, ' ');
};

// Helper function to fetch related tours
async function fetchRelatedTours(cityId: string, cityName: string) {
  try {
    // First try to find tours directly linked to the city
    const { data, error } = await supabase
      .from('tours')
      .select(`
        id,
        name,
        description,
        image_url,
        price,
        duration,
        booking_link,
        city_id,
        cities (name)
      `)
      .eq('city_id', cityId)
      .limit(3);

    if (error) throw error;

    if (data && data.length > 0) {
      return data;
    }

    // If no direct tours found, try searching in tour descriptions
    const { data: textSearchData, error: textSearchError } = await supabase
      .from('tours')
      .select(`
        id,
        name,
        description,
        image_url,
        price,
        duration,
        booking_link,
        city_id,
        cities (name)
      `)
      .ilike('description', `%${cityName}%`)
      .limit(3);

    if (textSearchError) throw textSearchError;
    return textSearchData || [];
  } catch (err) {
    console.error('Error fetching related tours:', err);
    return [];
  }
}

/**
 * GET /api/hotels/[city]/[name]
 * Returns details for a specific hotel by city and name
 */
export async function GET(
  request: NextRequest,
  context: { params: { city: string; name: string } }
) {
  try {
    const params = await context.params;
    const { city, name } = params;
    
    if (!city || !name) {
      return NextResponse.json({ error: 'City and hotel name are required' }, { status: 400 });
    }

    const formattedName = formatNameForQuery(name);
    const formattedCity = formatNameForQuery(city);
    
    console.log("Fetching hotel with:", { 
      originalName: name, 
      originalCity: city,
      formattedName, 
      formattedCity 
    });

    // First try to find the city with exact match
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('id, name')
      .ilike('name', formattedCity)
      .single();

    if (cityError) {
      console.error("City not found with exact match, trying fuzzy search:", { formattedCity, error: cityError });
      
      // Try a more flexible search for the city
      const { data: citiesData, error: citiesError } = await supabase
        .from('cities')
        .select('id, name')
        .ilike('name', `%${formattedCity.split(' ')[0]}%`); // Try matching just the first word
        
      if (citiesError || !citiesData || citiesData.length === 0) {
        console.error("City not found with fuzzy search:", { formattedCity, error: citiesError });
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }
      
      // Use the first matching city
      const cityMatch = citiesData[0];
      console.log("Found city with fuzzy search:", cityMatch);
      
      // Now try to find the hotel with this city
      const { data: hotelData, error: hotelError } = await supabase
        .from('places_to_stay')
        .select(`
          *,
          city:cities(*),
          type:place_types(*)
        `)
        .ilike('name', `%${formattedName.split(' ')[0]}%`) // Try matching just the first word of the hotel name
        .eq('city_id', cityMatch.id)
        .limit(1);
        
      if (hotelError || !hotelData || hotelData.length === 0) {
        console.error("Hotel not found with fuzzy search:", { formattedName, cityId: cityMatch.id, error: hotelError });
        return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
      }
      
      // Fetch related tours for this city
      const relatedTours = await fetchRelatedTours(cityMatch.id, cityMatch.name);
      
      console.log("Found hotel with fuzzy search:", hotelData[0]);
      return NextResponse.json({ 
        data: hotelData[0],
        relatedTours 
      });
    }
    
    console.log("Found city with exact match:", cityData);

    // Try to find the hotel with exact name match
    const { data: hotelData, error: hotelError } = await supabase
      .from('places_to_stay')
      .select(`
        *,
        city:cities(*),
        type:place_types(*)
      `)
      .ilike('name', formattedName)
      .eq('city_id', cityData.id)
      .single();

    if (hotelError) {
      console.error("Hotel not found with exact match, trying fuzzy search:", { formattedName, cityId: cityData.id, error: hotelError });
      
      // Try a more flexible search for the hotel
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('places_to_stay')
        .select(`
          *,
          city:cities(*),
          type:place_types(*)
        `)
        .ilike('name', `%${formattedName.split(' ')[0]}%`) // Try matching just the first word
        .eq('city_id', cityData.id)
        .limit(1);
        
      if (hotelsError || !hotelsData || hotelsData.length === 0) {
        console.error("Hotel not found with fuzzy search:", { formattedName, cityId: cityData.id, error: hotelsError });
        return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
      }
      
      // Fetch related tours for this city
      const relatedTours = await fetchRelatedTours(cityData.id, cityData.name);
      
      console.log("Found hotel with fuzzy search:", hotelsData[0]);
      return NextResponse.json({ 
        data: hotelsData[0],
        relatedTours 
      });
    }

    // Fetch related tours for this city
    const relatedTours = await fetchRelatedTours(cityData.id, cityData.name);

    console.log("Found hotel with exact match:", hotelData);
    return NextResponse.json({ 
      data: hotelData,
      relatedTours 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 