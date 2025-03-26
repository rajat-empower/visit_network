import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { placesAPI } from '@/utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './PlaceDetailPage.module.css';

interface PlaceDetails {
  id: string;
  name: string;
  description: string;
  location?: string;
  city?: {
    name: string;
  };
  rating?: number;
  price_range?: string;
  price_per_night?: number;
  image_url?: string;
  images?: string[];
  amenities?: string[];
  [key: string]: any; // For other properties
}

const PlaceDetailPage = () => {
  const { city, name } = useParams<{ city: string; name: string }>();
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!city || !name) {
        console.error('Missing city or name parameter');
        setLoading(false);
        return;
      }

      try {
        const decodedCity = decodeURIComponent(city as string);
        const decodedName = decodeURIComponent(name as string);
        
        const response = await placesAPI.getPlaceByName(decodedCity, decodedName);
        
        if (response && typeof response === 'object' && 'data' in response) {
          const placeData = response.data as PlaceDetails;
          
          if (!placeData.images && placeData.image_url) {
            placeData.images = [placeData.image_url];
          } else if (!placeData.images) {
            placeData.images = ['/placeholder.svg'];
          }
          
          if (!placeData.amenities) {
            placeData.amenities = [];
          }
          
          setPlace(placeData);
        } else {
          console.error('Invalid response format from API');
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [city, name]);

  if (loading) return <div>Loading...</div>;
  if (!place) return <div>Place not found</div>;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.mainContent}>
          <h1>{place.name}</h1>
          <div className={styles.imageGallery}>
            {place.images?.map((image: string, index: number) => (
              <img key={index} src={image} alt={`${place.name} ${index + 1}`} />
            ))}
          </div>
          <div className={styles.description}>
            <p>{place.description}</p>
            <p><strong>Location:</strong> {place.location || (place.city ? place.city.name : 'Slovenia')}</p>
            <p><strong>Rating:</strong> {place.rating || 4}/5</p>
            <p><strong>Price per night:</strong> ${place.price_per_night || (place.price_range ? place.price_range.split('-')[0] : '100')}</p>
            <div className={styles.amenities}>
              <h3>Amenities</h3>
              <ul>
                {place.amenities?.map((amenity: string, index: number) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <button className={styles.bookNowButton}>BOOK NOW</button>
          <div className={styles.priceBox}>
            <h3>${place.price_per_night}</h3>
            <span>per night</span>
          </div>
        </aside>
      </main>
      <Footer />
    </>
  );
};

export default PlaceDetailPage;
