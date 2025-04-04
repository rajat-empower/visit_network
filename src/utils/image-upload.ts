import axios from 'axios';
import { supabase } from '../config/supabase';

export async function uploadImageToCDN(imageUrl: string): Promise<string> {
  try {
    // Download image from URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Generate unique filename
    const filename = `tour-images/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('public')
      .upload(filename, buffer, {
        contentType: response.headers['content-type'],
        cacheControl: '3600'
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image to CDN:', error);
    throw error;
  }
} 