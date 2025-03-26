"use server";
import { supabase } from "@/integrations/supabase/client";

// Ljubljana city UUID
const LJUBLJANA_ID = '123e4567-e89b-12d3-a456-426614174000';

const newTourData = [
  {
    id: '1003001',
    name: 'Private Transfer From Ljubljana Airport (Lju) To Bled',
    description: 'Enjoy a comfortable and hassle-free private transfer from Ljubljana Airport directly to your accommodation in Bled. Skip the stress of public transportation and travel in style with our professional drivers who know the best routes.',
    image_url: '/images/private-transfer-ljubljana-bled.jpg',
    price: 94,
    duration: '1 Hour',
    booking_link: 'https://www.visitslovenia.com/tours/private-transfer-ljubljana-airport-to-bled',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'transfer',
    is_featured: true
  },
  {
    id: '1003002',
    name: 'Broken Bones Gin Experience',
    description: 'Discover the art of gin making at the renowned Broken Bones distillery in Ljubljana. Learn about the distillation process, the botanicals used, and enjoy a guided tasting of their award-winning gins paired with gourmet snacks.',
    image_url: '/images/broken-bones-gin-experience.jpg',
    price: 35,
    duration: '2 Hours',
    booking_link: 'https://www.visitslovenia.com/tours/broken-bones-gin-experience',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'food-drink',
    is_featured: true
  },
  {
    id: '1003003',
    name: 'Slovenian Alps E-Bike Tour From Ljubljana',
    description: 'Explore the breathtaking Slovenian Alps on an electric bike, making the mountainous terrain accessible to riders of all fitness levels. Enjoy stunning views, visit charming alpine villages, and experience the natural beauty of Slovenia with an expert guide.',
    image_url: '/images/slovenian-alps-ebike-tour.jpg',
    price: 141,
    duration: 'Full Day',
    booking_link: 'https://www.visitslovenia.com/tours/slovenian-alps-ebike-tour',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'adventure',
    is_featured: true
  },
  {
    id: '1003004',
    name: 'Best Of Slovenia Day Trip - Postojna & Bled',
    description: 'Experience the best of Slovenia in one day with this comprehensive tour. Visit the magnificent Postojna Cave, one of the largest karst monuments in the world, and the picturesque Lake Bled with its iconic island church and medieval castle.',
    image_url: '/images/best-of-slovenia-day-trip.jpg',
    price: 245,
    duration: 'Full Day',
    booking_link: 'https://www.visitslovenia.com/tours/best-of-slovenia-day-trip',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'sightseeing',
    is_featured: true
  },
  {
    id: '1003005',
    name: 'Observing And Discovering Bears In Their Natural Habitat',
    description: 'Join an expert wildlife guide for an unforgettable experience observing brown bears in their natural habitat in the Slovenian forests. Learn about these magnificent creatures and their ecosystem while watching them from a safe distance in specially designed observation hides.',
    image_url: '/images/bear-watching-slovenia.jpg',
    price: 443,
    duration: 'Half Day',
    booking_link: 'https://www.visitslovenia.com/tours/bear-watching-slovenia',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'wildlife',
    is_featured: true
  },
  {
    id: '1003006',
    name: 'Bled Lake, Island & Castle | Private Half Day Trip From Ljubljana',
    description: 'Discover the fairy-tale beauty of Lake Bled on this private half-day trip from Ljubljana. Visit the iconic Bled Island with its picturesque church, explore the medieval Bled Castle perched on a cliff, and enjoy the stunning alpine scenery.',
    image_url: '/images/bled-lake-island-castle-trip.jpg',
    price: 521,
    duration: 'Half Day',
    booking_link: 'https://www.visitslovenia.com/tours/bled-lake-island-castle-private-trip',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'private',
    is_featured: true
  },
  {
    id: '1003007',
    name: 'Skocjan Caves, Piran & Predjama Castle | Private Trip From Ljubljana',
    description: 'Experience the diverse beauty of Slovenia on this private trip from Ljubljana. Explore the UNESCO-listed Škocjan Caves with their massive underground canyon, visit the charming coastal town of Piran, and marvel at the unique Predjama Castle built into a cave mouth.',
    image_url: '/images/skocjan-piran-predjama-trip.jpg',
    price: 625,
    duration: 'Full Day',
    booking_link: 'https://www.visitslovenia.com/tours/skocjan-piran-predjama-private-trip',
    city_id: LJUBLJANA_ID,
    tour_type_id: 'private',
    is_featured: true
  }
];

// Insert additional tour types
const tourTypes = [
  { id: 'transfer', name: 'Transfers' },
  { id: 'food-drink', name: 'Food & Drink' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'sightseeing', name: 'Sightseeing' },
  { id: 'wildlife', name: 'Wildlife' },
  { id: 'private', name: 'Private Tours' }
];

export async function addTours() {
  try {
    console.log('Adding new tours to database...');

    // Insert tour types
    for (const type of tourTypes) {
      const { error: typeError } = await supabase
        .from('tour_types')
        .upsert(type, { onConflict: 'id' });

      if (typeError) {
        console.error(`Error inserting tour type ${type.id}:`, typeError);
        throw typeError;
      }
    }

    console.log('Successfully inserted tour types');

    // Insert tours
    for (const tour of newTourData) {
      const { error: tourError } = await supabase
        .from('tours')
        .upsert(tour, { onConflict: 'id' });

      if (tourError) {
        console.error(`Error inserting tour ${tour.id}:`, tourError);
        throw tourError;
      }
    }

    console.log('Successfully inserted new tours');
    return { success: true, message: 'Successfully added new tours to database' };
  } catch (error) {
    console.error('Error adding tours to database:', error);
    return { success: false, message: 'Error adding tours to database', error };
  }
}
