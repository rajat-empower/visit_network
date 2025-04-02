import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export async function POST(request: Request) {
  try {
    const tourData = await request.json();

    // Insert into Supabase
    const { data, error } = await supabase
      .from('tours')
      .insert([{
        product_code: tourData.product_code,
        title: tourData.title,
        description: tourData.description,
        images: tourData.images,
        reviews: tourData.reviews,
        duration: tourData.duration,
        confirmation_type: tourData.confirmation_type,
        itinerary_type: tourData.itinerary_type,
        pricing: tourData.pricing,
        product_url: tourData.product_url,
        destinations: tourData.destinations,
        tags: tourData.tags,
        flags: tourData.flags,
        translation_info: tourData.translation_info,
        import_metadata: tourData.import_metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      data: data[0]
    });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to create tour'
      },
      { status: 500 }
    );
  }
} 