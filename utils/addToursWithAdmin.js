// Script to add tours to the database using the service role key
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Create a Supabase client with service role key to bypass RLS
const supabaseUrl = "https://ufgcupjjxgxghlhgdlie.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTI5ODc3MCwiZXhwIjoyMDU0ODc0NzcwfQ.V8ZM704YXKSoLBfq-B1TRjsjbxV9RqcUzVjuEsR6TWQ";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Get existing tour types
async function getExistingTourTypes() {
  console.log('Fetching existing tour types...');
  
  const { data, error } = await supabaseAdmin
    .from('tour_types')
    .select('id, name');
  
  if (error) {
    console.error('Error fetching tour types:', error);
    return [];
  }
  
  console.log('Existing tour types:', data);
  return data;
}

// Get existing cities
async function getExistingCities() {
  console.log('Fetching existing cities...');
  
  const { data, error } = await supabaseAdmin
    .from('cities')
    .select('id, name');
  
  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
  
  console.log('Existing cities:', data);
  return data;
}

// Add tours
async function addTours(cityId, tourTypes) {
  console.log('Adding tours...');
  
  // Find the General tour type
  const generalType = tourTypes.find(type => type.name === 'General');
  if (!generalType) {
    console.error('General tour type not found');
    return;
  }
  
  // Find the Food & Drink tour type
  const foodDrinkType = tourTypes.find(type => type.name === 'Food & Drink');
  if (!foodDrinkType) {
    console.error('Food & Drink tour type not found');
    return;
  }
  
  // Tour data
  const tours = [
    {
      id: uuidv4(),
      name: 'From Ljubljana: Triglav National Park Tour',
      description: 'Start from Ljubljana, passing and visit Lake Bohinj, Savica Waterfall, Pokljuka plateau, Vintgar Gorge, Zelenci, Jasna Lake and Pericnik Waterfall. This tour covers about one half of the Triglav National Park. Operates in all weather conditions, please dress appropriately (no refund due to weather or personal reasons).',
      image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/from-ljubljana-triglav-national-park-tour-0.jpg',
      price: 157.48,
      duration: 'Full Day',
      booking_link: 'https://www.viator.com/tours/Ljubljana/Ljubljana-Triglav-National-Park-Tour/d5257-15264P17',
      city_id: cityId,
      tour_type_id: generalType.id
    },
    {
      id: uuidv4(),
      name: 'Skocjan Cave Day Tour From Ljubljana',
      description: 'Our aim is to show everyone the best of Slovenia. We speak good english and make sure that our guests enjoy when doing a tour with us. During this tour guests will be seeing the Skocjan caves and if they have extra time they may add visiting Postojna cave or Predjama castle at extra costs.',
      image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/skocjan-cave-day-tour-from-ljubljana-0.jpg',
      price: 120.00,
      duration: 'Full Day',
      booking_link: 'https://www.viator.com/tours/Ljubljana/Skocjan-Cave-Day-Tour-From-Ljubljana/d5257-49724P13',
      city_id: cityId,
      tour_type_id: generalType.id
    },
    {
      id: uuidv4(),
      name: 'Postojna Cave And Predjama Castle - Entrance Tickets Included',
      description: 'On this day we take you to the biggest and worldwide known Slovenian cave system - the Postojna caves. Amazing two million years old and 21 km long system of underground caves is one of the most diverse cave systems in the world.',
      image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/postojna-cave-and-predjama-castle-entrance-tickets-included-0.jpg',
      price: 123.49,
      duration: 'Half Day',
      booking_link: 'https://www.viator.com/tours/Ljubljana/Postojna-Caves-and-Predjama-Castle-Tour-from-Ljubljana/d5257-3312LJ_POS',
      city_id: cityId,
      tour_type_id: generalType.id
    },
    {
      id: uuidv4(),
      name: 'Slovenia In One Day: Lake Bled, Postojna Cave And Predjama Castle',
      description: 'The Original & top-rated small group day tour to the 3 main tourist attractions of Slovenia! Explore the magnificent Postojna Cave, one of the largest karst monuments in the world.',
      image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/slovenia-in-one-day-lake-bled-postojna-cave-and-predjama-castle-0.jpg',
      price: 134.82,
      duration: 'Full Day',
      booking_link: 'https://www.viator.com/tours/Ljubljana/Slovenia-in-One-Day-Small-Group-Day-Trip-to-Lake-Bled-Postojna-Cave-and-Predjama-Castle-from-Ljubljana/d5257-6993SVN1DAY',
      city_id: cityId,
      tour_type_id: generalType.id
    },
    {
      id: uuidv4(),
      name: 'Lake Bled and Bohinj - Beyond the Alpine Lakes from Ljubljana',
      description: 'Discover the natural beauty of Slovenia with this full-day tour to Lake Bled and Lake Bohinj. Visit Bled Castle, take a traditional pletna boat ride to Bled Island, and explore the charming town of Bohinj.',
      image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/lake-bled-and-bohinj-beyond-the-alpine-lakes-from-ljubljana-0.jpg',
      price: 89.99,
      duration: 'Full Day',
      booking_link: 'https://www.visitslovenia.com/tours/lake-bled-bohinj-tour',
      city_id: cityId,
      tour_type_id: generalType.id
    },
    {
      id: uuidv4(),
      name: 'Ljubljana Food and Wine Walking Tour',
      description: 'Discover the rich culinary traditions of Slovenia on this guided food and wine tour through Ljubljana. Sample local delicacies, traditional dishes, and Slovenian wines while learning about the country\'s food culture.',
      image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/ljubljana-food-wine-tour.jpg',
      price: 75.00,
      duration: '3 Hours',
      booking_link: 'https://www.visitslovenia.com/tours/ljubljana-food-wine-tour',
      city_id: cityId,
      tour_type_id: foodDrinkType.id
    }
  ];
  
  for (const tour of tours) {
    const { error } = await supabaseAdmin
      .from('tours')
      .upsert(tour, { onConflict: 'id' });
    
    if (error) {
      console.error(`Error adding tour ${tour.name}:`, error);
    } else {
      console.log(`Added tour: ${tour.name}`);
    }
  }
}

// Run the script
async function run() {
  try {
    // Get existing tour types
    const tourTypes = await getExistingTourTypes();
    if (tourTypes.length === 0) {
      console.error('No tour types found. Please add tour types first.');
      return;
    }
    
    // Get existing cities
    const cities = await getExistingCities();
    if (cities.length === 0) {
      console.error('No cities found. Please add cities first.');
      return;
    }
    
    // Find Ljubljana city
    const ljubljanaCity = cities.find(city => city.name === 'Ljubljana');
    if (!ljubljanaCity) {
      console.error('Ljubljana city not found');
      return;
    }
    
    console.log(`Using Ljubljana city: ${ljubljanaCity.name} (${ljubljanaCity.id})`);
    
    // Add tours
    await addTours(ljubljanaCity.id, tourTypes);
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
