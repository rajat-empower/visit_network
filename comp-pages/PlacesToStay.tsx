import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { placesAPI, citiesAPI } from '@/utils/api';
import { SearchFilters } from "@/components/places/SearchFilters";
import { PopularDestinations } from "@/components/places/PopularDestinations";
import Sidebar from "@/components/common/Sidebar";
import styles from "./PlacesToStay.module.css";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Define interfaces for type safety
interface City {
  id: string;
  name: string;
  image_url?: string;
}

interface PlaceType {
  id: string;
  name: string;
}

interface Place {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  city?: City;
  type?: PlaceType;
  price_range?: string;
  rating?: number;
  [key: string]: any; // For other properties
}

const PlacesToStay = () => {
  // Function to convert spaces to hyphens for URL
  const formatNameForUrl = (name?: string): string => {
    return name ? name.replace(/\s+/g, '-').toLowerCase() : 'unknown';
  };

  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState("2");
  const [destination, setDestination] = useState("all");
  const [accommodationType, setAccommodationType] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 12; // 4 rows x 3 cards
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);

  const { data: places = [], isLoading } = useQuery({
    queryKey: ["places-to-stay"],
    queryFn: async () => {
      // Use the API utility instead of direct Supabase call
      const response = await placesAPI.getPlaces();
      
      if (response && typeof response === 'object' && 'data' in response) {
        console.log("Places data:", response.data);
        return response.data as Place[];
      } else {
        console.error('Invalid response format from API');
        return [] as Place[];
      }
    },
  });

  // Update filteredPlaces when places data changes or filters are applied
  useEffect(() => {
    if (places && places.length > 0) {
      let filtered = [...places];
      
      // Apply destination filter if not "all"
      if (destination !== "all") {
        filtered = filtered.filter(place => 
          place.city?.name?.toLowerCase() === destination.toLowerCase()
        );
      }
      
      // Apply accommodation type filter if specified
      if (accommodationType) {
        filtered = filtered.filter(place => 
          place.type?.name?.toLowerCase() === accommodationType.toLowerCase()
        );
      }
      
      setFilteredPlaces(filtered);
      // Reset to first page when filters change
      setCurrentPage(1);
    }
  }, [places, destination, accommodationType]);

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      // Use the API utility instead of direct Supabase call
      const response = await citiesAPI.getCities();
      
      if (response && typeof response === 'object' && 'cities' in response) {
        console.log("Cities data:", response.cities);
        return response.cities as City[];
      } else {
        console.error('Invalid response format from API');
        return [] as City[];
      }
    },
  });

  const handleSearch = () => {
    console.log("Search params:", { destination, accommodationType, date, guests });
    // Apply filters based on search parameters
    if (places) {
      let filtered = [...places];
      
      // Apply destination filter if not "all"
      if (destination !== "all") {
        filtered = filtered.filter(place => 
          place.city?.name?.toLowerCase() === destination.toLowerCase()
        );
      }
      
      // Apply accommodation type filter if specified
      if (accommodationType) {
        filtered = filtered.filter(place => 
          place.type?.name?.toLowerCase() === accommodationType.toLowerCase()
        );
      }
      
      setFilteredPlaces(filtered);
      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#ea384c]">Places to Stay in Slovenia</h1>
        
        <SearchFilters
          destination={destination}
          setDestination={setDestination}
          accommodationType={accommodationType}
          setAccommodationType={setAccommodationType}
          date={date}
          setDate={setDate}
          guests={guests}
          setGuests={setGuests}
          cities={cities}
          onSearch={handleSearch}
        />

        <div className="prose max-w-none mb-12">
          <p className="text-gray-600 leading-relaxed">
            We have hand-picked a selection of the best places to stay in Slovenia. 
            We have a wide range of Slovenia hotels, apartments and more, to suit any budget or purpose. 
            We curate our content from leading hotel booking sites including Booking.com, Agoda.com and many more. 
            Click to the booking site for the best deal and instant online booking.
          </p>
        </div>

        <PopularDestinations cities={cities} />
        
        {/* Custom layout for this page */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold mb-8">Recommended Hotels and Apartments this Month</h2>
            
            {/* Display places with pagination */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Show loading placeholders
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
                ))
              ) : (
                filteredPlaces ? 
                  filteredPlaces
                    .slice((currentPage - 1) * placesPerPage, currentPage * placesPerPage)
                    .map((place) => (
                      <React.Fragment key={place.id}>
                        {/* Card layout matching the uploaded image */}
                        <Card className="overflow-hidden shadow-sm h-full flex flex-col group">
                          <div className="overflow-hidden">
                            <img
                              src={place.image_url || '/placeholder.svg'}
                              alt={place.name}
                              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <CardContent className="flex-1 flex flex-col p-4">
                            {/* Title and rating on the same line */}
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-bold text-[#ea384c]">{place.name}</h3>
                              <div className="flex items-center text-yellow-500">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span className="text-sm">4.5</span>
                              </div>
                            </div>
                            
                            {/* Location badge */}
                            <div className="mb-3">
                              <Link 
                                href={`/cities/${formatNameForUrl(place.city?.name)}`}
                                className="inline-block bg-[rgb(165,180,191)] hover:bg-[rgb(145,160,171)] text-white text-[0.8rem] font-bold px-3 py-1 rounded uppercase transition-colors duration-200"
                              >
                                {place.city?.name || 'Slovenia'}
                              </Link>
                            </div>
                            
                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4">
                              {place.description ? 
                                (place.description.length > 100 ? 
                                  `${place.description.substring(0, 100)}...` : 
                                  place.description) : 
                                `${place.name} are located in the centre of ${place.city?.name || 'Slovenia'} and are well known for their convenience, ultimate...`}
                            </p>
                            
                            {/* Details button */}
                            <div className="mt-auto">
                              <Link
                                href={`/places-to-stay/${formatNameForUrl(place.city?.name)}/${formatNameForUrl(place.name)}`}
                                className="bg-[#ea384c] text-white text-sm font-bold py-1 px-4 rounded inline-block"
                              >
                                DETAILS &gt;&gt;
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </React.Fragment>
                    ))
                : 
                  places?.slice((currentPage - 1) * placesPerPage, currentPage * placesPerPage)
                    .map((place) => (
                      <React.Fragment key={place.id}>
                        {/* Card layout matching the uploaded image */}
                        <Card className="overflow-hidden shadow-sm h-full flex flex-col group">
                          <div className="overflow-hidden">
                            <img
                              src={place.image_url || '/placeholder.svg'}
                              alt={place.name}
                              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <CardContent className="flex-1 flex flex-col p-4">
                            {/* Title and rating on the same line */}
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-bold text-[#ea384c]">{place.name}</h3>
                              <div className="flex items-center text-yellow-500">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span className="text-sm">4.5</span>
                              </div>
                            </div>
                            
                            {/* Location badge */}
                            <div className="mb-3">
                              <Link 
                                href={`/cities/${formatNameForUrl(place.city?.name)}`}
                                className="inline-block bg-[rgb(165,180,191)] hover:bg-[rgb(145,160,171)] text-white text-[0.8rem] font-bold px-3 py-1 rounded uppercase transition-colors duration-200"
                              >
                                {place.city?.name || 'Slovenia'}
                              </Link>
                            </div>
                            
                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4">
                              {place.description ? 
                                (place.description.length > 100 ? 
                                  `${place.description.substring(0, 100)}...` : 
                                  place.description) : 
                                `${place.name} are located in the centre of ${place.city?.name || 'Slovenia'} and are well known for their convenience, ultimate...`}
                            </p>
                            
                            {/* Details button */}
                            <div className="mt-auto">
                              <Link
                                href={`/places-to-stay/${formatNameForUrl(place.city?.name)}/${formatNameForUrl(place.name)}`}
                                className="bg-[#ea384c] text-white text-sm font-bold py-1 px-4 rounded inline-block"
                              >
                                DETAILS &gt;&gt;
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </React.Fragment>
                    ))
              )}
            </div>
            
            {/* Pagination controls */}
            {(filteredPlaces?.length ?? 0) > 0 && (
              <div className="mt-10 flex flex-col items-center">
                <div className="text-gray-600 mb-4 md:mb-0 mr-auto pb-5">
                  Showing {Math.min(currentPage * placesPerPage, filteredPlaces?.length ?? 0)} of {filteredPlaces?.length ?? 0} Places to Stay
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.ceil((filteredPlaces?.length ?? 0) / placesPerPage)).keys()].map(page => (
                      <button
                        key={page + 1}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === page + 1 ? 'bg-[#ea384c] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setCurrentPage(page + 1)}
                      >
                        {page + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={filteredPlaces ? currentPage === Math.ceil(filteredPlaces.length / placesPerPage) : true}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            {/* Use the CSS module class to style the sidebar */}
            <div className={styles.sidebarWrapper}>
              <Sidebar 
                showWeatherWidget={true}
                showTourCategories={false}
                showTravelGuides={true}
                width="lg:w-1/4" // Keep the default width prop
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacesToStay;
