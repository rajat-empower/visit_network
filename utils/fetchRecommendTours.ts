"use server"

import { supabase } from "@/integrations/supabase/client";

export async function fetchRecommendedTours() {
    try {
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            // .eq('is_featured', true)
            .order('name', { ascending: true })
            .limit(8);

        if (error) {
            console.error('Error fetching tours:', error);
            return;
        }
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
export async function fetchCategories() {
    const { data, error } = await supabase
      .from("article_categories")
      .select("*");

      if(error){
        console.error("Error fetching categories:", error);
        return;
      }

      return data;


  };

  export async function fetchTours() { 
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        cities (
          name
        )
      `);
  
    if (error) {
      console.error('Error fetching tours:', error);
    } else {
      const mappedTours = data.map((tour: any) => ({
        id: tour.id,
        name: tour.name,
        city_id: tour.city_id,
        cityName: tour.cities.name || "Unknown",
        price: tour.price ?? 0,
        rating: tour.rating ?? 0,
      }));
      return mappedTours;
    }
    
  };