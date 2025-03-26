// "use server"
import { supabase } from "@/integrations/supabase/client";

interface City {
  id: string;
  image_url?: string | null;
}

export const getCityImageUrl = (city: City): string => {
  if (!city.image_url) return '/placeholder.svg';
  return city.image_url;
};

export const uploadCityImage = async (cityId: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) throw new Error("Invalid file type");
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('lovable-uploads')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('lovable-uploads')
      .getPublicUrl(filePath);

    const fullPublicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from('cities')
      .update({ image_url: fullPublicUrl })
      .eq('id', cityId);

    if (updateError) throw updateError;

    return fullPublicUrl;
  } catch (error) {
    console.error('Error in uploadCityImage:', error);
    throw error;
  }
};

export const uploadPlaceImage = async (placeId: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) throw new Error("Invalid file type");
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('lovable-uploads')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('lovable-uploads')
      .getPublicUrl(filePath);

    const fullPublicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from('places_to_stay')
      .update({ image_url: fullPublicUrl })
      .eq('id', placeId);

    if (updateError) throw updateError;

    return fullPublicUrl;
  } catch (error) {
    console.error('Error in uploadPlaceImage:', error);
    throw error;
  }
};
