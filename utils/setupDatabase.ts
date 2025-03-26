"use server"
import { supabase } from "@/integrations/supabase/client";

// Ljubljana city UUID
const LJUBLJANA_ID = '123e4567-e89b-12d3-a456-426614174000';

const tourData = [
  {
    id: '1001885',
    name: 'From Ljubljana: Triglav National Park Tour',
    description: 'Start from Ljubljana, passing and visit Lake Bohinj, Savica Waterfall, Pokljuka plateau, Vintgar Gorge, Zelenci, Jasna Lake and Pericnik Waterfall. This tour covers about one half of the Triglav National Park. Operates in all weather conditions, please dress appropriately (no refund due to weather or personal reasons).',
    image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/from-ljubljana-triglav-national-park-tour-0.jpg',
    price: 157.48,
    duration: 'Full Day',
    booking_link: 'https://www.viator.com/tours/Ljubljana/Ljubljana-Triglav-National-Park-Tour/d5257-15264P17',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'general'
  },
  {
    id: '1002065',
    name: 'Skocjan Cave Day Tour From Ljubljana',
    description: 'Our aim is to show everyone the best of Slovenia. We speak good english and make sure that our guests enjoy when doing a tour with us. Its always our pleasure to make sure our guests gets what they wish for during the tour with us. During this tour guests will be seeing the Skocjan caves and if they have extra time they may add visiting Postojna cave or Predjama castle at extra costs.',
    image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/skocjan-cave-day-tour-from-ljubljana-0.jpg',
    price: 120.00,
    duration: 'Full Day',
    booking_link: 'https://www.viator.com/tours/Ljubljana/Skocjan-Cave-Day-Tour-From-Ljubljana/d5257-49724P13',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'general'
  }
];

export async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // First check if we can connect to Supabase
    const { data: healthCheck, error: healthError } = await supabase
      .from('tours')
      .select('count')
      .limit(1);

    if (healthError) {
      console.error('Error connecting to Supabase:', healthError);
      throw healthError;
    }

    console.log('Successfully connected to Supabase');

    // Insert Ljubljana city
    const { error: cityError } = await supabase
      .from('cities')
      .upsert({ 
        id: LJUBLJANA_ID,
        name: 'Ljubljana',
        description: 'Capital city of Slovenia',
        image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/cities/ljubljana.jpg',
        type: 'city'
      }, { onConflict: 'id' });

    if (cityError) {
      console.error('Error inserting city:', cityError);
      throw cityError;
    }

    console.log('Successfully inserted city');

    // Insert tour type
    const { error: typeError } = await supabase
      .from('tour_types')
      .upsert({ 
        id: 'general',
        name: 'General Tour' 
      }, { onConflict: 'id' });

    if (typeError) {
      console.error('Error inserting tour type:', typeError);
      throw typeError;
    }

    console.log('Successfully inserted tour type');

    // Insert tours
    for (const tour of tourData) {
      const { error: tourError } = await supabase
        .from('tours')
        .upsert(tour, { onConflict: 'id' });

      if (tourError) {
        console.error('Error inserting tour:', tourError);
        throw tourError;
      }
    }

    console.log('Successfully inserted tours');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}