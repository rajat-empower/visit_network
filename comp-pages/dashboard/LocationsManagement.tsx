"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Settings, RefreshCw } from "lucide-react";
import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast, Toaster } from "sonner";
import { getApiUrl, ENDPOINTS } from "@/utils/api-config";
//import { useInView } from "react-intersection-observer";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CityPopulation {
  name: string;
  population: number;
  country: string;
}

interface ViatorDestination {
  id: string;
  name: string;
  region: string;
  destinationId: string;
  destinationName: string;
  destinationType: string;
  parentId: string | null;
  timeZone: string;
  iataCode: string;
  coordinates: Coordinates;
  sortOrder?: number;
  countryName?: string;
  population?: number;
  lookupId?: string;
}

interface RegionCityMap {
  [countryId: string]: string[];
}

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

const LocationsManagement: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<ViatorDestination[]>([]);
  const [cities, setCities] = useState<ViatorDestination[]>([]);
  const [selectedCities, setSelectedCities] = useState<RegionCityMap>({});
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch cities whenever selected countries change
  useEffect(() => {
    if (selectedCountries.length > 0) {
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedCountries]);

  const fetchCities = async () => {
    try {
      // Check if we have any selected countries
      if (!selectedCountries || selectedCountries.length === 0) {
        setCities([]);
        return;
      }

      const loadingToast = toast.loading('Loading cities...', {
        description: `Fetching cities for ${selectedCountries.length} selected ${selectedCountries.length === 1 ? 'country' : 'countries'}`
      });

      // Filter out any invalid/null IDs and join with commas
      const validCountryIds = selectedCountries.filter(Boolean).join(',');
      
      if (!validCountryIds) {
        throw new Error('No valid country IDs to fetch cities');
      }

      const response = await fetch(
        getApiUrl(`${ENDPOINTS.LOCATIONS.CITIES}?parentId=${validCountryIds}`),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      setCities(data.data.items);
      
      toast.success('Cities loaded successfully', {
        description: `Found ${data.data.items.length} cities in ${selectedCountries.length} ${selectedCountries.length === 1 ? 'country' : 'countries'}`
      });

      toast.dismiss(loadingToast);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to load cities', {
        description: error instanceof Error ? error.message : 'Could not load cities for selected countries'
      });
      setCities([]); // Reset cities on error
    }
  };

  // Fetch existing mappings on component mount
  useEffect(() => {
    fetchExistingMappings();
  }, []);

  const fetchExistingMappings = async () => {
    const loadingToast = toast.loading('Loading existing mappings...', {
      description: 'Fetching countries and their mapped cities'
    });

    try {
      // First fetch all countries
      const countriesResponse = await fetch(getApiUrl(ENDPOINTS.LOCATIONS.COUNTRIES));
      const countriesData = await countriesResponse.json();
      
      if (countriesData.status === 'error') {
        throw new Error(countriesData.message);
      }
      
      const allCountries = countriesData.data.items;
      setCountries(allCountries);
      
      // Then fetch mappings
      const mappingsResponse = await fetch(getApiUrl(ENDPOINTS.LOCATIONS.MAPPINGS));
      const mappingsData = await mappingsResponse.json();
      
      if (mappingsData.status === 'error') {
        throw new Error(mappingsData.message);
      }

      const { countryMappings } = mappingsData.data;

      if (countryMappings && Object.keys(countryMappings).length > 0) {
        // Convert numeric IDs to strings for frontend use
        const normalizedMappings = Object.entries(countryMappings).reduce((acc, [countryId, cityIds]) => {
          const stringCountryId = String(countryId);
          const stringCityIds = Array.isArray(cityIds) ? cityIds.map(String) : [];
          acc[stringCountryId] = stringCityIds;
          return acc;
        }, {} as Record<string, string[]>);

        // Get valid country IDs that exist in our available countries
        const mappedCountryIds = Object.keys(normalizedMappings).filter(countryId => {
          const matchingCountry = allCountries.find((c: ViatorDestination) => String(c.id) === String(countryId));
          return !!matchingCountry;
        });

        if (mappedCountryIds.length > 0) {
          setSelectedCountries(mappedCountryIds);

          const validMappings = mappedCountryIds.reduce((acc, countryId) => {
            if (normalizedMappings[countryId]) {
              acc[countryId] = normalizedMappings[countryId];
            }
            return acc;
          }, {} as Record<string, string[]>);

          setSelectedCities(validMappings);

          const validCountryIds = mappedCountryIds.join(',');
          const citiesResponse = await fetch(
            getApiUrl(`${ENDPOINTS.LOCATIONS.CITIES}?parentId=${validCountryIds}`),
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );
          
          const citiesData = await citiesResponse.json();
          if (citiesData.status === 'success') {
            setCities(citiesData.data.items);
            
            const totalMappedCities = Object.values(validMappings)
              .reduce((sum: number, cityIds: string[]) => sum + cityIds.length, 0);
            
            toast.success('Mappings loaded successfully', {
              description: `Found ${mappedCountryIds.length} ${mappedCountryIds.length === 1 ? 'country' : 'countries'} with ${totalMappedCities} mapped ${totalMappedCities === 1 ? 'city' : 'cities'}`
            });
          }
        }
      } else {
        toast.info('No existing mappings found', {
          description: 'Select countries and cities to create new mappings'
        });
      }
    } catch (error) {
      console.error('Error fetching mappings:', error);
      toast.error('Failed to load mappings', {
        description: error instanceof Error ? error.message : 'Could not load existing mappings'
      });
    } finally {
      setInitialLoadDone(true);
      toast.dismiss(loadingToast);
    }
  };

  const handleCountrySelect = (country: ViatorDestination) => {
    const countryId = String(country.destinationId);
    if (!selectedCountries.includes(countryId)) {
      setSelectedCountries([...selectedCountries, countryId]);
      setSelectedCities(prev => ({
        ...prev,
        [countryId]: prev[countryId] || []
      }));
      toast.success('Country added', {
        description: `Added ${country.destinationName} to selected countries`
      });
    }
    setOpen(false);
  };

  const removeCountry = (countryId: string) => {
    const country = countries.find((c: ViatorDestination) => String(c.id) === String(countryId));
    setSelectedCountries(selectedCountries.filter((id: string) => id !== countryId));
    setSelectedCities((prev: RegionCityMap) => {
      const newSelected = { ...prev };
      delete newSelected[countryId];
      return newSelected;
    });
    if (country) {
      toast.info('Country removed', {
        description: `Removed ${country.destinationName} and its cities from selection`
      });
    }
  };

  const toggleCity = (cityId: string, countryId: string) => {
    const city = cities.find(c => String(c.destinationId) === cityId);
    
    setSelectedCities((prev: RegionCityMap) => {
      const newSelected = { ...prev };
      if (!newSelected[countryId]) {
        newSelected[countryId] = [];
      }
      
      if (newSelected[countryId].includes(cityId)) {
        newSelected[countryId] = newSelected[countryId].filter((id: string) => id !== cityId);
        if (city) {
          toast.info('City removed', {
            description: `Removed ${city.destinationName} from selection`
          });
        }
      } else {
        newSelected[countryId] = [...newSelected[countryId], cityId];
        if (city) {
          toast.success('City added', {
            description: `Added ${city.destinationName} to selection`
          });
        }
      }

      // Only remove country from selectedCountries if no cities are selected
      if (newSelected[countryId].length === 0) {
        delete newSelected[countryId];
        setSelectedCountries((prev: string[]) => prev.filter((id: string) => id !== countryId));
        const country = countries.find((c: ViatorDestination) => String(c.id) === String(countryId));
        if (country) {
          toast.info('Country removed', {
            description: `Removed ${country.destinationName} as no cities are selected`
          });
        }
      }

      return newSelected;
    });
  };

  const handleSaveMapping = async () => {
    if (Object.keys(selectedCities).length === 0) {
      toast.warning('No cities selected', {
        description: 'Please select at least one city to save the mapping'
      });
      return;
    }

    const loadingToast = toast.loading('Saving mappings...', {
      description: 'Updating country and city mappings'
    });

    setLoading(true);
    try {
      // Convert string IDs to numbers before sending to backend
      const numericMappings = Object.entries(selectedCities).reduce((acc, [countryId, cityIds]) => {
        acc[Number(countryId)] = cityIds.map(Number);
        return acc;
      }, {} as Record<number, number[]>);

      const response = await fetch(getApiUrl(ENDPOINTS.LOCATIONS.MAPPING), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          mappings: numericMappings
        }),
      });

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      const totalCountries = Object.keys(selectedCities).length;
      const totalCities = Object.values(selectedCities).reduce((sum, cities) => sum + cities.length, 0);
      
      toast.success('Mappings saved successfully', {
        description: `Updated mappings for ${totalCountries} ${totalCountries === 1 ? 'country' : 'countries'} and ${totalCities} ${totalCities === 1 ? 'city' : 'cities'}`
      });
      
      // Refresh the mappings
      await fetchExistingMappings();
    } catch (error) {
      console.error('Error updating mapping:', error);
      toast.error('Failed to save mappings', {
        description: error instanceof Error ? error.message : 'Could not update location mappings'
      });
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  if (!initialLoadDone) {
    return (
      <div className="space-y-6" style={{ paddingTop: '25px' }}>
        <Toaster position="top-right" richColors />
        <div className="flex justify-between items-center">
          <PageTitle 
            title="Locations Management" 
            description="Manage countries and cities for your network" 
          />
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            Loading existing mappings...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageTitle 
          title="Locations Management" 
          description="Manage countries and cities for your network" 
        />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Manage Locations</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Select countries and manage their cities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Country Selector */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Countries</label>
            <div className="border rounded-md p-2 min-h-[80px] w-full md:w-[300px]">
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((countryId) => {
                  const country = countries.find((c: ViatorDestination) => String(c.id) === String(countryId));
                  return country ? (
                    <Badge 
                      key={countryId} 
                      variant="secondary" 
                      className="flex items-center gap-1 text-xs md:text-sm"
                    >
                      <button
                        onClick={() => removeCountry(countryId)}
                        className="text-xs hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                      {country.destinationName || country.name}
                      {country.iataCode && (
                        <span className="text-xs text-gray-500 ml-1">({country.iataCode})</span>
                      )}
                    </Badge>
                  ) : null;
                })}
              </div>
              
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-start text-left mt-1 text-sm md:text-base"
                  >
                    Select countries...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search countries..." 
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                      className="text-sm md:text-base"
                    />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country.id}
                          onSelect={() => handleCountrySelect(country)}
                          className="text-sm md:text-base"
                        >
                          {country.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Cities List */}
          <div>
            <h3 className="text-sm md:text-base font-medium mb-4">Cities</h3>
            <div className="border rounded-md divide-y max-h-[400px] md:max-h-[600px] overflow-y-auto">
              {cities.map((city) => {
                if (!city.parentId) return null;
                
                const country = countries.find(c => c.destinationId === city.parentId);
                const cityId = String(city.destinationId);
                const parentId = String(city.parentId);
                
                return (
                  <div
                    key={cityId}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4"
                  >
                    <div className="flex items-start md:items-center space-x-4 w-full md:w-auto">
                      <Checkbox
                        checked={!!parentId && selectedCities[parentId]?.includes(cityId)}
                        onCheckedChange={() => parentId && toggleCity(cityId, parentId)}
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-medium text-sm md:text-base">{city.destinationName}</span>
                        <span className="text-xs text-gray-500">
                          {city.iataCode && `${city.iataCode} • `}
                          {city.timeZone}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600 font-medium">Population:</span>
                          <span className="text-xs text-gray-600">
                            {city.population !== undefined
                              ? new Intl.NumberFormat().format(city.population)
                              : (
                                <span className="text-gray-400 italic">
                                  No Population Found
                                </span>
                              )
                            }
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-black text-white hover:bg-black/80 text-xs md:text-sm whitespace-nowrap">
                        {city.countryName || country?.name || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      {city.coordinates && (
                        <span className="text-xs text-gray-500 hidden md:inline">
                          {city.coordinates.latitude.toFixed(2)}, {city.coordinates.longitude.toFixed(2)}
                        </span>
                      )}
                      <Link
                        href={`/dashboard/locations/cities/${city.destinationId}`}
                        className="flex items-center text-xs md:text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })}
              {cities.length === 0 && selectedCountries.length > 0 && (
                <div className="p-4 text-center text-sm md:text-base text-gray-500">
                  No cities found for the selected countries
                </div>
              )}
              {selectedCountries.length === 0 && (
                <div className="p-4 text-center text-sm md:text-base text-gray-500">
                  Select countries to view their cities
                </div>
              )}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveMapping}
              disabled={loading || Object.keys(selectedCities).length === 0}
              className="w-full md:w-auto text-sm md:text-base"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsManagement; 