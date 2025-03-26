import React, { useState, useEffect } from 'react';
import FeaturedTourCard from './FeaturedTourCard';
import Link from 'next/link';
import { fetchRecommendedTours } from '@/utils/fetchRecommendTours';

interface Tour {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  duration: string | null;
  booking_link: string | null;
  city_id: string;
  tour_type_id: string;
  is_featured: boolean | null;
  city?: string;
  rating?: number;
}

const RecommendedActivities: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      const tours = await fetchRecommendedTours();
      setTours(tours || []);
    };

    fetchTours();
  }, []);

  // Split tours into two rows
  const firstRow = tours.slice(0, 4);
  const secondRow = tours.slice(4, 8);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Recommended Slovenia Activities</h2>
        
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {firstRow.map((tour) => (
            <FeaturedTourCard
              key={tour.id}
              id={tour.id}
              name={tour.name}
              description={tour.description || ''}
              image_url={tour.image_url || '/placeholder.svg'}
              price={tour.price || 0}
              city="Ljubljana"
              rating={4}
              is_featured={tour.is_featured || undefined}
            />
          ))}
        </div>
        
        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {secondRow.map((tour) => (
            <FeaturedTourCard
              key={tour.id}
              id={tour.id}
              name={tour.name}
              description={tour.description || ''}
              image_url={tour.image_url || '/placeholder.svg'}
              price={tour.price || 0}
              city="Ljubljana"
              rating={4}
              is_featured={tour.is_featured || undefined}
            />
          ))}
        </div>
        
        {/* View All Link */}
        <div className="text-center mt-8">
          <Link 
            href="/tours" 
            className="inline-block bg-[#ea384c] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#d62d3f] transition-colors"
          >
            View All Tours & Activities
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecommendedActivities;
