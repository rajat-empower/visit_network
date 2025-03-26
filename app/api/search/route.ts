import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  try {
    // Fetch tours with the exact query structure provided
    const { data: toursData, error: toursError } = await supabase
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
        tour_type_id,
        rating,
        cities (
          name
        )
      `)
      .ilike('name', `%${query}%`);

    if (toursError) {
      console.error('Error fetching tours:', toursError);
      return NextResponse.json({ error: 'Error fetching tours' }, { status: 500 });
    }

    // Fetch articles with the exact query structure provided
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        content,
        feature_img,
        author,
        tags,
        created_at,
        category:article_categories(uuid, category)
      `)
      .ilike('title', `%${query}%`);

    if (articlesError) {
      console.error('Error fetching articles:', articlesError);
      return NextResponse.json({ error: 'Error fetching articles' }, { status: 500 });
    }

    // Fetch travel guides with the exact query structure provided
    const { data: travelGuidesData, error: travelGuidesError } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        content,
        feature_img,
        author,
        tags,
        created_at,
        category:article_categories(uuid, category)
      `)
      .limit(4);

    if (travelGuidesError) {
      console.error('Error fetching travel guides:', travelGuidesError);
      return NextResponse.json({ error: 'Error fetching travel guides' }, { status: 500 });
    }

    return NextResponse.json({
      tours: toursData,
      articles: articlesData,
      travelGuides: travelGuidesData
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 