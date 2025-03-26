"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { toursAPI } from "@/utils/api";
import Sidebar from "@/components/common/Sidebar";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SkeletonCard from "@/components/ui/skeleton-card";
import PageTitle from "@/components/PageTitle";
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight, Clock, Tag } from "lucide-react";
import TourCard from "@/components/TourCard";

interface Article {
  id: number;
  title: string;
  content: string;
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
}

const createExcerpt = (content: string, maxLength: number = 100): string => {
  const textOnly = content.replace(/<\/?[^>]+(>|$)/g, "");
  return textOnly.length > maxLength 
    ? textOnly.substring(0, maxLength) + "..." 
    : textOnly;
};

interface Tour {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  duration: string;
  booking_link: string;
  city_id: string;
  tour_type_id: string | null;
  cities?: {
    name: string;
  }[] | {
    name: string;
  };
  tour_types?: {
    id: string;
    name: string;
  }[] | {
    id: string;
    name: string;
  };
}

interface TourType {
  id: string;
  name: string;
  description: string;
}

const cities = [
  "Ljubljana", 
  "Nova Gorica", 
  "Ptuj", 
  "Celje", 
  "Novo Mesto", 
  "Portorož", 
  "Maribor", 
  "Koper", 
  "Piran", 
  "Bled", 
  "Kranjska Gora", 
  "Kranj", 
  "Postojna"
];

interface ToursProps {
  initialCategory?: string;
  initialCity?: string;
  onTitleChange?: (title: string, description: string) => void;
}

const Tours: React.FC<ToursProps> = ({ initialCategory, initialCity, onTitleChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const categoryParam = initialCategory || searchParams.get('category');
  const cityParam = initialCity || searchParams.get('city');

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | undefined>(cityParam || undefined);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTourType, setSelectedTourType] = useState<string | undefined>(categoryParam || undefined);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [loadingTourTypes, setLoadingTourTypes] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 12; // 4 rows x 3 cards
  const [filteredTours, setFilteredTours] = useState<Tour[] | undefined>(undefined);

  // Function to handle setting a tour type and updating the URL
  const handleTourTypeSelect = (typeName: string | undefined) => {
    setSelectedTourType(typeName);
    
    // Update URL for SEO
    if (typeName) {
      const typeSlug = slugify(typeName);
      const citySlug = selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : '';
      router.push(`/tours?category=${encodeURIComponent(typeSlug)}${citySlug}`);
    } else if (selectedCity) {
      // If no type is selected but city is, keep city in URL
      router.push(`/tours?city=${encodeURIComponent(selectedCity)}`);
    } else {
      // If no type or city is selected, go back to the main tours page
      router.push('/tours');
    }
  };

  // Function to handle setting a city and updating the URL
  const handleCitySelect = (cityName: string | undefined) => {
    setSelectedCity(cityName);
    
    // Update URL for SEO
    if (cityName) {
      const citySlug = encodeURIComponent(cityName);
      const typeParam = selectedTourType ? `&category=${encodeURIComponent(selectedTourType)}` : '';
      router.push(`/tours?city=${citySlug}${typeParam}`);
    } else if (selectedTourType) {
      // If a type is selected but city is cleared, keep the type in the URL
      router.push(`/tours?category=${encodeURIComponent(selectedTourType)}`);
    } else {
      // If no type or city is selected, go back to the main tours page
      router.push('/tours');
    }
  };

  const handleSearch = (query: string) => {
    applyFilters(query, selectedCity, selectedTourType ? [selectedTourType] : []);
  };

  // Function to apply all filters (search, city, tour types)
  const applyFilters = (query: string = searchQuery, city: string | undefined = selectedCity, selectedTypeNames: string[] = selectedTourType ? [selectedTourType] : []) => {
    if (!tours) {
      return;
    }

    let filtered = [...tours];

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(tour => {
        const title = tour.name.toLowerCase();
        const description = tour.description.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        return title.includes(searchQuery) || description.includes(searchQuery);
      });
    }

    // Apply city filter
    if (city) {
      filtered = filtered.filter(tour => {
        if (!tour.cities) return false;
        
        if (Array.isArray(tour.cities)) {
          return tour.cities.some((c: { name: string }) => c.name === city);
        } else {
          return tour.cities.name === city;
        }
      });
    }

    // Apply tour type filter
    if (selectedTypeNames.length > 0) {
      filtered = filtered.filter(tour => {
        if (!tour.tour_types) return false;
        
        if (Array.isArray(tour.tour_types)) {
          return tour.tour_types.some((t: { name: string }) => selectedTypeNames.includes(t.name));
        } else {
          return selectedTypeNames.includes(tour.tour_types.name);
        }
      });
    }

    setFilteredTours(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Simplify the fetchTourTypes function to avoid errors
  const fetchTourTypes = async () => {
    try {
      setLoadingTourTypes(true);
      console.log("Fetching tour types from API...");
      
      // Use the API utility instead of direct Supabase call
      const response = await toursAPI.getTourTypes();
      
      if (response && typeof response === 'object' && 'data' in response) {
        console.log("Tour types fetched successfully:", response.data);
        setTourTypes(response.data as TourType[]);
      }
    } catch (error) {
      console.error('Unexpected error fetching tour types:', error);
    } finally {
      setLoadingTourTypes(false);
    }
  };

  // Update the useEffect to remove the fetchArticles call
  useEffect(() => {
    console.log("Tours component mounted, fetching tour types...");
    fetchTourTypes();
  }, []);

  const { data: tours, isLoading, error } = useQuery({
    queryKey: ["tours"],
    queryFn: async () => {
      try {
        console.log("Fetching tours from API...");

        // Use the API utility instead of direct Supabase call
        const response = await toursAPI.getTours({
          city: selectedCity,
          category: selectedTourType,
          search: searchQuery
        });

        if (response && typeof response === 'object' && 'data' in response) {
          console.log("Tours data from API:", response.data);
          return response.data as Tour[];
        }
        
        return [] as Tour[];
      } catch (err) {
        console.error("Error fetching tours:", err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false
  });

  // Update filteredTours whenever tours data changes or filters change
  useEffect(() => {
    if (tours) {
      applyFilters(searchQuery, selectedCity, selectedTourType ? [selectedTourType] : []);
    }
  }, [tours, selectedCity, selectedTourType, searchQuery]);

  // Effect to handle URL parameters on initial load and URL changes
  useEffect(() => {
    // Check if we have category or city params in the URL
    if (categoryParam && tourTypes.length > 0) {
      // Find the matching tour type by slug
      const matchingType = tourTypes.find(
        type => slugify(type.name) === categoryParam
      );
      
      if (matchingType) {
        setSelectedTourType(matchingType.name);
      }
    }
    
    if (cityParam) {
      // Find the matching city by slug
      const matchingCity = cities.find(
        city => slugify(city) === cityParam
      );
      
      if (matchingCity) {
        setSelectedCity(matchingCity);
      }
    }
  }, [categoryParam, cityParam, tourTypes]);

  // Log when selectedTourType or selectedCity changes
  useEffect(() => {
    console.log("Title parameters changed:", { selectedTourType, selectedCity });
    console.log("Current page title should be:", getPageTitle());
  }, [selectedTourType, selectedCity]);

  // Update URL when filters change
  const updateUrlWithFilters = (type?: string, city?: string) => {
    let newPath = '/tours';
    
    if (type) {
      newPath = `/tours/categories/${type}`;
      if (city) {
        newPath = `/tours/categories/${type}/${city}`;
      }
    }
    
    router.push(newPath);
  };

  // Generate page title and description based on selected filters
  const getPageTitle = () => {
    const title = selectedTourType 
      ? `${selectedTourType
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')} in ${selectedCity || 'Slovenia'}`
      : selectedCity 
        ? `Tours & Activities in ${selectedCity}` 
        : "Slovenia Tours - Discover the best of Slovenia";
    
    console.log("Page title generated:", title);
    return title;
  };

  const getPageDescription = () => {
    if (selectedTourType && selectedCity) {
      return `Discover the best ${selectedTourType.toLowerCase()} in ${selectedCity}. Book your perfect tour experience in Slovenia today!`;
    } else if (selectedTourType) {
      const tourTypeDescription = tourTypes.find(tt => tt.name === selectedTourType)?.description;
      return tourTypeDescription || `Explore Slovenia with our ${selectedTourType.toLowerCase()}. Find and book the best tours and activities across Slovenia.`;
    } else if (selectedCity) {
      return `Discover the best tours and activities in ${selectedCity}. Book your perfect Slovenia experience today!`;
    }
    return "Discover the best tours and activities across Slovenia. Find and book your perfect Slovenia experience today!";
  };

  // Add a function to get alternative tours when no matches are found
  const getAlternativeTours = () => {
    if (!tours) return [];
    
    // If no tours match the current filters, prioritize tours from Ljubljana (capital)
    // and then from other popular cities based on the popularity column
    
    // First, try to get tours from Ljubljana if it's not the currently selected city
    if (selectedCity?.toLowerCase() !== 'ljubljana') {
      const ljubljanaTours = tours.filter((tour: Tour) => {
        const tourCity = tour.cities && 
          (Array.isArray(tour.cities) 
            ? tour.cities[0]?.name 
            : tour.cities.name);
        
        return tourCity?.toLowerCase() === 'ljubljana';
      });
      
      // If we found tours in Ljubljana, return a random selection (up to 4)
      if (ljubljanaTours.length > 0) {
        // Shuffle the array to get random tours
        const shuffled = [...ljubljanaTours].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
      }
    }
    
    // If no Ljubljana tours or Ljubljana is the selected city,
    // get random tours from other categories
    const otherTours = tours.filter((tour: Tour) => {
      const tourCity = tour.cities && 
        (Array.isArray(tour.cities) 
          ? tour.cities[0]?.name 
          : tour.cities.name);
      
      // Exclude tours from the currently selected city and tour type
      const cityMatch = selectedCity ? tourCity?.toLowerCase() === selectedCity.toLowerCase() : false;
      const typeMatch = selectedTourType ? 
        (tour.tour_types && 
          (Array.isArray(tour.tour_types) 
            ? tour.tour_types[0]?.name.toLowerCase() === selectedTourType.toLowerCase()
            : tour.tour_types.name.toLowerCase() === selectedTourType.toLowerCase())
        ) : false;
      
      return !(cityMatch && typeMatch);
    });
    
    // Shuffle the array to get random tours
    const shuffled = [...otherTours].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Keep only this one
  useEffect(() => {
    if (onTitleChange) {
      onTitleChange(getPageTitle(), getPageDescription());
    }
  }, [selectedCity, selectedTourType, onTitleChange]);

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <PageTitle title="Tours & Activities" description="Discover the best tours and activities in Slovenia" />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Error Loading Tours</h1>
            <p className="text-red-500 mb-4">Failed to load tours. Error details:</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <PageTitle title={getPageTitle()} description={getPageDescription()} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#ea384c]">
          {getPageTitle()}
        </h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            key="show-all"
            className={`py-2 px-4 rounded-full text-sm ${!selectedCity ? "bg-[#ea384c] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => {
              handleCitySelect(undefined);
              handleTourTypeSelect(undefined);
              setSearchQuery("");
              if (tours) {
                setFilteredTours(tours);
              }
              setCurrentPage(1);
            }}
          >
            SHOW ALL
          </button>
          {cities.map((city) => (
            <button
              key={city}
              className={`py-2 px-4 rounded-full text-sm ${selectedCity === city ? "bg-[#ea384c] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => {
                handleCitySelect(selectedCity === city ? undefined : city);
              }}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="prose max-w-none mb-8">
          <p className="text-gray-600 leading-relaxed">
            {selectedTourType && selectedCity 
              ? `Looking for the best ${selectedTourType.toLowerCase()} in ${selectedCity}? You've come to the right place. We've curated a selection of ${selectedTourType.toLowerCase()} that showcase the best of ${selectedCity}.`
              : selectedTourType
                ? (tourTypes.find(tt => tt.name === selectedTourType)?.description || 
                   `Explore Slovenia with our ${selectedTourType.toLowerCase()}. We've curated the best ${selectedTourType.toLowerCase()} across Slovenia to help you discover this beautiful country.`)
                : selectedCity
                  ? `Discover the best tours and activities in ${selectedCity}. From walking tours to day trips, we've curated the perfect experiences to help you explore ${selectedCity}.`
                  : `Looking for the best Slovenia tours? You've come to the right place. Slovenia has much to explore. We've curated a selection of tours we think you'll love. You can click through to our tour partners to complete your booking.`
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <div className="relative w-full md:w-auto flex-grow">
                <input
                  type="text"
                  placeholder="Search by name or keyword"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea384c] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className="text-gray-500 text-sm whitespace-nowrap">
                  Now showing {filteredTours?.length ?? 0} {(filteredTours?.length ?? 0) === 1 ? 'tour' : 'tours'}
                </span>
                <div className="flex gap-2 border border-gray-200 rounded-md p-1">
                  <button
                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Show message when no tours match the filters */}
            {filteredTours && filteredTours.length === 0 && selectedTourType && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-yellow-800">
                  Sorry, no tours currently matched your search for {selectedTourType
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')} in {selectedCity || 'Slovenia'}
                </h2>
                <p className="text-yellow-700 mb-4">
                  {selectedCity?.toLowerCase() !== 'ljubljana' && getAlternativeTours().some(tour => {
                    const tourCity = tour.cities && 
                      (Array.isArray(tour.cities) 
                        ? tour.cities[0]?.name 
                        : tour.cities.name);
                    return tourCity?.toLowerCase() === 'ljubljana';
                  }) 
                    ? `We found some interesting tours in Ljubljana, Slovenia's capital city, that you might enjoy:`
                    : `We found these other tours that may be of interest:`
                  }
                </p>
                
                {/* Show alternative tours based on city */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
                  {getAlternativeTours().slice(0, 4).map((tour: Tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </div>
            )}

            {/* Show tours when there are matches */}
            {(!filteredTours || filteredTours.length > 0) && (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : (
                  filteredTours ? (
                    filteredTours
                      .slice((currentPage - 1) * toursPerPage, currentPage * toursPerPage)
                      .map((tour: Tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))
                  ) : null
                )}
              </div>
            )}

            {/* Pagination - only show when there are tours */}
            {filteredTours && filteredTours.length > 0 && (
              <div className="mt-10 flex flex-col items-center">
                <div className="text-gray-600 mb-4 md:mb-0 mr-auto pb-5">
                  Showing {(filteredTours?.length ?? 0) > 0 ? Math.min(currentPage * toursPerPage, filteredTours?.length ?? 0) : 0} of {filteredTours?.length ?? 0} Tours and Tickets
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
                    {[...Array(Math.ceil((filteredTours?.length ?? 0) / toursPerPage)).keys()].map(page => (
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
                    disabled={filteredTours ? currentPage === Math.ceil(filteredTours.length / toursPerPage) : true}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <Sidebar 
            showWeatherWidget={true}
            showTourCategories={true}
            showTravelGuides={true}
            selectedTourTypes={selectedTourType ? [selectedTourType] : []}
            setSelectedTourTypes={(types) => {
              // Since we only want one type at a time, we take the first one or undefined
              const newType = types.length > 0 ? types[0] : undefined;
              handleTourTypeSelect(newType);
            }}
            tourTypesList={tourTypes.length > 0 ? tourTypes.map(tt => tt.name) : [
              "Walking Tours",
              "Day Trips",
              "Cultural Tours",
              "Food & Drink",
              "Outdoor Activities",
              "City Tours",
              "Historical Tours",
              "Wine Tours"
            ]}
            isLoadingTourTypes={loadingTourTypes}
          />
        </div>
      </div>
    </div>
  );
};

export default Tours;
