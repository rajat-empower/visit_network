import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { citiesAPI, toursAPI, placesAPI } from '@/utils/api';
import { getCityImageUrl } from "@/utils/images";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import PageTitle from "@/components/PageTitle";
import GoogleMap from "@/components/GoogleMap";
import Sidebar from "@/components/common/Sidebar";
import TourCard from "@/components/TourCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Utensils, Compass, Bus, Info, Hotel, Camera } from "lucide-react";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyCFk3T1cfkx3THAdOkUfJIQqUVFbyDVnw8";

// Add interfaces for our data types
interface City {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  region?: string;
  [key: string]: any; // For other properties
}

interface Tour {
  id: string;
  name: string;
  image_url?: string;
  price?: number;
  tour_type?: any;
}

interface Place {
  id: string;
  name: string;
  image_url?: string;
}

interface CityApiResponse {
  city: City;
  tours: Tour[];
  places: Place[];
}

const CityDetails = () => {
  const { name } = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
 
  useEffect(() => {
    const fetchCity = async () => {
      if (!name) {
        setError("No city name provided");
        setLoading(false);
        return;
      }
      
      // Decode the URL parameter to handle spaces and special characters
      const decodedName = decodeURIComponent(name as string);
      
      try {
        // Use the API utility instead of direct Supabase call
        const response = await citiesAPI.getCityByName(decodedName);
        
        if (response && typeof response === 'object') {
          const cityResponse = response as CityApiResponse;
          const cityData = cityResponse.city;
          const toursData = cityResponse.tours || [];
          const placesData = cityResponse.places || [];
          
          if (!cityData) {
            setError("City not found");
            setLoading(false);
            return;
          }
          
          setCity(cityData);
          
          // Set tours data
          setTours(toursData.map((tour: Tour) => ({
            id: tour.id,
            title: tour.name,
            gallery: [tour.image_url || '/placeholder.svg'],
            rating: 4.5, // Default rating since tours table doesn't have a rating column
            price: tour.price,
            tour_url: `/tours/${tour.name.toLowerCase().replace(/\s+/g, '-')}`
          })));
          
          // Set hotels data
          setHotels(placesData.map((place: Place) => ({
            id: place.id,
            title: place.name,
            gallery: [place.image_url || '/placeholder.svg'],
            rating_standard: 4.0, // Default rating since places_to_stay table doesn't have a rating column
            hotel_url: `/places-to-stay/${cityData.name.toLowerCase().replace(/\s+/g, '-')}/${place.name.toLowerCase().replace(/\s+/g, '-')}`
          })));
        } else {
          setError("City not found");
        }
      } catch (err) {
        console.error('Error:', err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [name]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <PageTitle title="Error" description="An error occurred while loading the city details" />
      <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
            <Link href="/cities" className="text-red-600 hover:text-red-700">
              Back to Cities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-[50px]">
      <PageTitle title={city?.name || 'City Details'} description={`Explore ${city?.name || 'this city'} in Slovenia`} />
        <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-[#888888] hover:text-[#ea384c]">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/cities" className="text-[#888888] hover:text-[#ea384c]">Cities</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[#888888]">{city?.name || 'Loading...'}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {loading ? (
          <Skeleton className="h-[400px] w-full mb-8" />
        ) : city && (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="relative h-[500px] mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={getCityImageUrl(city)} 
                    alt={city.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-8 text-white">
                      <h1 className="text-5xl font-bold mb-2">{city.name}</h1>
                      <p className="text-xl">{city.type} • {city.region}</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-wrap gap-6 justify-between">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Population</p>
                    <p className="text-xl font-bold">{city.population || '25,000'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Elevation</p>
                    <p className="text-xl font-bold">{city.elevation || '350 m'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Area</p>
                    <p className="text-xl font-bold">{city.area || '163.8 km²'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Founded</p>
                    <p className="text-xl font-bold">{city.founded || '1144'}</p>
                  </div>
                </div>

                {/* Tabbed Navigation */}
                <Tabs defaultValue="overview" className="mb-16">
                  <TabsList className="grid grid-cols-4 md:grid-cols-7 mb-8">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <Info size={16} /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="attractions" className="flex items-center gap-2">
                      <Camera size={16} /> Attractions
                    </TabsTrigger>
                    <TabsTrigger value="food" className="flex items-center gap-2">
                      <Utensils size={16} /> Food & Drink
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="flex items-center gap-2">
                      <Compass size={16} /> Activities
                    </TabsTrigger>
                    <TabsTrigger value="accommodation" className="flex items-center gap-2">
                      <Hotel size={16} /> Accommodation
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center gap-2">
                      <Calendar size={16} /> Events
                    </TabsTrigger>
                    <TabsTrigger value="transport" className="flex items-center gap-2">
                      <Bus size={16} /> Transport
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-8">
                    <div className="prose max-w-none">
                      <h2 className="text-2xl font-bold mb-4">About {city.name}</h2>
                      <p className="text-gray-600 whitespace-pre-line">{city.description}</p>
                      <p className="text-gray-600 whitespace-pre-line">
                        {city.extended_description || 
                        `${city.name} is one of Slovenia's most charming destinations, offering visitors a perfect blend of history, culture, and natural beauty. The city's rich heritage dates back centuries, with influences from various European cultures visible in its architecture and traditions.
                        
                        Visitors to ${city.name} can enjoy a relaxed atmosphere while exploring cobblestone streets, historic buildings, and picturesque surroundings. The local community is known for its hospitality and preservation of authentic Slovenian traditions.`}
                      </p>
                    </div>
                    
                    {/* Google Map */}
                    {city.latitude && city.longitude ? (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Location</h2>
                        <GoogleMap 
                          latitude={city.latitude} 
                          longitude={city.longitude} 
                          apiKey={GOOGLE_MAPS_API_KEY}
                          zoom={13}
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Location</h2>
                        <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center">
                          <p className="text-gray-500">Map location not available</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Weather & Climate */}
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Weather & Climate</h2>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {['Spring', 'Summer', 'Autumn', 'Winter'].map((season) => (
                          <Card key={season} className="shadow-sm">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{season}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600">
                                {season === 'Spring' && 'Mild temperatures with occasional rain. 10-20°C.'}
                                {season === 'Summer' && 'Warm and sunny. 20-30°C with occasional thunderstorms.'}
                                {season === 'Autumn' && 'Cool and colorful. 5-15°C with some rainfall.'}
                                {season === 'Winter' && 'Cold with possible snow. -5 to 5°C.'}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Attractions Tab */}
                  <TabsContent value="attractions" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Top Attractions in {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            name: `${city.name} Castle`,
                            description: `Perched on a hill overlooking the city, this medieval castle offers stunning views and houses a fascinating museum.`,
                            image: 'https://visitslovenia.b-cdn.net/uploads/cities/ljubjana.jpg'
                          },
                          {
                            name: `Old Town Square`,
                            description: `The historic heart of ${city.name} with beautiful architecture, cafes, and local shops.`,
                            image: 'https://visitslovenia.b-cdn.net/uploads/cities/piran.jpg'
                          },
                          {
                            name: `City Museum`,
                            description: `Explore the rich history of ${city.name} through interactive exhibits and precious artifacts.`,
                            image: 'https://visitslovenia.b-cdn.net/uploads/cities/lake-bled-slovenia.jpg'
                          },
                          {
                            name: `Central Park`,
                            description: `A beautiful green space perfect for relaxation, picnics, and outdoor activities.`,
                            image: 'https://visitslovenia.b-cdn.net/uploads/cities/ljubjana.jpg'
                          }
                        ].map((attraction, index) => (
                          <Card key={index} className="overflow-hidden shadow-sm">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={attraction.image} 
                                alt={attraction.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                              <p className="text-gray-600">{attraction.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Hidden Gems</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          `Secret Viewpoint - A lesser-known spot with panoramic views of ${city.name}.`,
                          `Local Craft Workshop - Where you can see traditional crafts being made.`,
                          `Historic Courtyard - A peaceful spot hidden behind the main streets.`
                        ].map((gem, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <p className="text-gray-600">{gem}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Food & Drink Tab */}
                  <TabsContent value="food" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Local Specialties</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            name: 'Kranjska Klobasa',
                            description: 'Traditional Slovenian sausage with a rich flavor and distinctive texture.',
                            image: 'https://visitslovenia.b-cdn.net/uploads/cities/ljubjana.jpg'
                          },
                          {
                            name: 'Potica',
                            description: 'A rolled pastry with various fillings, commonly walnuts, tarragon, or poppy seeds.',
                            image: 'https://visitslovenia.b-cdn.net/uploads/cities/piran.jpg'
                          },
                          {
                            name: 'Štruklji',
                            description: 'Rolled dumplings that can be either sweet or savory, a staple of Slovenian cuisine.',
                            image: 'https://visitslovenia.b-cdn.net/uploads/cities/lake-bled-slovenia.jpg'
                          }
                        ].map((food, index) => (
                          <Card key={index} className="overflow-hidden shadow-sm">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={food.image} 
                                alt={food.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="text-xl font-bold mb-2">{food.name}</h3>
                              <p className="text-gray-600">{food.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Recommended Restaurants</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            name: 'Traditional House',
                            description: 'Authentic Slovenian cuisine in a cozy atmosphere.',
                            type: 'Traditional',
                            priceRange: '€€'
                          },
                          {
                            name: 'Modern Bistro',
                            description: 'Contemporary takes on local favorites with seasonal ingredients.',
                            type: 'Modern Slovenian',
                            priceRange: '€€€'
                          },
                          {
                            name: 'Local Tavern',
                            description: 'Hearty meals and local wines in a rustic setting.',
                            type: 'Tavern',
                            priceRange: '€'
                          },
                          {
                            name: 'Riverside Café',
                            description: 'Light meals and excellent coffee with beautiful views.',
                            type: 'Café',
                            priceRange: '€'
                          }
                        ].map((restaurant, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-500">{restaurant.type}</span>
                                <span className="text-sm font-semibold">{restaurant.priceRange}</span>
                              </div>
                              <p className="text-gray-600">{restaurant.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Activities Tab */}
                  <TabsContent value="activities" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Outdoor Activities</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            name: 'Hiking Trails',
                            description: `Explore the beautiful nature surrounding ${city.name} on well-marked trails.`,
                            difficulty: 'Various'
                          },
                          {
                            name: 'Cycling Routes',
                            description: 'Scenic bike paths for all levels of cyclists.',
                            difficulty: 'Easy to Moderate'
                          },
                          {
                            name: 'River Activities',
                            description: 'Kayaking, rafting, or paddleboarding on nearby waters.',
                            difficulty: 'Moderate'
                          },
                          {
                            name: 'Nature Walks',
                            description: 'Guided walks to discover local flora and fauna.',
                            difficulty: 'Easy'
                          }
                        ].map((activity, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <h3 className="text-xl font-bold mb-1">{activity.name}</h3>
                              <div className="mb-2">
                                <span className="text-sm text-gray-500">Difficulty: {activity.difficulty}</span>
                              </div>
                              <p className="text-gray-600">{activity.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Available Tours in {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tours.length > 0 ? (
                          tours.map((tour) => (
                            <Card key={tour.id} className="overflow-hidden group shadow-sm">
                              <div className="overflow-hidden">
                                <img
                                  src={tour.gallery[0] || '/placeholder.svg'}
                                  alt={tour.title}
                                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <CardContent>
                                <CardTitle className="text-lg font-bold text-red-500 mt-3">
                                  {tour.title}
                                </CardTitle>
                                <div className="flex items-center text-gray-600 mb-5">
                                  <span className="mr-4">€{tour.price}</span>
                                  <span>1-3 hours</span>
                                </div>
                                <div className="mt-4 pt-4">
                                  <Link
                                    href={tour.tour_url}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                  >
                                    View Tour
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="col-span-3 text-gray-500 text-center py-8">No tours available at this time.</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Day Trips from {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            name: 'Nearby Village',
                            description: 'A charming village just 30 minutes away with traditional architecture.',
                            distance: '30 min drive'
                          },
                          {
                            name: 'Mountain Viewpoint',
                            description: 'Spectacular panoramic views after a scenic drive.',
                            distance: '45 min drive'
                          },
                          {
                            name: 'Local Winery',
                            description: 'Tour and tastings at a family-owned vineyard.',
                            distance: '20 min drive'
                          },
                          {
                            name: 'Historic Site',
                            description: 'Ancient ruins with significant historical importance.',
                            distance: '1 hour drive'
                          }
                        ].map((trip, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <h3 className="text-xl font-bold mb-1">{trip.name}</h3>
                              <div className="mb-2">
                                <span className="text-sm text-gray-500">{trip.distance}</span>
                              </div>
                              <p className="text-gray-600">{trip.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Accommodation Tab */}
                  <TabsContent value="accommodation" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Places to Stay in {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {hotels.length > 0 ? (
                          hotels.map((hotel) => (
                            <Card key={hotel.id} className="overflow-hidden group shadow-sm">
                              <div className="overflow-hidden">
                                <img
                                  src={hotel.gallery[0] || '/placeholder.svg'}
                                  alt={hotel.title}
                                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <CardContent>
                                <CardTitle className="text-lg font-bold text-red-500 mt-3 flex justify-between items-start">
                                  <span>{hotel.title}</span>
                                  <span className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 text-sm text-gray-600">{hotel.rating_standard}</span>
                                  </span>
                                </CardTitle>
                                <p className="text-gray-600 mb-5">Beautiful accommodation in {city.name}</p>
                                <div className="mt-4 pt-4">
                                  <Link
                                    href={hotel.hotel_url}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                  >
                                    View Details
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="col-span-3 text-gray-500 text-center py-8">No accommodations available at this time.</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Accommodation Types</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            type: 'Hotels',
                            description: 'From luxury to budget-friendly options in the city center and surroundings.'
                          },
                          {
                            type: 'Apartments',
                            description: 'Self-catering accommodations perfect for families or longer stays.'
                          },
                          {
                            type: 'Guesthouses',
                            description: 'Experience local hospitality in family-run establishments.'
                          },
                          {
                            type: 'Boutique Hotels',
                            description: 'Unique, stylish accommodations with personalized service.'
                          },
                          {
                            type: 'Hostels',
                            description: 'Budget-friendly options for backpackers and solo travelers.'
                          },
                          {
                            type: 'Rural Retreats',
                            description: 'Farm stays and countryside accommodations for a peaceful getaway.'
                          }
                        ].map((accomm, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">{accomm.type}</h3>
                              <p className="text-sm text-gray-600">{accomm.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Events Tab */}
                  <TabsContent value="events" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Annual Festivals & Events</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            name: `${city.name} Summer Festival`,
                            description: 'A celebration of music, art, and culture throughout the summer months.',
                            date: 'June - August'
                          },
                          {
                            name: 'Wine Harvest Festival',
                            description: 'Celebrating the local wine production with tastings and traditional food.',
                            date: 'September'
                          },
                          {
                            name: 'Christmas Market',
                            description: 'Festive stalls selling crafts, gifts, and seasonal treats.',
                            date: 'December'
                          },
                          {
                            name: 'Spring Cultural Week',
                            description: 'A week of performances, exhibitions, and cultural events.',
                            date: 'April'
                          }
                        ].map((event, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                              <div className="mb-2">
                                <span className="text-sm text-gray-500">{event.date}</span>
                              </div>
                              <p className="text-gray-600">{event.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                      <Card className="shadow-sm">
                        <CardContent className="p-6">
                          <p className="text-gray-600 italic">
                            Check back later for upcoming events in {city.name} or visit the official city tourism website for the latest event calendar.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {/* Transport Tab */}
                  <TabsContent value="transport" className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Getting to {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          {
                            method: 'By Car',
                            description: `${city.name} is easily accessible by car from major Slovenian cities. The drive from Ljubljana takes approximately 1 hour.`,
                            tips: 'Parking is available in the city center and at most attractions.'
                          },
                          {
                            method: 'By Bus',
                            description: 'Regular bus services connect major cities to ' + city.name + '.',
                            tips: 'The main bus station is located in the city center.'
                          },
                          {
                            method: 'By Train',
                            description: 'Train services are available from Ljubljana and other major cities.',
                            tips: 'The train station is a short walk from the city center.'
                          },
                          {
                            method: 'By Plane',
                            description: 'The nearest airport is Ljubljana Jože Pučnik Airport, approximately 30-60 minutes away by car.',
                            tips: 'Airport shuttles and taxis are available.'
                          }
                        ].map((transport, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <h3 className="text-xl font-bold mb-1">{transport.method}</h3>
                              <p className="text-gray-600 mb-2">{transport.description}</p>
                              <p className="text-sm text-gray-500">{transport.tips}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Getting Around {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            method: 'Walking',
                            description: 'The city center is compact and easily explored on foot.'
                          },
                          {
                            method: 'Public Transport',
                            description: 'Local buses serve the city and surrounding areas.'
                          },
                          {
                            method: 'Bicycle Rental',
                            description: 'Bike rentals are available for exploring the city and nearby trails.'
                          },
                          {
                            method: 'Taxi',
                            description: 'Taxis are readily available and can be booked by phone or app.'
                          },
                          {
                            method: 'Car Rental',
                            description: 'Rental cars are available for exploring the wider region.'
                          },
                          {
                            method: 'Guided Tours',
                            description: 'Various guided tours offer transportation to key attractions.'
                          }
                        ].map((transport, index) => (
                          <Card key={index} className="shadow-sm">
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">{transport.method}</h3>
                              <p className="text-sm text-gray-600">{transport.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Sidebar 
                showWeatherWidget={true}
                showTourCategories={false}
                showTravelGuides={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CityDetails;
