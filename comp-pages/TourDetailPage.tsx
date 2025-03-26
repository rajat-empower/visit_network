import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toursAPI } from '@/utils/api';
import PageTitle from '../components/PageTitle';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  duration: string | null;
  booking_link: string | null;
  city_id: string;
  tour_type_id?: string | null;
  is_featured?: boolean;
  rating?: number | null;
  included?: string | null;
  policy?: string | null;
  additional?: string | null;
  cities?: {
    name: string;
  } | null;
  tour_types?: {
    name: string;
  } | null;
}

interface TourType {
  id: string;
  name: string;
}

interface TourDetailPageProps {
  tourName: string;
}

// Helper function to create URL-friendly slugs
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
    .trim();                  // Trim leading/trailing spaces or hyphens
};

// Function to convert URL slugs back to a format for database query
const formatNameForQuery = (slug: string): string => {
  // This is a simplified approach - in a real app, you might need a more robust solution
  // such as storing slugs in the database or using a slug library
  return slug.replace(/-/g, ' ');
};

const TourDetailPage: React.FC<TourDetailPageProps> = ({ tourName }) => {
  console.log('Tour name is', tourName);
  const { name } = useParams<{ name: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        
        if (!name) {
          setError('Tour name is required');
          setLoading(false);
          return;
        }
        
        // Use the API utility instead of direct Supabase call
        const response = await toursAPI.getTourByName(name);
        
        if (response && typeof response === 'object' && 'data' in response) {
          console.log('Tour data:', response.data);
          setTour(response.data as Tour);
        } else {
          setError('Tour not found.');
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        setError('Failed to load tour details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
    fetchTourTypes(); 
  }, [name]);

  const fetchTourTypes = async () => {
    try {
      const response = await toursAPI.getTourTypes();
      
      if (response && typeof response === 'object' && 'data' in response) {
        setTourTypes(response.data as TourType[]);
      } else {
        console.error('Error fetching tour types: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching tour types:', error);
    }
  };

  const toggleAccordion = (section: string) => {
    if (openAccordion === section) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(section);
    }
  };

  if (loading) return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </main>
  );

  if (!tour) return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
        <p className="mb-6">{error}</p>
        <Link href="/tours" className="text-blue-600 hover:underline">
          Browse all tours
        </Link>
      </div>
    </main>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/tours" className="hover:text-blue-600">Tours</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{tour.name}</span>
      </div>

      <PageTitle title={tour.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {tour.image_url && (
            <img
              src={tour.image_url}
              alt={tour.name}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>
          
          {/* Rating below title */}
          {tour.rating && (
            <div className="mt-2 mb-4 flex items-center">
              <div className="flex">
                {(() => {
                  const ratingNum = typeof tour.rating === 'string'
                    ? parseFloat(tour.rating)
                    : tour.rating;

                  if (isNaN(ratingNum)) return null;

                  const fullStars = Math.floor(ratingNum);
                  const hasHalfStar = ratingNum % 1 > 0;
                  const emptyStars = 5 - Math.ceil(ratingNum);

                  return (
                    <>
                      {[...Array(fullStars)].map((_, i) => (
                        <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={20} />
                      ))}
                      {hasHalfStar && (
                        <Star key="half" className="text-yellow-400 fill-yellow-400" size={20} />
                      )}
                      {[...Array(emptyStars)].map((_, i) => (
                        <Star key={`empty-${i}`} className="text-gray-300" size={20} />
                      ))}
                    </>
                  );
                })()}
              </div>
              <span className="ml-2 text-gray-700">
                {typeof tour.rating === 'string'
                  ? parseFloat(tour.rating).toFixed(1)
                  : typeof tour.rating === 'number'
                    ? tour.rating.toFixed(1)
                    : '0.0'} out of 5
              </span>
            </div>
          )}
          
          <p className="text-gray-600 mb-8">{tour.description}</p>

          {/* Accordion Sections */}
          <div className="space-y-4 mb-8">
            {/* Included */}
            <div className="border rounded-md overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleAccordion('included')}
              >
                <h3 className="text-lg font-semibold">Included</h3>
                {openAccordion === 'included' ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {openAccordion === 'included' && (
                <div className="p-4">
                  <p className="text-gray-600">
                    {tour.included
                      ? tour.included.split(',').map((item, index) => (
                          <React.Fragment key={index}>
                           - {item.trim()}
                            <br />
                          </React.Fragment>
                        ))
                      : 'Not specified'}
                  </p>
                </div>
              )}
            </div>

            {/* Policy */}
            <div className="border rounded-md overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleAccordion('policy')}
              >
                <h3 className="text-lg font-semibold">Policy</h3>
                {openAccordion === 'policy' ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {openAccordion === 'policy' && (
                <div className="p-4">
                  <p className="text-gray-600">
                    {tour.policy
                      ? tour.policy.split(',').map((item, index) => (
                          <React.Fragment key={index}>
                            - {item.trim()}
                            <br />
                          </React.Fragment>
                        ))
                      : 'Not specified'}
                  </p>
                </div>
              )}
            </div>

            {/* Additional */}
            <div className="border rounded-md overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleAccordion('additional')}
              >
                <h3 className="text-lg font-semibold">Additional Information</h3>
                {openAccordion === 'additional' ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {openAccordion === 'additional' && (
                <div className="p-4">
                  <p className="text-gray-600">
                    {tour.additional
                      ? tour.additional.split(',').map((item, index) => (
                          <React.Fragment key={index}>
                            - {item.trim()}
                            <br />
                          </React.Fragment>
                        ))
                      : 'Not specified'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Check Latest Price Button */}
            <a
              href={tour.booking_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center block font-bold"
            >
              Check Latest Price
            </a>

            {/* Price */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tour Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tour.price && (
                  <div className="flex items-center">
                    <span className="font-bold">Price:</span>
                    <span className="ml-2">€{tour.price}</span>
                  </div>
                )}
                {tour.duration && (
                  <div className="flex items-center">
                    <span className="font-bold">Duration:</span>
                    <span className="ml-2">{tour.duration}</span>
                  </div>
                )}
                {tour.cities?.name && (
                  <div className="flex items-center">
                    <span className="font-bold">Location:</span>
                    <span className="ml-2">{tour.cities.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tour Type */}
            {tour.tour_types && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tour Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <span>{tour.tour_types.name}</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TourDetailPage;
