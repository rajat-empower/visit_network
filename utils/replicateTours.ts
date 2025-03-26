import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Ljubljana city UUID
const LJUBLJANA_ID = '123e4567-e89b-12d3-a456-426614174000';

// Additional tour from RecommendedActivities that's not in addTours.ts
const additionalTour = {
  id: '1001885',
  name: 'From Ljubljana: Triglav National Park Tour',
  description: 'Start from Ljubljana, passing and visit Lake Bohinj, Savica Waterfall, Pokljuka plateau, Vintgar Gorge, Zelenci, Jasna Lake and Pericnik Waterfall.',
  image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/from-ljubljana-triglav-national-park-tour-0.jpg',
  price: 157.48,
  duration: 'Full Day',
  booking_link: 'https://www.viator.com/tours/Ljubljana/Ljubljana-Triglav-National-Park-Tour/d5257-15264P17',
  city_id: LJUBLJANA_ID,
  tour_type_id: 'general',
  is_featured: true
};

// Make sure the 'general' tour type exists
const ensureGeneralTourType = async () => {
  const { error } = await supabase
    .from('tour_types')
    .upsert({ id: 'general', name: 'General Tours' }, { onConflict: 'id' });
  
  if (error) {
    console.error('Error ensuring general tour type exists:', error);
    throw error;
  }
};

// Make sure the additional tour exists
const ensureAdditionalTour = async () => {
  const { error } = await supabase
    .from('tours')
    .upsert(additionalTour, { onConflict: 'id' });
  
  if (error) {
    console.error('Error ensuring additional tour exists:', error);
    throw error;
  }
};

// Generate a new tour based on an existing one
const generateNewTour = (existingTour: any) => {
  // Generate a new ID
  const newId = uuidv4();
  
  // Modify the name slightly
  const namePrefixes = [
    'Premium', 'Exclusive', 'Deluxe', 'Ultimate', 'Classic', 
    'Authentic', 'Guided', 'Special', 'Scenic', 'Unforgettable'
  ];
  const randomPrefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
  const newName = `${randomPrefix} ${existingTour.name}`;
  
  // Adjust the price slightly (±20%)
  const priceAdjustment = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
  const newPrice = Math.round(existingTour.price * priceAdjustment * 100) / 100;
  
  // Return the new tour
  return {
    ...existingTour,
    id: newId,
    name: newName,
    price: newPrice,
    is_featured: Math.random() > 0.7 // 30% chance of being featured
  };
};

export async function replicateTours() {
  try {
    console.log('Starting tour replication process...');
    
    // Ensure the 'general' tour type exists
    await ensureGeneralTourType();
    console.log('Ensured general tour type exists');
    
    // Ensure the additional tour exists
    await ensureAdditionalTour();
    console.log('Ensured additional tour exists');
    
    // Fetch all existing tours
    const { data: existingTours, error: fetchError } = await supabase
      .from('tours')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching existing tours:', fetchError);
      throw fetchError;
    }
    
    if (!existingTours || existingTours.length === 0) {
      console.error('No existing tours found to replicate');
      return { success: false, message: 'No existing tours found to replicate' };
    }
    
    console.log(`Found ${existingTours.length} existing tours to replicate`);
    
    // Generate new tours based on existing ones
    const newTours = [];
    for (const existingTour of existingTours) {
      // Generate 2 new tours for each existing tour
      for (let i = 0; i < 2; i++) {
        newTours.push(generateNewTour(existingTour));
      }
    }
    
    console.log(`Generated ${newTours.length} new tours`);
    
    // Insert new tours in batches to avoid potential rate limits
    const batchSize = 10;
    for (let i = 0; i < newTours.length; i += batchSize) {
      const batch = newTours.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('tours')
        .insert(batch);
      
      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
        throw insertError;
      }
      
      console.log(`Successfully inserted batch ${i / batchSize + 1} of ${Math.ceil(newTours.length / batchSize)}`);
    }
    
    console.log('Successfully replicated all tours');
    return { 
      success: true, 
      message: `Successfully replicated ${existingTours.length} tours into ${newTours.length} new tours` 
    };
  } catch (error) {
    console.error('Error replicating tours:', error);
    return { success: false, message: 'Error replicating tours', error };
  }
}
