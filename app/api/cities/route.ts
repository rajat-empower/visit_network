import { NextResponse } from 'next/server';

import { supabase } from '@/integrations/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');

    if (error) throw error;
    return NextResponse.json({ cities: data });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, image_url } = await request.json();

    const { data, error } = await supabase
      .from('cities')
      .update({ image_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ city: data });
  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: 'Failed to update city' },
      { status: 500 }
    );
  }
} 