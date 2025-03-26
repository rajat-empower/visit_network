"use server"
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Create a Supabase client
const supabaseUrl = "https://ufgcupjjxgxghlhgdlie.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTg3NzAsImV4cCI6MjA1NDg3NDc3MH0.Oe2Lb17ea3RUo0hkmMZAvgnXT7Wi_nnCGHmZYhuIIAM";
const supabase = createClient(supabaseUrl, supabaseKey);

// Ljubljana city UUID
const LJUBLJANA_ID = '123e4567-e89b-12d3-a456-426614174000';

// Generate UUIDs for tour types
const GENERAL_TYPE_ID = uuidv4();

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
    city_id: LJUBLJANA_ID,
    tour_type_id: GENERAL_TYPE_ID
  },
  {
    id: uuidv4(),
    name: 'Skocjan Cave Day Tour From Ljubljana',
    description: 'Our aim is to show everyone the best of Slovenia. We speak good english and make sure that our guests enjoy when doing a tour with us. During this tour guests will be seeing the Skocjan caves and if they have extra time they may add visiting Postojna cave or Predjama castle at extra costs.',
    image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/skocjan-cave-day-tour-from-ljubljana-0.jpg',
    price: 120.00,
    duration: 'Full Day',
    booking_link: 'https://www.viator.com/tours/Ljubljana/Skocjan-Cave-Day-Tour-From-Ljubljana/d5257-49724P13',
    city_id: LJUBLJANA_ID,
    tour_type_id: GENERAL_TYPE_ID
  },
  {
    id: uuidv4(),
    name: 'Postojna Cave And Predjama Castle - Entrance Tickets Included',
    description: 'On this day we take you to the biggest and worldwide known Slovenian cave system - the Postojna caves. Amazing two million years old and 21 km long system of underground caves is one of the most diverse cave systems in the world.',
    image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/postojna-cave-and-predjama-castle-entrance-tickets-included-0.jpg',
    price: 123.49,
    duration: 'Half Day',
    booking_link: 'https://www.viator.com/tours/Ljubljana/Postojna-Caves-and-Predjama-Castle-Tour-from-Ljubljana/d5257-3312LJ_POS',
    city_id: LJUBLJANA_ID,
    tour_type_id: GENERAL_TYPE_ID
  },
  {
    id: uuidv4(),
    name: 'Slovenia In One Day: Lake Bled, Postojna Cave And Predjama Castle',
    description: 'The Original & top-rated small group day tour to the 3 main tourist attractions of Slovenia! Explore the magnificent Postojna Cave, one of the largest karst monuments in the world.',
    image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/slovenia-in-one-day-lake-bled-postojna-cave-and-predjama-castle-0.jpg',
    price: 134.82,
    duration: 'Full Day',
    booking_link: 'https://www.viator.com/tours/Ljubljana/Slovenia-in-One-Day-Small-Group-Day-Trip-to-Lake-Bled-Postojna-Cave-and-Predjama-Castle-from-Ljubljana/d5257-6993SVN1DAY',
    city_id: LJUBLJANA_ID,
    tour_type_id: GENERAL_TYPE_ID
  },
  {
    id: uuidv4(),
    name: 'Lake Bled and Bohinj - Beyond the Alpine Lakes from Ljubljana',
    description: 'Discover the natural beauty of Slovenia with this full-day tour to Lake Bled and Lake Bohinj. Visit Bled Castle, take a traditional pletna boat ride to Bled Island, and explore the charming town of Bohinj.',
    image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/tours/lake-bled-and-bohinj-beyond-the-alpine-lakes-from-ljubljana-0.jpg',
    price: 89.99,
    duration: 'Full Day',
    booking_link: 'https://www.visitslovenia.com/tours/lake-bled-bohinj-tour',
    city_id: LJUBLJANA_ID,
    tour_type_id: GENERAL_TYPE_ID
  }
];

// Add tours
async function addTours() {
  console.log('Adding tours...');
  
  for (const tour of tours) {
    const { error } = await supabase
      .from('tours')
      .upsert(tour, { onConflict: 'id' });
    
    if (error) {
      console.error(`Error adding tour ${tour.name}:`, error);
    } else {
      console.log(`Added tour: ${tour.name}`);
    }
  }
}

// Add city
async function addCity() {
  console.log('Adding Ljubljana city...');
  
  const { error } = await supabase
    .from('cities')
    .upsert({
      id: LJUBLJANA_ID,
      name: 'Ljubljana',
      description: 'The capital and largest city of Slovenia.',
      image_url: 'https://visitslovenia.b-cdn.net/wp-content/uploads/ljubljana-city.jpg',
      latitude: 46.0569,
      longitude: 14.5058,
      region: 'Central Slovenia'
    }, { onConflict: 'id' });
  
  if (error) {
    console.error('Error adding Ljubljana city:', error);
  } else {
    console.log('Added Ljubljana city');
  }
}

// Run the script
async function run() {
  try {
    await addCity();
    await addTours();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
