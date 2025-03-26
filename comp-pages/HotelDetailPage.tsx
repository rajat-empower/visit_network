import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { hotelsAPI, articlesAPI } from '@/utils/api';
import PageTitle from '../components/PageTitle';
import GoogleMap from '../components/GoogleMap';
import WeatherWidget from '../components/WeatherWidget';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Star, ChevronDown, ChevronUp, ThumbsUp } from 'lucide-react';
import TourCard from '@/components/TourCard';

interface Hotel {
  id: string;
  name: string;
  image_url: string | null;
  website_url: string | null;
  zen_url: string | null;
  bcom_url: string | null;
  hotelscom_url: string | null;
  description: string | null;
  address: string | null;
  city_id: string;
  place_type_id: string;
  contact_email: string | null;
  price_range: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  facilities: string[] | null;
  highlight1: string | null;
  highlight2: string | null;
  highlight3: string | null;
  nearby_attractions: Record<string, string> | Array<{name: string, distance: string}> | null;
  nearby_restaurants: Record<string, string> | Array<{name: string, distance: string}> | null;
  transportation_options: Record<string, string> | Array<{name: string, distance: string}> | null;
  city: {
    name: string;
  } | null;
  type: {
    name: string;
  } | null;
}

interface Article {
  id: number;
  title: string;
  content?: string;
  feature_img?: string;
  author?: string;
  tags?: string;
  created_at?: string;
  category_id?: number;
  category?: {
    uuid: number;
    category: string;
  };
  slug?: string;
  excerpt?: string;
  image?: string;
}

// Define sample articles data at the top level
const sampleArticles: Article[] = [
  {
    id: 1,
    title: "Slovenia Visa and Entry Requirements for European Getaway",
    excerpt: "Discover the requirements for a seamless European getaway",
    feature_img: "https://visitslovenia.b-cdn.net/uploads/articles/slovenia-visa-requirements.jpg",
    slug: "travel-tips/slovenia-visa-requirements",
    content: "Discover the requirements for a seamless European getaway"
  },
  {
    id: 2,
    title: "Top 10 Must-Visit Destinations in Slovenia",
    excerpt: "Explore the most beautiful places Slovenia has to offer",
    feature_img: "https://visitslovenia.b-cdn.net/uploads/articles/top-destinations-slovenia.jpg",
    slug: "travel-guides/top-destinations-slovenia",
    content: "Explore the most beautiful places Slovenia has to offer"
  },
  {
    id: 3,
    title: "Slovenian Cuisine: A Culinary Journey",
    excerpt: "Taste the flavors of Slovenia's traditional dishes",
    feature_img: "https://visitslovenia.b-cdn.net/uploads/articles/slovenian-cuisine.jpg",
    slug: "food-and-drink/slovenian-cuisine",
    content: "Taste the flavors of Slovenia's traditional dishes"
  }
];

// Function to convert spaces to hyphens for URL
const formatNameForUrl = (name: string): string => {
  return name.replace(/\s+/g, '-');
};

// Function to convert hyphens to spaces for database query
const formatNameForQuery = (name: string): string => {
  return name.replace(/-+/g, ' ');
};

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyCFk3T1cfkx3THAdOkUfJIQqUVFbyDVnw8";

export default function HotelDetailPage() {
  const { city, name } = useParams<{ city: string; name: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [relatedTours, setRelatedTours] = useState<any[]>([]);
  const [toursLoading, setToursLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // Fetch articles for the sidebar
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const response = await articlesAPI.getArticles({ limit: 3 });
        
        if (response && typeof response === 'object' && 'articles' in response) {
          setArticles(response.articles as Article[]);
        } else {
          console.error('Invalid response format from API');
          setArticles(sampleArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles(sampleArticles);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!name || !city) {
        setLoading(false);
        setToursLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setToursLoading(true);
        
        // Use the API utility instead of direct Supabase calls
        const response = await hotelsAPI.getHotelByName(city, name);
        
        if (response && typeof response === 'object' && 'data' in response) {
          setHotel(response.data as Hotel);
          
          // Set related tours if available
          if ('relatedTours' in response && Array.isArray(response.relatedTours)) {
            setRelatedTours(response.relatedTours);
          }
        } else {
          console.error('Invalid response format from API');
        }
      } catch (error) {
        console.error('Error fetching hotel:', error);
      } finally {
        setLoading(false);
        setToursLoading(false);
      }
    };

    fetchHotel();
  }, [name, city]);

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

  if (!hotel) return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-6">We couldn't find the property you're looking for.</p>
        <Link href="/places-to-stay" className="text-blue-600 hover:underline">
          Browse all places to stay
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
        {hotel.city && (
          <>
            <Link href={`/cities/${formatNameForUrl(hotel.city.name)}`} className="hover:text-blue-600">
              {hotel.city.name}
            </Link>
            <span className="mx-2">›</span>
          </>
        )}
        {hotel.type && (
          <>
            <span className="hover:text-blue-600">{hotel.type.name}</span>
            <span className="mx-2">›</span>
          </>
        )}
        <span className="text-gray-700">{hotel.name}</span>
      </div>
      
      <PageTitle title={hotel.name} />
      
      {/* Address below title */}
      {hotel.address && (
        <div className="mb-6 text-sm text-gray-600 flex items-center">
          <MapPin size={16} className="mr-1" />
          <span>{hotel.address}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {hotel.image_url && (
            <img 
              src={hotel.image_url} 
              alt={hotel.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
          
          {/* Rating above description */}
          {hotel.rating && (
            <div className="mt-6 mb-2 flex items-center">
              <div className="flex">
                {(() => {
                  // Convert rating to number if it's a string
                  const ratingNum = typeof hotel.rating === 'string' 
                    ? parseFloat(hotel.rating) 
                    : hotel.rating;
                  
                  // Only proceed if we have a valid number
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
                {typeof hotel.rating === 'string' 
                  ? parseFloat(hotel.rating).toFixed(1) 
                  : typeof hotel.rating === 'number' 
                    ? hotel.rating.toFixed(1) 
                    : '0.0'} out of 5
              </span>
            </div>
          )}
          
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">About {hotel.name}</h2>
            <p className="text-gray-600 mb-8">{hotel.description}</p>
            
            {/* Google Map - Full width */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Location</h3>
              {hotel.latitude && hotel.longitude ? (
                <GoogleMap 
                  latitude={hotel.latitude} 
                  longitude={hotel.longitude} 
                  apiKey={GOOGLE_MAPS_API_KEY}
                  zoom={15}
                  className="w-full h-[400px] rounded-lg overflow-hidden"
                />
              ) : (
                // Fallback with sample coordinates for Ljubljana
                <GoogleMap 
                  latitude={46.0569} 
                  longitude={14.5058} 
                  apiKey={GOOGLE_MAPS_API_KEY}
                  zoom={15}
                  className="w-full h-[400px] rounded-lg overflow-hidden"
                />
              )}
            </div>
            
            {/* Most Popular Facilities */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Most Popular Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.facilities?.map((facility: string, index: number) => (
                  <div key={index} className="flex items-center bg-gray-50 p-3 rounded-md">
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Accordion Sections */}
            <div className="space-y-4 mb-8">
              {/* What's Nearby */}
              <div className="border rounded-md overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAccordion('nearby')}
                >
                  <h3 className="text-lg font-semibold">What's Nearby</h3>
                  {openAccordion === 'nearby' ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {openAccordion === 'nearby' && (
                  <div className="p-4">
                    <ul className="space-y-2">
                      {hotel.nearby_attractions ? (
                        Array.isArray(hotel.nearby_attractions) ? (
                          hotel.nearby_attractions.map((attraction, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{attraction.name}</span>
                              <span className="text-gray-500">{attraction.distance}</span>
                            </li>
                          ))
                        ) : (
                          Object.entries(hotel.nearby_attractions).map(([name, distance], index) => (
                            <li key={index} className="flex justify-between">
                              <span>{name}</span>
                              <span className="text-gray-500">{String(distance)}</span>
                            </li>
                          ))
                        )
                      ) : null}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Getting Around */}
              <div className="border rounded-md overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAccordion('transportation')}
                >
                  <h3 className="text-lg font-semibold">Getting Around</h3>
                  {openAccordion === 'transportation' ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {openAccordion === 'transportation' && (
                  <div className="p-4">
                    <ul className="space-y-2">
                      {hotel.transportation_options ? (
                        Array.isArray(hotel.transportation_options) ? (
                          hotel.transportation_options.map((option, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{option.name}</span>
                              <span className="text-gray-500">{option.distance}</span>
                            </li>
                          ))
                        ) : (
                          Object.entries(hotel.transportation_options).map(([name, distance], index) => (
                            <li key={index} className="flex justify-between">
                              <span>{name}</span>
                              <span className="text-gray-500">{String(distance)}</span>
                            </li>
                          ))
                        )
                      ) : null}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Restaurants */}
              <div className="border rounded-md overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAccordion('restaurants')}
                >
                  <h3 className="text-lg font-semibold">Restaurants</h3>
                  {openAccordion === 'restaurants' ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {openAccordion === 'restaurants' && (
                  <div className="p-4">
                    <ul className="space-y-2">
                      {hotel.nearby_restaurants ? (
                        Array.isArray(hotel.nearby_restaurants) ? (
                          hotel.nearby_restaurants.map((restaurant, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{restaurant.name}</span>
                              <span className="text-gray-500">{restaurant.distance}</span>
                            </li>
                          ))
                        ) : (
                          Object.entries(hotel.nearby_restaurants).map(([name, distance], index) => (
                            <li key={index} className="flex justify-between">
                              <span>{name}</span>
                              <span className="text-gray-500">{String(distance)}</span>
                            </li>
                          ))
                        )
                      ) : (
                        // Use sample data if no data in database
                        Object.entries(sampleRestaurants).map(([name, distance], index) => (
                          <li key={index} className="flex justify-between">
                            <span>{name}</span>
                            <span className="text-gray-500">{distance}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Book Now Button */}
            <a
              href={hotel.zen_url || hotel.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center block font-bold"
            >
              BOOK NOW
            </a>

            {/* Compare Rates */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Compare Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hotel.hotelscom_url && (
                  <div
                    style={{
                      backgroundColor: '#ebfdec',
                      padding: '10px',
                      borderRadius: '5px',
                      transition: 'background-color 0.3s',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                      height: '30px'
                    }}
                    onMouseEnter={(e: any) =>
                      (e.currentTarget.style.backgroundColor = '#d3f7d3')
                    }
                    onMouseLeave={(e: any) =>
                      (e.currentTarget.style.backgroundColor = '#ebfdec')
                    }
                  >
                    <a
                      href={hotel.hotelscom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 block"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <img
                        src="https://visitslovenia.b-cdn.net/uploads/theme/hotels_com.png"
                        alt="Hotels.com Logo"
                        style={{ width: '22px', height: '22px', marginRight: '5px' }}
                      />
                      We found a deal at Hotels.com
                    </a>
                  </div>
                )}
                {hotel.bcom_url && (
                  <div
                    style={{
                      backgroundColor: '#ebfdec',
                      padding: '10px',
                      borderRadius: '5px',
                      transition: 'background-color 0.3s',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', height: '30px'
                    }}
                    onMouseEnter={(e: any) =>
                      (e.currentTarget.style.backgroundColor = '#d3f7d3')
                    }
                    onMouseLeave={(e: any) =>
                      (e.currentTarget.style.backgroundColor = '#ebfdec')
                    }
                  >
                    <a
                      href={hotel.bcom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 block"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <img
                        src="https://visitslovenia.b-cdn.net/uploads/theme/booking_com.png"
                        alt="Booking.com Logo"
                        style={{ width: '22px', height: '22px', marginRight: '5px' }}
                      />
                      We found a deal at Booking.com
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Range */}
            {hotel.price_range && (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">€{hotel.price_range}</p>
                </CardContent>
              </Card>
            )}
            
            {/* Travel Guides */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Travel Guides</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingArticles ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ea384c]"></div>
                  </div>
                ) : articles.length > 0 ? (
                  <ul className="space-y-4">
                    {articles.map((article) => (
                      <li key={article.id} className="border-b border-gray-100 pb-2 last:border-0">
                        <Link 
                          href={`/travel-guides/${article.slug}`} 
                          className="text-[#888888] hover:text-[#ea384c] block"
                        >
                          {article.title}
                        </Link>
                        {article.excerpt && (
                          <p className="text-sm text-gray-500">{article.excerpt}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-4">
                    <li>
                      <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                        Best Time to Visit Slovenia: Seasonal Guide
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                        Top 10 Must-See Attractions in Slovenia
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                        Transportation Guide: Getting Around Slovenia
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                        Slovenia's Hidden Gems: Off the Beaten Path
                      </Link>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
            
            {/* Weather Widget */}
            <WeatherWidget />
          </div>
        </div>
      </div>
      
      {/* Highlights from Customers Section */}
      {hotel.highlight1 || hotel.highlight2 || hotel.highlight3 ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Highlights from Customers</h2>
          <ul className="list-none list-inside text-gray-600">
            {hotel.highlight1 && (
              <li className="flex items-start py-2 border-b border-gray-200 last:border-none">
                <ThumbsUp className="text-red-500 mr-2 mt-1" size={20} />
                {hotel.highlight1}
              </li>
            )}
            {hotel.highlight2 && (
              <li className="flex items-start py-2 border-b border-gray-200 last:border-none">
                <ThumbsUp className="text-red-500 mr-2 mt-1" size={20} />
                {hotel.highlight2}
              </li>
            )}
            {hotel.highlight3 && (
              <li className="flex items-start py-2 border-b border-gray-200 last:border-none">
                <ThumbsUp className="text-red-500 mr-2 mt-1" size={20} />
                {hotel.highlight3}
              </li>
            )}
          </ul>
        </div>
      ) : null}
      
      {/* Related Tours Section */}
      {hotel.city && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Tours and Activities in {hotel.city.name}</h2>
          
          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse mb-2 w-5/6"></div>
                    <div className="h-4 bg-gray-200 animate-pulse w-1/2 mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : relatedTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tours found for {hotel.city.name} at this time.</p>
          )}
        </div>
      )}
    </main>
  );
}

// Define sample restaurants data
const sampleRestaurants: Record<string, string> = {
  "Local Bistro": "0.3 km",
  "Riverside Café": "0.5 km",
  "Mountain View Restaurant": "1.2 km"
};

// Define sample attractions data
const sampleAttractions: Record<string, string> = {
  "City Museum": "0.5 km",
  "Central Park": "0.8 km",
  "Historic Castle": "1.5 km"
};

// Define sample transportation options data
const sampleTransportation: Record<string, string> = {
  "Bus Station": "0.3 km",
  "Train Station": "1.2 km",
  "Taxi Stand": "0.1 km"
};
